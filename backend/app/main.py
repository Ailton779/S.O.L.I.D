from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze

app = FastAPI(title="SOLID API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)

@app.get("/")
def root():
    return {"status": "SOLID API online"}
