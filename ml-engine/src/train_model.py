from sklearn.linear_model import LinearRegression

def train_model(X_train, y_train):
    """
    Trains a LinearRegression model on the scaled features to predict hdi_score.
    """
    print("\n" + "="*40)
    print("MODEL TRAINING")
    print("="*40)
    print("Training Linear Regression model...")
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    print("Model training completed.")
    print("Coefficients:")
    for col, coef in zip(X_train.columns, model.coef_):
        print(f"  {col}: {coef:.4f}")
    print(f"Intercept: {model.intercept_:.4f}")
    print("="*40 + "\n")
    
    return model
