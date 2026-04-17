from pathlib import Path
import joblib
from tensorflow.keras.models import load_model

# Define ML_DIR directly (best practice)
ML_DIR = Path(__file__).resolve().parent / "ml"

# Load model
model = load_model(r"D:\AgroPredict\AgroPredict_Dev\AgroPredict\ML_model\best_model_Cereals (1).keras" , compile=False)
print("✅ Model loaded successfully")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)

# Load config
# config = joblib.load(r"D:\AgroPredict\AgroPredict_Dev\AgroPredict\ML_model\columns (3).pkl")

# feature_cols = config["feature_cols"]
# good_comms = config["good_commodities"]

# # print("Feature columns:", feature_cols)
# print("Output commodities:", good_comms)