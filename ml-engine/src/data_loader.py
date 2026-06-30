import os
import pandas as pd

def load_data(file_path="data/hdi_dataset.csv"):
    """
    Loads the HDI dataset, extracts the required columns for the year 2023,
    renames them to standardized names, and returns a cleaned DataFrame.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset not found at {file_path}")

    # Read dataset with encoding fallback
    try:
        df = pd.read_csv(file_path, encoding="utf-8")
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(file_path, encoding="latin1")
        except UnicodeDecodeError:
            df = pd.read_csv(file_path, encoding="cp1252")

    # Required columns for the year 2023
    column_mapping = {
        "country": "country",
        "le_2023": "life_expectancy",
        "mys_2023": "mean_years_schooling",
        "eys_2023": "expected_years_schooling",
        "gnipc_2023": "gni_per_capita",
        "hdi_2023": "hdi_score"
    }

    # Verify columns exist
    missing_cols = [col for col in column_mapping.keys() if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns in dataset: {missing_cols}")

    # Select and rename columns
    df_selected = df[list(column_mapping.keys())].rename(columns=column_mapping)

    # Clean country name (remove leading/trailing spaces)
    df_selected["country"] = df_selected["country"].astype(str).str.strip()

    # Drop rows where the target (hdi_score) is null since we can't train on them
    df_cleaned = df_selected.dropna(subset=["hdi_score"]).reset_index(drop=True)

    print(f"Data loaded successfully. Original shape: {df.shape}, Cleaned shape: {df_cleaned.shape}")
    return df_cleaned
