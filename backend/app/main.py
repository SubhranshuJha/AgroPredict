from fastapi import FastAPI
from app.api import fetch, predict, data

app = FastAPI(title="AgroPredict API")

# Include routes
app.include_router(fetch.router, prefix="/fetch", tags=["Fetch"])
app.include_router(predict.router, prefix="/predict", tags=["Predict"])
app.include_router(data.router, prefix="/data", tags=["Data"])


@app.get("/")
def root():
    return {"message": "AgroPredict API is running 🚀"}