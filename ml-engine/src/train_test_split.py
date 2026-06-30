from sklearn.model_selection import train_test_split

def split_data(df):
    """
    Splits the DataFrame into training and testing sets (75/25),
    stratifying by hdi_category to ensure representation of all HDI classes.
    """
    features = ["life_expectancy", "mean_years_schooling", "expected_years_schooling", "gni_per_capita"]
    
    X = df[features]
    y = df["hdi_score"]
    
    # Stratified split based on the categorised HDI
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.25, 
        random_state=42, 
        stratify=df["hdi_category"]
    )
    
    print("\n" + "="*40)
    print("TRAIN/TEST SPLIT")
    print("="*40)
    print(f"X_train shape: {X_train.shape}")
    print(f"y_train shape: {y_train.shape}")
    print(f"X_test shape:  {X_test.shape}")
    print(f"y_test shape:  {y_test.shape}")
    print("="*40 + "\n")
    
    return X_train, X_test, y_train, y_test
