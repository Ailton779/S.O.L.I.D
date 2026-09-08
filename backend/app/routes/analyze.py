from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import os
import json
import re
import base64
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY nao definida no .env")

MODELS = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
]

async def process_image_data(image_data: bytes):
    print("1. Iniciando processamento...")
    img_base64 = base64.b64encode(image_data).decode('utf-8')
    print("2. Base64 gerado, tamanho:", len(img_base64))

    prompt = """
    Voce e um especialista em herpetologia da regiao do sertao do Ceara, Brasil (especificamente na cidade de Boa Viagem). A foto foi tirada nessa regiao, caracterizada pelo bioma Caatinga.

    Identifique a especie de cobra na imagem priorizando as especies tipicas da Caatinga e do Nordeste brasileiro:
    - Jararaca-da-seca (Bothrops erythromelas) - PECONHENTA
    - Cascavel (Crotalus durissus) - PECONHENTA
    - Coral-verdadeira (Micrurus ibiboboca) - PECONHENTA
    - Coral-falsa (Oxyrhopus trigeminus) - INOFENSIVA
    - Cobra-cipo (Philodryas nattereri) - INOFENSIVA
    - Jiboia (Boa constrictor) - INOFENSIVA

    Responda APENAS com JSON:
    {
        "name": "Nome popular",
        "scientific": "Nome cientifico",
        "venomous": true/false,
        "venom_type": "Tipo de veneno ou null",
        "protected": true/false,
        "protection_status": "Status de protecao",
        "description": "Descricao da especie",
        "first_aid": "Primeiros socorros ou null",
        "confidence": 0.0
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

    for model_name in MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={API_KEY}"
        try:
            print(f"Chamando modelo {model_name}...")
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, json=payload)
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    result = response.json()
                    text = result['candidates'][0]['content']['parts'][0]['text']
                    json_match = re.search(r'\{.*\}', text, re.DOTALL)
                    if json_match:
                        data = json.loads(json_match.group())
                        confidence = data.get("confidence", 0.9)
                        if not isinstance(confidence, (int, float)):
                            try:
                                confidence = float(confidence)
                            except:
                                confidence = 0.9
                        print(f"Sucesso com {model_name}.")
                        return {
                            "success": True,
                            "confidence": confidence,
                            "data": data,
                            "model_used": model_name
                        }
                    else:
                        last_error = f"JSON nao encontrado na resposta de {model_name}"
                        print(last_error)
                elif response.status_code == 404:
                    last_error = f"Modelo {model_name} nao existe"
                    print(last_error)
                    continue
                elif response.status_code == 503:
                    last_error = f"Modelo {model_name} sobrecarregado"
                    print(last_error)
                    continue
                else:
                    last_error = f"Modelo {model_name} retornou {response.status_code}: {response.text[:200]}"
                    print(last_error)
                    continue
        except httpx.TimeoutException:
            last_error = f"Timeout no modelo {model_name}"
            print(last_error)
            continue
        except Exception as e:
            last_error = f"Erro no modelo {model_name}: {str(e)}"
            print(last_error)
            continue

    raise HTTPException(status_code=503, detail=f"Servico indisponivel. Ultimo erro: {last_error}")

@router.post("/analyze")
async def analyze_image(request: Request):
    print("Requisicao recebida em /analyze")
    content_type = request.headers.get("content-type", "")
    print(f"Content-Type: {content_type}")

    if "multipart" in content_type:
        form = await request.form()
        if "image" in form:
            image_file = form["image"]
            contents = await image_file.read()
            if not contents:
                raise HTTPException(status_code=400, detail="Arquivo vazio")
            print("Imagem recebida via multipart.")
            return await process_image_data(contents)
        raise HTTPException(status_code=400, detail="Multipart sem campo 'image'")

    try:
        body = await request.json()
        if "image_base64" in body:
            image_data = base64.b64decode(body["image_base64"])
            print("Base64 decodificado, tamanho:", len(image_data))
            return await process_image_data(image_data)
        raise HTTPException(status_code=400, detail="JSON deve conter campo 'image_base64'")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar requisicao: {str(e)}")
