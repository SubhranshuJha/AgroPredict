from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 🔹 Replace with your actual DB credentials
DATABASE_URL = "postgresql://postgres:golu4923@localhost:5432/agropredict"

# Engine
engine = create_engine(DATABASE_URL)

# Session (used for DB operations)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class (for models)
Base = declarative_base()


# Dependency (used in FastAPI routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()