from fastapi import APIRouter, UploadFile, File, HTTPException
import io
import os
import json
import re
import base64
import httpx
from PIL import Image

router = APIRouter()

API_KEY = os.getenv("GEMINI_API_KEY")

# Modelos para tentar (em ordem de preferência)
MODELS = [
    "gemini-3.5-flash",
    "gemini-2.5-pro",
    "gemini-2.5-flash-lite",
    "gemini-3.6-flash",
]

# Espécies-alvo do sistema (para ajudar o Gemini a focar)
TARGET_SPECIES = """
- Jararaca-da-seca (Bothrops erythromelas) - PEÇONHENTA, comum na Caatinga.
- Cascavel (Crotalus durissus) - PEÇONHENTA, com guizo na cauda.
- Coral-verdadeira (Micrurus ibiboboca) - PEÇONHENTA, anéis vermelho/preto/branco.
- Coral-falsa (Oxyrhopus trigeminus) - INOFENSIVA, imita a coral-verdadeira.
- Cobra-cipó (Philodryas nattereri) - INOFENSIVA, ágil e esverdeada.
- Jiboia (Boa constrictor) - INOFENSIVA, grande e manchada.
- Cobra-espada (Dryophylax phoenix) - LEVEMENTE PEÇONHENTA, comum no Cariri.
- Falsa-coral (Oxyrhopus guibei) - INOFENSIVA, semelhante à coral-falsa.
"""

@router.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Arquivo vazio")

        img_base64 = base64.b64encode(contents).decode('utf-8')

        # Prompt com contexto regional e lista de espécies
        prompt = f"""
        Você é um especialista em herpetologia da região do sertão do Ceará, Brasil (especificamente na cidade de Boa Viagem). A foto que você vai analisar foi tirada nessa região, que é caracterizada pelo bioma Caatinga.

        Sua tarefa é identificar a espécie de cobra na imagem com o MAIOR NÍVEL DE ESPECIFICIDADE POSSÍVEL, priorizando as espécies típicas da Caatinga e do Nordeste brasileiro.

        As espécies mais comuns na região são:
        {TARGET_SPECIES}

        Responda APENAS com um JSON no seguinte formato:
        {{
            "name": "Nome popular da cobra (use o nome mais comum na região)",
            "scientific": "Nome científico completo (ex: Bothrops erythromelas)",
            "venomous": true/false,
            "venom_type": "Tipo de veneno (ex: Neurotóxico, Hemotóxico, etc.) ou null se não for venenosa",
            "protected": true/false,
            "protection_status": "Status de proteção (ex: 'Não ameaçada', 'Monitorada pelo ICMBio', etc.)",
            "description": "Breve descrição da espécie, destacando características marcantes visíveis na foto",
            "first_aid": "Primeiros socorros em caso de picada (se for venenosa), ou null se não for",
            "confidence": "Número entre 0.0 e 1.0 indicando o quão confiante você está na identificação. Leve em conta a qualidade da imagem, nitidez, ângulo, iluminação e se as características diagnósticas são visíveis. Ex: 0.95 para alta confiança, 0.70 para média, 0.40 para baixa."
        }}

        IMPORTANTE: 
        - Se a foto for de uma jararaca com padrão de manchas típico da Caatinga, identifique como Bothrops erythromelas (Jararaca-da-seca), e NÃO como Bothrops jararaca (que é mais comum na Mata Atlântica).
        - Use o conhecimento sobre a distribuição geográfica para refinar a identificação.
        - Retorne APENAS o JSON, sem texto adicional.
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
                                "model_used": model_name
                            }
                        else:
                            continue
                    elif response.status_code == 503:
                        last_error = f"Modelo {model_name} sobrecarregado"
                        continue
                    else:
                        last_error = f"Modelo {model_name} retornou {response.status_code}"
                        continue
            except Exception as e:
                last_error = str(e)
                continue

        raise HTTPException(status_code=503, detail=f"Todos os modelos estão indisponíveis. Último erro: {last_error}")

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Tempo limite excedido ao chamar a API Gemini")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar: {str(e)}")
