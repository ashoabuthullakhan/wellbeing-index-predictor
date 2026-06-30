import os
import sys
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI app
app = FastAPI(title="HDI Insight ML Service", description="FastAPI microservice for predicting HDI scores")

# Configure CORS
# In production, these should be set to your Render frontend and backend URLs
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
backend_url = os.getenv("BACKEND_URL", "http://localhost:5000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, backend_url, "http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to saved model artifacts
MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
MODEL_PATH = os.path.join(MODELS_DIR, "hdi_model.pkl")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(MODELS_DIR, "label_encoder.pkl")

# Global variables for loaded artifacts
model = None
scaler = None
label_encoder = None

@app.on_event("startup")
def load_artifacts():
    """Loads saved model, scaler, and label encoder on service startup."""
    global model, scaler, label_encoder
    try:
        if not (os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH) and os.path.exists(ENCODER_PATH)):
            raise FileNotFoundError("Model pickle artifacts not found. Please run the training pipeline first.")
        
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        label_encoder = joblib.load(ENCODER_PATH)
        print("FastAPI: Successfully loaded all model artifacts.")
    except Exception as e:
        print(f"FastAPI: Error loading model artifacts: {e}")
        # We don't raise here to allow the server to start, but requests will fail with 500

# Input data validation schema
class PredictionRequest(BaseModel):
    life_expectancy: float = Field(..., ge=20.0, le=100.0, description="Life expectancy at birth (years)")
    mean_years_schooling: float = Field(..., ge=0.0, le=25.0, description="Mean years of schooling (years)")
    expected_years_schooling: float = Field(..., ge=0.0, le=30.0, description="Expected years of schooling (years)")
    gni_per_capita: float = Field(..., ge=100.0, le=150000.0, description="Gross National Income per capita (PPP $)")

    class Config:
        json_schema_extra = {
            "example": {
                "life_expectancy": 75.2,
                "mean_years_schooling": 10.5,
                "expected_years_schooling": 13.8,
                "gni_per_capita": 18500.0
            }
        }

class PredictionResponse(BaseModel):
    hdi_score: float
    hdi_category: str

@app.get("/health")
def health():
    """Health check endpoint to verify service status."""
    if model is None or scaler is None or label_encoder is None:
        return {"status": "unhealthy", "detail": "Pickle artifacts not loaded"}
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    """
    Accepts developmental indicators, processes them, 
    and predicts the HDI score and classification category.
    """
    global model, scaler, label_encoder
    
    if model is None or scaler is None or label_encoder is None:
        raise HTTPException(
            status_code=500, 
            detail="Model is not initialized. Please ensure the pipeline has been run."
        )

    try:
        # Convert request to dictionary matching feature names and order
        feature_order = ["life_expectancy", "mean_years_schooling", "expected_years_schooling", "gni_per_capita"]
        input_data = {
            "life_expectancy": payload.life_expectancy,
            "mean_years_schooling": payload.mean_years_schooling,
            "expected_years_schooling": payload.expected_years_schooling,
            "gni_per_capita": payload.gni_per_capita
        }
        
        # Create DataFrame
        input_df = pd.DataFrame([input_data])[feature_order]
        
        # Scale features
        input_scaled = scaler.transform(input_df)
        
        # Predict HDI Score
        # We wrap back into DataFrame to prevent UserWarnings regarding feature names
        input_scaled_df = pd.DataFrame(input_scaled, columns=feature_order)
        raw_pred_score = model.predict(input_scaled_df)[0]
        
        # Cap score between 0.0 and 1.0 (valid HDI range)
        hdi_score = max(0.0, min(1.0, float(raw_pred_score)))
        
        # Determine category using UNDP thresholds
        if hdi_score >= 0.800:
            hdi_category = "Very High"
        elif hdi_score >= 0.700:
            hdi_category = "High"
        elif hdi_score >= 0.550:
            hdi_category = "Medium"
        else:
            hdi_category = "Low"
            
        return {
            "hdi_score": round(hdi_score, 4),
            "hdi_category": hdi_category
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")
