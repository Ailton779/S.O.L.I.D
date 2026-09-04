from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import os
import json
import re
import base64
import httpx
import asyncio
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY não definida no .env")

MODELS = [
    "gemini-3.5-flash",
    "gemini-2.5-pro",
    "gemini-2.5-flash-lite",
    "gemini-3.6-flash",
]

async def process_image_data(image_data: bytes):
    """Processa a imagem e chama o Gemini."""
    img_base64 = base64.b64encode(image_data).decode('utf-8')

    prompt = """
    Você é um especialista em herpetologia da região do sertão do Ceará, Brasil (especificamente na cidade de Boa Viagem). A foto que você vai analisar foi tirada nessa região, que é caracterizada pelo bioma Caatinga.

    Sua tarefa é identificar a espécie de cobra na imagem com o MAIOR NÍVEL DE ESPECIFICIDADE POSSÍVEL, priorizando as espécies típicas da Caatinga e do Nordeste brasileiro.

    As espécies mais comuns na região são:
    - Jararaca-da-seca (Bothrops erythromelas) - PEÇONHENTA, comum na Caatinga.
    - Cascavel (Crotalus durissus) - PEÇONHENTA, com guizo na cauda.
    - Coral-verdadeira (Micrurus ibiboboca) - PEÇONHENTA, anéis vermelho/preto/branco.
    - Coral-falsa (Oxyrhopus trigeminus) - INOFENSIVA, imita a coral-verdadeira.
    - Cobra-cipó (Philodryas nattereri) - INOFENSIVA, ágil e esverdeada.
    - Jiboia (Boa constrictor) - INOFENSIVA, grande e manchada.
    - Cobra-espada (Dryophylax phoenix) - LEVEMENTE PEÇONHENTA, comum no Cariri.
    - Falsa-coral (Oxyrhopus guibei) - INOFENSIVA, semelhante à coral-falsa.

    Responda APENAS com um JSON no seguinte formato:
    {
        "name": "Nome popular da cobra (use o nome mais comum na região)",
        "scientific": "Nome científico completo",
        "venomous": true/false,
        "venom_type": "Tipo de veneno (ex: Neurotóxico, Hemotóxico, etc.) ou null",
        "protected": true/false,
        "protection_status": "Status de proteção",
        "description": "Breve descrição da espécie, destacando características marcantes visíveis na foto",
        "first_aid": "Primeiros socorros em caso de picada (se for venenosa), ou null",
        "confidence": "Número entre 0.0 e 1.0 indicando o quão confiante você está"
    }
    IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
    """

    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/jpeg", "data": img_base64}}
            ]
        }]
    }

    last_error = None
    max_attempts = 5
    base_delay = 2

    for attempt in range(1, max_attempts + 1):
        for model_name in MODELS:
            url = f"https://generativelanguage.googleapis.com/v1/models/{model_name}:generateContent?key={API_KEY}"
            try:
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        result = response.json()
                        text = result['candidates'][0]['content']['parts'][0]['text']
                        json_match = re.search(r'\{.*\}', text, re.DOTALL)
                        if json_match:
                            data = json.loads(json_match.group())
                            confidence = data.get("confidence", 0.9)
                            if not isinstance(confidence, (int, float)):
                                confidence = 0.9
                            return {
                                "success": True,
                                "confidence": confidence,
                                "data": data,
                                "model_used": model_name,
                                "attempt": attempt
                            }
                        else:
                            continue
                    elif response.status_code == 503:
                        last_error = f"Modelo {model_name} sobrecarregado (tentativa {attempt})"
                        continue
                    else:
                        last_error = f"Modelo {model_name} retornou {response.status_code}"
                        continue
            except httpx.TimeoutException:
                last_error = f"Timeout no modelo {model_name} (tentativa {attempt})"
                continue
            except Exception as e:
                last_error = f"Erro no modelo {model_name}: {str(e)}"
                continue

        if attempt < max_attempts:
            await asyncio.sleep(base_delay * (2 ** (attempt - 1)))
        else:
            break

    raise HTTPException(
        status_code=503,
        detail=f"Serviço temporariamente indisponível. Todas as {max_attempts} tentativas falharam. Último erro: {last_error}. Tente novamente em alguns minutos."
    )

@router.post("/analyze")
async def analyze_image(request: Request):
    # Tentar ler o corpo como JSON
    try:
        body = await request.json()
    except Exception:
        # Se não for JSON, tenta multipart (para compatibilidade com curl -F)
        form = await request.form()
        if "image" in form:
            image_file = form["image"]
            contents = await image_file.read()
            if not contents:
                raise HTTPException(status_code=400, detail="Arquivo vazio")
            return await process_image_data(contents)
        raise HTTPException(status_code=400, detail="Requisição deve ser JSON ou multipart com 'image'")

    # Se for JSON, verifica se tem image_base64
    if "image_base64" in body:
        try:
            image_data = base64.b64decode(body["image_base64"])
            return await process_image_data(image_data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao decodificar base64: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="JSON deve conter campo 'image_base64'")
