import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import joblib

class CropPredictionPipeline:
    def __init__(self, model_path, scaler_path=None):
        # Load the trained LSTM model
        self.model = tf.keras.models.load_model(model_path)
        self.commodities = [
            'Bajra(Pearl Millet/Cumbu)', 'Barley(Jau)', 'Beaten Rice', 'Foxtail Millet(Navane)', 
            'Hybrid Cumbu', 'Jowar(Sorghum)', 'Kodo Millet(Varagu)', 'Kutki', 'Maize', 
            'Paddy(Basmati)', 'Paddy(Common)', 'Ragi(Finger Millet)', 'Rice', 'Sajje', 
            'Same/Savi', 'Sweet Corn ', 'T.V. Cumbu', 'Wheat'
        ]
        self.scaler = MinMaxScaler()
        if scaler_path:
            self.scaler = joblib.load(scaler_path)

    def raw_to_wide(self, raw_csv_path):
        """Converts raw website report to the 72-feature wide format."""
        df = pd.read_csv(raw_csv_path, skiprows=1)
        df.columns = ['Group', 'Commodity', 'Date', 'Qty', 'Unit', 'Price', 'Price_Unit']
        df['Date'] = pd.to_datetime(df['Date'], dayfirst=True)
        
        # Pivot and filter
        pivot = df.pivot(index='Date', columns='Commodity', values='Price')
        for col in self.commodities:
            if col not in pivot.columns: pivot[col] = np.nan
        pivot = pivot[self.commodities].sort_index().ffill().bfill()

        # Create 4 lags (_1 to _4)
        lags = []
        for i in range(4):
            lag_df = pivot.shift(i)
            lag_df.columns = [f"{c}_{i+1}" for c in pivot.columns]
            lags.append(lag_df)
        
        wide_df = pd.concat(lags, axis=1).dropna()
        return wide_df

    def get_predictions(self, wide_df):
        """Prepares sequences, predicts tomorrow's price, and inverse scales."""
        # 1. Scale data
        scaled_data = self.scaler.transform(wide_df)
        
        # 2. Create input sequence (Model needs last 7 days)
        # Input shape: (1, 7, 72)
        last_7_days = scaled_data[-7:]
        X_input = np.expand_dims(last_7_days, axis=0)
        
        # 3. Predict
        prediction_scaled = self.model.predict(X_input)
        
        # 4. Inverse Transform to get actual prices
        prediction_actual = self.scaler.inverse_transform(prediction_scaled)
        
        # Create a result table for the 18 commodities
        res = pd.DataFrame({
            'Commodity': self.commodities,
            'Predicted_Price_Tomorrow': prediction_actual[0][:18] # Only take the _1 columns
        })
        return res