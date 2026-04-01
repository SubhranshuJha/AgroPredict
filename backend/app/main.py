from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import fetch, predict, data

app = FastAPI(title="AgroPredict API")

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("🚀 AgroPredict API started")

app.include_router(fetch.router, prefix="/fetch", tags=["Fetch"])
app.include_router(predict.router, prefix="/predict", tags=["Predict"])
app.include_router(data.router, prefix="/data", tags=["Data"])


@app.get("/")
def root():
    return {"message": "AgroPredict API is running successfully!"}