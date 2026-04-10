from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model #type = ignore
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
    return predict_next_days(df, days=1)[0]


def predict_next_days(df, days=1):
    if days < 1:
        raise ValueError("days must be at least 1")

    # Filter commodities and convert to wide format in raw (unscaled) space
    filtered_df = df[df["Commodity"].isin(good_comms)]
    raw_wide_df = create_wide_dataframe(filtered_df)
    raw_wide_df = raw_wide_df.reindex(columns=feature_cols, fill_value=0)

    if len(raw_wide_df) < 14:
        raise Exception("Not enough data for prediction (need 14 days)")

    target_cols = config["target_cols"]
    future_predictions = []

    for _ in range(days):
        # Scale only at prediction time so appended rows remain in raw space
        scaled_data = feature_scaler.transform(raw_wide_df)
        last_14_days = scaled_data[-14:]
        X = np.array([last_14_days])

        pred_scaled = model.predict(X, verbose=0)
        pred = target_scaler.inverse_transform(pred_scaled)[0]
        prediction = dict(zip(target_cols, pred))
        future_predictions.append(prediction)

        # Build the next-day feature row by carrying forward last known values,
        # then replacing modal columns with predicted values.
        next_row = raw_wide_df.iloc[-1].copy()
        for col_name, value in prediction.items():
            if col_name in next_row.index:
                next_row[col_name] = float(value)

        next_date = pd.to_datetime(raw_wide_df.index[-1]) + pd.Timedelta(days=1)
        raw_wide_df.loc[next_date] = next_row

    return future_predictions
