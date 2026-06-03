from fastapi import FastAPI
from sqlalchemy import create_engine
from backend.api import router as api_router
from backend.database.database import Base, engine

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to Dart Scoring Platform"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(api_router)

