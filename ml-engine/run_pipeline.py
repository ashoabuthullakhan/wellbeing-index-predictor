import sys
import os

# Add src directory to path to allow importing pipeline modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))

from data_loader import load_data
from eda import run_eda
from preprocess import preprocess
from train_test_split import split_data
from train_model import train_model
from evaluate_model import evaluate_model
from save_model import save_model

def main():
    print("="*50)
    print("RUNNING HDI INSIGHT ML PIPELINE")
    print("="*50)
    
    # Step 2: Load Data
    df = load_data("data/hdi_dataset.csv")
    
    # Step 2 (cont.): Run EDA
    run_eda(df, reports_dir="reports")
    
    # Step 3: Preprocessing
    df_processed, scaler, encoder = preprocess(df, models_dir="models")
    
    # Step 4: Train/Test Split
    X_train, X_test, y_train, y_test = split_data(df_processed)
    
    # Step 5: Model Training
    model = train_model(X_train, y_train)
    
    # Step 6: Model Evaluation
    evaluate_model(model, X_test, y_test, reports_dir="reports")
    
    # Step 7: Save Model & Run Self-Test
    save_model(model, models_dir="models")
    
    print("="*50)
    print("ML PIPELINE SUCCESSFULLY EXECUTED")
    print("="*50)

if __name__ == "__main__":
    main()
