from app.config.database import engine, Base
from app.models.historical import HistoricalData
from app.models.prediction import Prediction

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created ")
