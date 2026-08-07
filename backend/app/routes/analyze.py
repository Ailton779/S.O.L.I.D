from fastapi import APIRouter, UploadFile, File
from PIL import Image
import io
import random
from app.models.snakes import snakes

router = APIRouter()

def mock_classify():
    key = random.choice(list(snakes.keys()))
    return key, round(random.uniform(0.75, 0.99), 2)

@router.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    contents = await image.read()
    img = Image.open(io.BytesIO(contents))
    img = img.resize((224, 224))

    snake_key, confidence = mock_classify()
    snake_data = snakes[snake_key]

    return {
        "success": True,
        "confidence": confidence,
        "data": snake_data
    }
