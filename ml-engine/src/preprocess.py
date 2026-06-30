import os
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib

def preprocess(df, models_dir="models"):
    """
    Imputes missing values with medians, categorizes HDI scores,
    encodes the category, and scales the numerical features.
    Saves scaler and encoder to models_dir.
    """
    df = df.copy()

    # Features and target
    features = ["life_expectancy", "mean_years_schooling", "expected_years_schooling", "gni_per_capita"]
    all_numeric = features + ["hdi_score"]

    # Impute missing values with column medians
    for col in all_numeric:
        if col in df.columns:
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)

    # Create hdi_category column using UNDP thresholds
    def get_category(score):
        if score >= 0.800:
            return "Very High"
        elif score >= 0.700:
            return "High"
        elif score >= 0.550:
            return "Medium"
        else:
            return "Low"

    df["hdi_category"] = df["hdi_score"].apply(get_category)

    # Label-encode hdi_category using sklearn LabelEncoder
    le = LabelEncoder()
    # Explicitly fit on all expected classes to avoid issues with missing classes
    le.fit(["Low", "Medium", "High", "Very High"])
    df["hdi_category_encoded"] = le.transform(df["hdi_category"])

    # Scale the 4 numeric features using StandardScaler
    scaler = StandardScaler()
    df_scaled_features = scaler.fit_transform(df[features])
    
    # Put scaled features back in DataFrame for subsequent training steps
    for i, col in enumerate(features):
        df[col] = df_scaled_features[:, i]

    # Save the encoder and scaler to models_dir
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(le, os.path.join(models_dir, "label_encoder.pkl"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.pkl"))

    print(f"Preprocessing completed. Scaler saved to {models_dir}/scaler.pkl and LabelEncoder saved to {models_dir}/label_encoder.pkl")
    
    return df, scaler, le
