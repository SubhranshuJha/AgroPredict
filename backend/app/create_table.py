from app.config.database import engine, Base
from app.models.historical import HistoricalCerealsData, HistoricalFruitsData, HistoricalVegetablesData
from app.models.prediction import PredictionCereals, PredictionFruits, PredictionVegetables

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created ")
