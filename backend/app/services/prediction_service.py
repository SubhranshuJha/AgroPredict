from pathlib import Path

import joblib
import numpy as np
from tensorflow.keras.models import load_model
from app.services.preprocess_service import create_wide_dataframe

ML_DIR = Path(__file__).resolve().parents[1] / "ml"

# Load once
model = load_model(ML_DIR / "model.keras")
feature_scaler = joblib.load(ML_DIR / "feature_scaler.pkl")
target_scaler = joblib.load(ML_DIR / "target_scaler.pkl")
config = joblib.load(ML_DIR / "columns.pkl")

feature_cols = config["feature_cols"]
good_comms = config["good_commodities"]


def prepare_input(df):
    # Filter commodities   
    df = df[df["Commodity"].isin(good_comms)]

    # Convert to wide format
    wide_df = create_wide_dataframe(df)

    # Match EXACT training columns
    wide_df = wide_df.reindex(columns=feature_cols, fill_value=0)

    # Scale
    scaled_data = feature_scaler.transform(wide_df)

    return scaled_data


def predict_next_day(df):
    scaled_data = prepare_input(df)

    if len(scaled_data) < 14:
        raise Exception("Not enough data for prediction (need 14 days)")

    last_14_days = scaled_data[-14:]

    X = np.array([last_14_days])

    pred_scaled = model.predict(X, verbose=0)

    # Inverse scaling
    pred = target_scaler.inverse_transform(pred_scaled)
    target_cols = config["target_cols"]
    return dict(zip(target_cols, pred[0]))
