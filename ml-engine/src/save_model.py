import os
import joblib
import pandas as pd

def save_model(model, models_dir="models"):
    """
    Saves the trained model to models_dir/hdi_model.pkl and runs a self-test.
    """
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, "hdi_model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")

    # Self-test code
    print("\n" + "="*40)
    print("SELF-TEST LOADING & PREDICTION")
    print("="*40)

    scaler_path = os.path.join(models_dir, "scaler.pkl")
    encoder_path = os.path.join(models_dir, "label_encoder.pkl")

    # Load all 3 pkl files
    try:
        loaded_model = joblib.load(model_path)
        loaded_scaler = joblib.load(scaler_path)
        loaded_encoder = joblib.load(encoder_path)
        print("Successfully loaded model.pkl, scaler.pkl, and label_encoder.pkl")
    except Exception as e:
        print(f"Failed to load pickle files during self-test: {e}")
        return

    # Print the exact feature order the model expects
    features = ["life_expectancy", "mean_years_schooling", "expected_years_schooling", "gni_per_capita"]
    print(f"Expected Feature Order: {features}")

    # Sample input (Very High HDI candidate)
    sample_data = {
        "life_expectancy": 83.5,
        "mean_years_schooling": 13.5,
        "expected_years_schooling": 18.7,
        "gni_per_capita": 66000.0
    }

    # Convert to DataFrame with explicit column order
    sample_df = pd.DataFrame([sample_data])[features]

    # Transform using fitted scaler
    sample_scaled = loaded_scaler.transform(sample_df)

    # Predict using trained model
    pred_score = loaded_model.predict(pd.DataFrame(sample_scaled, columns=features))[0]

    # Bucket into category
    def get_category(score):
        if score >= 0.800:
            return "Very High"
        elif score >= 0.700:
            return "High"
        elif score >= 0.550:
            return "Medium"
        else:
            return "Low"

    hdi_cat = get_category(pred_score)
    hdi_cat_encoded = loaded_encoder.transform([hdi_cat])[0]

    print("\nSelf-Test Prediction Result:")
    print(f"  Raw Input:              {sample_data}")
    print(f"  Predicted HDI Score:    {pred_score:.4f}")
    print(f"  Predicted HDI Category: {hdi_cat} (Encoded label: {hdi_cat_encoded})")
    print("="*40 + "\n")
