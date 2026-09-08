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
    raise ValueError("GEMINI_API_KEY nao definida no .env")

MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-flash-lite",
]

async def process_image_data(image_data: bytes):
    print("1. Iniciando processamento...")
    img_base64 = base64.b64encode(image_data).decode('utf-8')
    print("2. Base64 gerado, tamanho:", len(img_base64))

    prompt = """
    Voce e um especialista em herpetologia da regiao do sertao do Ceara, Brasil (especificamente na cidade de Boa Viagem). A foto que voce vai analisar foi tirada nessa regiao, que e caracterizada pelo bioma Caatinga.

    Sua tarefa e identificar a especie de cobra na imagem com o MAIOR NIVEL DE ESPECIFICIDADE POSSIVEL, priorizando as especies tipicas da Caatinga e do Nordeste brasileiro.

    As especies mais comuns na regiao sao:
    - Jararaca-da-seca (Bothrops erythromelas) - PECONHENTA, comum na Caatinga.
    - Cascavel (Crotalus durissus) - PECONHENTA, com guizo na cauda.
    - Coral-verdadeira (Micrurus ibiboboca) - PECONHENTA, aneis vermelho/preto/branco.
    - Coral-falsa (Oxyrhopus trigeminus) - INOFENSIVA, imita a coral-verdadeira.
    - Cobra-cipo (Philodryas nattereri) - INOFENSIVA, agil e esverdeada.
    - Jiboia (Boa constrictor) - INOFENSIVA, grande e manchada.

    Responda APENAS com um JSON no seguinte formato:
    {
        "name": "Nome popular da cobra",
        "scientific": "Nome cientifico completo",
        "venomous": true/false,
        "venom_type": "Tipo de veneno ou null",
        "protected": true/false,
        "protection_status": "Status de protecao",
        "description": "Breve descricao da especie",
        "first_aid": "Primeiros socorros se for venenosa, ou null",
        "confidence": 0.0
    }
    IMPORTANTE: Retorne APENAS o JSON, sem texto adicional. confidence deve ser um numero entre 0.0 e 1.0.
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
    max_attempts = 3
    base_delay = 2

    for attempt in range(1, max_attempts + 1):
        print(f"Tentativa {attempt}...")
        for model_name in MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={API_KEY}"
            try:
                print(f"  Chamando modelo {model_name}...")
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(url, json=payload)
                    print(f"  Status: {response.status_code}")
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
                            print(f"  Sucesso com {model_name}.")
                            return {
                                "success": True,
                                "confidence": confidence,
                                "data": data,
                                "model_used": model_name,
                                "attempt": attempt
                            }
                        else:
                            last_error = f"JSON nao encontrado na resposta de {model_name}"
                            print(f"  {last_error}")
                            continue
                    elif response.status_code == 503:
                        last_error = f"Modelo {model_name} sobrecarregado"
                        print(f"  {last_error}")
                        continue
                    else:
                        last_error = f"Modelo {model_name} retornou {response.status_code}: {response.text[:200]}"
                        print(f"  {last_error}")
                        continue
            except httpx.TimeoutException:
                last_error = f"Timeout no modelo {model_name}"
                print(f"  {last_error}")
                continue
            except Exception as e:
                last_error = f"Erro no modelo {model_name}: {str(e)}"
                print(f"  {last_error}")
                continue

        if attempt < max_attempts:
            wait_time = base_delay * (2 ** (attempt - 1))
            print(f"Aguardando {wait_time}s...")
            await asyncio.sleep(wait_time)

    raise HTTPException(
        status_code=503,
        detail=f"Servico indisponivel. Ultimo erro: {last_error}"
    )

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
