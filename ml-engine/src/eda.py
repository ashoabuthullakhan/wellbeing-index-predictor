import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def run_eda(df, reports_dir="reports"):
    """
    Performs basic Exploratory Data Analysis, printing dataset information
    and saving three diagnostic plots to reports_dir.
    """
    print("\n" + "="*40)
    print("EXPLORATORY DATA ANALYSIS (EDA)")
    print("="*40)

    # Print basic info
    print(f"Dataset Shape: {df.shape}")
    print("\nData Types:")
    print(df.dtypes)
    
    print("\nMissing Values:")
    print(df.isnull().sum())

    print("\nDescriptive Statistics:")
    print(df.describe())

    # Create reports directory if it doesn't exist
    os.makedirs(reports_dir, exist_ok=True)

    # Features to analyze
    numeric_cols = ["life_expectancy", "mean_years_schooling", "expected_years_schooling", "gni_per_capita", "hdi_score"]

    # 1. Distribution Histograms
    plt.figure(figsize=(15, 10))
    for i, col in enumerate(numeric_cols, 1):
        plt.subplot(2, 3, i)
        sns.histplot(df[col].dropna(), kde=True, color="skyblue")
        plt.title(f"Distribution of {col.replace('_', ' ').title()}")
        plt.xlabel(col.replace('_', ' ').title())
        plt.ylabel("Frequency")
    plt.tight_layout()
    dist_path = os.path.join(reports_dir, "feature_distributions.png")
    plt.savefig(dist_path, dpi=150)
    plt.close()
    print(f"Saved distributions plot to: {dist_path}")

    # 2. Correlation Heatmap
    plt.figure(figsize=(8, 6))
    corr = df[numeric_cols].corr()
    sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5, square=True)
    plt.title("Feature Correlation Heatmap")
    plt.tight_layout()
    corr_path = os.path.join(reports_dir, "correlation_heatmap.png")
    plt.savefig(corr_path, dpi=150)
    plt.close()
    print(f"Saved correlation heatmap to: {corr_path}")

    # 3. Boxplot for Outliers
    plt.figure(figsize=(12, 8))
    # Since GNI per capita has a much higher scale, we plot it on a separate subplot
    plt.subplot(1, 2, 1)
    sns.boxplot(data=df[["life_expectancy", "mean_years_schooling", "expected_years_schooling", "hdi_score"]], palette="Set2")
    plt.title("Feature Boxplots (Standard Range)")
    plt.xticks(rotation=15)

    plt.subplot(1, 2, 2)
    sns.boxplot(y=df["gni_per_capita"], color="lightgreen")
    plt.title("GNI per Capita Boxplot")
    
    plt.tight_layout()
    box_path = os.path.join(reports_dir, "feature_boxplots.png")
    plt.savefig(box_path, dpi=150)
    plt.close()
    print(f"Saved boxplots for outliers to: {box_path}")
    print("="*40 + "\n")
