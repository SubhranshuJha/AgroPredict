from app.config.database import engine, Base
from app.models import historical, prediction

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created ✅")