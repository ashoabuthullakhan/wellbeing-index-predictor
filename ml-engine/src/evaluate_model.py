import os
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import r2_score, mean_squared_error

def evaluate_model(model, X_test, y_test, reports_dir="reports"):
    """
    Evaluates the model on the test set, prints performance metrics (R2, RMSE),
    and saves an Actual vs Predicted scatter plot to reports_dir.
    """
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print("\n" + "="*40)
    print("MODEL EVALUATION")
    print("="*40)
    print(f"R² Score (Coefficient of Determination): {r2:.4f}")
    print(f"Root Mean Squared Error (RMSE):        {rmse:.4f}")
    print("="*40 + "\n")
    
    # Create reports directory if it doesn't exist
    os.makedirs(reports_dir, exist_ok=True)
    
    # Save Actual vs Predicted Scatter Plot
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test, y_pred, alpha=0.6, color="purple", edgecolors="w", s=50)
    
    # Plot perfect prediction diagonal line
    min_val = min(y_test.min(), y_pred.min())
    max_val = max(y_test.max(), y_pred.max())
    plt.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2, label="Perfect Fit (y = x)")
    
    plt.xlabel("Actual HDI Score")
    plt.ylabel("Predicted HDI Score")
    plt.title("Actual vs. Predicted HDI Scores")
    plt.legend()
    plt.grid(True, linestyle="--", alpha=0.7)
    
    plt.tight_layout()
    plot_path = os.path.join(reports_dir, "actual_vs_predicted.png")
    plt.savefig(plot_path, dpi=150)
    plt.close()
    
    print(f"Saved actual vs. predicted plot to: {plot_path}")
    
    return r2, rmse
