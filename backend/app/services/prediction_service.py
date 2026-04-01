import numpy as np
import joblib
from tensorflow.keras.models import load_model
from app.services.preprocess_service import create_wide_dataframe


# 🔹 Load everything ONCE (important for performance)
model = load_model("app/ml/model.keras")
feature_scaler = joblib.load("app/ml/feature_scaler.pkl")
target_scaler = joblib.load("app/ml/target_scaler.pkl")
columns = joblib.load("app/ml/columns.pkl")


def prepare_input(df):
    # 🔹 Convert to wide format
    wide_df = create_wide_dataframe(df)

    # 🔹 Match training columns
    wide_df = wide_df.reindex(columns=columns, fill_value=0)

    # 🔹 Scale features
    scaled_data = feature_scaler.transform(wide_df)

    return scaled_data


def predict_next_day(df):
    scaled_data = prepare_input(df)

    # 🔹 Take last 7 days
    if len(scaled_data) < 7:
        raise Exception("Not enough data for prediction (need 7 days)")

    last_7_days = scaled_data[-7:]

    # 🔹 Reshape for LSTM
    X = np.array([last_7_days])  # shape: (1, 7, features)

    # 🔹 Predict
    pred_scaled = model.predict(X)

    # 🔹 Inverse transform
    pred = target_scaler.inverse_transform(pred_scaled)

    return pred[0]  # return 1D array