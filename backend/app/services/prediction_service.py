from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model #type = ignore
from app.services.preprocess_service import add_time_series_features, create_wide_dataframe

ML_DIR = Path(__file__).resolve().parents[1] / "ml"

CATEGORY_MODELS = {
    "cereals": {
        "folder": "cereals",
        "model": "model_cereals.keras",
        "feature_scaler": "feature_scaler_cereals.pkl",
        "target_scaler": "target_scaler_cereals.pkl",
    },
    "fruits": {
        "folder": "fruits",
        "model": "model_Fruits.keras",
        "feature_scaler": "feature_scaler_Fruits.pkl",
        "target_scaler": "target_scaler_Fruits.pkl",
    },
    "vegetables": {
        "folder": "vegetable",
        "model": "model_Vegetables.keras",
        "feature_scaler": "feature_scaler_Vegetables.pkl",
        "target_scaler": "target_scaler_Vegetables.pkl",
    },
}

_loaded_categories = {}


def _load_category(category):
    if category in _loaded_categories:
        return _loaded_categories[category]

    model_config = CATEGORY_MODELS.get(category)
    if model_config is None:
        raise ValueError(f"Unknown prediction category: {category}")

    folder = ML_DIR / model_config["folder"]
    model = load_model(folder / model_config["model"], compile=False)
    feature_scaler = joblib.load(folder / model_config["feature_scaler"])
    target_scaler = joblib.load(folder / model_config["target_scaler"])

    feature_cols = list(feature_scaler.feature_names_in_)
    target_cols = list(target_scaler.feature_names_in_)
    commodities = [col.removesuffix("_Modal") for col in target_cols]

    loaded = {
        "model": model,
        "feature_scaler": feature_scaler,
        "target_scaler": target_scaler,
        "feature_cols": feature_cols,
        "target_cols": target_cols,
        "commodities": commodities,
        "lookback": model.input_shape[1] or 14,
    }
    _loaded_categories[category] = loaded
    return loaded


def prepare_input(df, category="cereals"):
    loaded = _load_category(category)
    df = df[df["Commodity"].isin(loaded["commodities"])]
    wide_df = add_time_series_features(create_wide_dataframe(df))
    wide_df = wide_df.reindex(columns=loaded["feature_cols"], fill_value=0)
    feature_scaler = loaded["feature_scaler"]
    scaled_data = feature_scaler.transform(wide_df)

    return scaled_data


def get_category_commodities(category="cereals"):
    return _load_category(category)["commodities"]


def predict_next_day(df, category="cereals"):
    return predict_next_days(df, days=1, category=category)[0]


def predict_next_days(df, days=1, category="cereals"):
    if days < 1:
        raise ValueError("days must be at least 1")

    loaded = _load_category(category)
    model = loaded["model"]
    feature_scaler = loaded["feature_scaler"]
    target_scaler = loaded["target_scaler"]
    feature_cols = loaded["feature_cols"]
    target_cols = loaded["target_cols"]
    commodities = loaded["commodities"]
    lookback = loaded["lookback"]

    # Filter commodities and convert to wide format in raw (unscaled) space
    filtered_df = df[df["Commodity"].isin(commodities)]
    raw_wide_df = create_wide_dataframe(filtered_df).astype(float)

    if len(raw_wide_df) < lookback:
        raise Exception(f"Not enough data for prediction (need {lookback} days)")

    future_predictions = []

    for _ in range(days):
        # Scale only at prediction time so appended rows remain in raw space
        feature_df = add_time_series_features(raw_wide_df)
        feature_df = feature_df.reindex(columns=feature_cols, fill_value=0)
        scaled_data = feature_scaler.transform(feature_df)
        last_window = scaled_data[-lookback:]
        X = np.array([last_window])

        pred_scaled = model.predict(X, verbose=0)
        pred = target_scaler.inverse_transform(pred_scaled)[0]
        prediction = dict(zip(target_cols, pred))
        future_predictions.append(prediction)

        # Build the next-day raw row by carrying forward last known values,
        # then replacing modal columns with predicted values.
        next_row = raw_wide_df.iloc[-1].copy()
        for col_name, value in prediction.items():
            if col_name in next_row.index:
                next_row[col_name] = float(value)

        next_date = pd.to_datetime(raw_wide_df.index[-1]) + pd.Timedelta(days=1)
        raw_wide_df.loc[next_date] = next_row

    return future_predictions
