from tensorflow.keras.models import load_model

model = load_model(
    r"D:\AgroPredict\AgroPredict_Dev\AgroPredict\backend\lstm_crop_model.keras",
    compile=False
)

print("✅ Model loaded successfully")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)