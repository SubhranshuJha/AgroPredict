import numpy as np
import joblib
from tensorflow.keras.models import load_model
from app.services.preprocess_service import create_wide_dataframe


# Load once
model = load_model("app/ml/model.keras")
feature_scaler = joblib.load("app/ml/feature_scaler.pkl")
target_scaler = joblib.load("app/ml/target_scaler.pkl")
config = joblib.load("app/ml/columns.pkl") 

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

    # Check enough data
    if len(scaled_data) < 7:
        raise Exception("Not enough data for prediction (need 7 days)")

    # Last 7 days
    last_7_days = scaled_data[-7:]

    # Reshape for LSTM
    X = np.array([last_7_days])  # (1, 7, 76)

    # Predict
    pred_scaled = model.predict(X)

    # Inverse scaling
    pred = target_scaler.inverse_transform(pred_scaled)

    return pred[0]