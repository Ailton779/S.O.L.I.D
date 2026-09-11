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

def normalize_snake_data(data):
    """Ajusta dados para espécies específicas, garantindo consistência."""
    scientific = data.get("scientific", "")
    name = data.get("name", "")

    # Se for Philodryas (cobra-verde), forçar campos específicos
    if "Philodryas" in scientific or "cobra-verde" in name.lower() or "cobra-cipó" in name.lower():
        data["venomous"] = False
        data["venom_type"] = "Opistóglifa (veneno fraco)"
        data["description"] = data.get("description", "") + " Possui veneno fraco e presas traseiras, não representando risco significativo para humanos."
        if not data.get("first_aid"):
            data["first_aid"] = "Lave o local com água e sabão. Em caso de sintomas incomuns, procure atendimento médico."
    return data

async def process_image_data(image_data: bytes):
    print("1. Iniciando processamento...")
    img_base64 = base64.b64encode(image_data).decode('utf-8')
    print("2. Base64 gerado, tamanho:", len(img_base64))

    prompt = """
    Você é um especialista em herpetologia da região do sertão do Ceará, Brasil (especificamente na cidade de Boa Viagem). A foto foi tirada nessa região, caracterizada pelo bioma Caatinga.

    **Regras:**
    1. Se a imagem NÃO contiver uma cobra, responda APENAS com o seguinte JSON:
       {"is_snake": false, "message": "A imagem não contém uma cobra. Por favor, envie uma foto de uma serpente."}
    2. Se a imagem contiver uma cobra, identifique a espécie e responda com o JSON no formato abaixo, incluindo o campo "is_snake": true.

    **ATENÇÃO ESPECIAL — DIFERENÇA ENTRE CORAL-VERDADEIRA E CORAL-FALSA:**

    Estas duas espécies são frequentemente confundidas, mas têm características MUITO distintas. Analise cada uma delas cuidadosamente:

    **CORAL-VERDADEIRA (Micrurus ibiboboca) — PEÇONHENTA:**

    *Formato da cabeça (característica MAIS importante):*
    - A cabeça NÃO se destaca do corpo. Ela se mistura com o corpo, sem transição visível.
    - Não é possível distinguir facilmente onde termina a cabeça e começa o corpo.
    - O formato é cilíndrico e uniforme, como um tubo contínuo.

    *Outras características:*
    - Anéis COMPLETOS que dão a volta em todo o corpo (padrão circular perfeito)
    - Padrão de 3 cores: vermelho, branco/amarelo e preto
    - A cabeça é preta com focinho (nariz) de cor vermelha ou clara
    - Corpo cilíndrico, esbelto e delgado
    - Olhos muito pequenos (quase imperceptíveis)
    - A sequência de cores é: vermelho - branco - preto - vermelho - branco - preto

    **CORAL-FALSA (Oxyrhopus trigeminus) — INOFENSIVA:**

    *Formato da cabeça (característica MAIS importante):*
    - A cabeça se DESTACA claramente do corpo. É possível ver onde termina a cabeça e começa o pescoço/corpo.
    - O formato da cabeça é mais largo e triangular, lembrando uma seta ou flecha.
    - É fácil identificar visualmente onde está a cabeça, pois ela é mais larga que o pescoço.

    *Outras características:*
    - Anéis frequentemente INCOMPLETOS (não dão a volta completa no corpo)
    - Padrão geralmente com apenas 2 cores predominantes (vermelho e preto)
    - A cabeça é preta sem o focinho vermelho distinto
    - Corpo mais robusto e menos esbelto que a coral-verdadeira
    - Olhos maiores e mais visíveis
    - Manchas irregulares podem estar presentes em vez de anéis perfeitos

    **COMO DECIDIR:**

    1. Olhe PRIMEIRO para a cabeça:
       - Se a cabeça se MISTURA com o corpo (não dá para ver onde começa/termina) → CORAL-VERDADEIRA (peçonhenta).
       - Se a cabeça se DESTACA e tem formato triangular/em seta → CORAL-FALSA (inofensiva).

    2. Confirme com o padrão de cores:
       - Três cores (vermelho, branco, preto) com anéis completos → CORAL-VERDADEIRA.
       - Duas cores predominantes (vermelho e preto) com anéis incompletos → CORAL-FALSA.

    **REGRA DE SEGURANÇA:**
    Se mesmo após analisar a cabeça ainda houver dúvida, classifique como CORAL-VERDADEIRA (peçonhenta) com confiança baixa. Priorize SEMPRE a segurança do usuário.

    Identifique a espécie de cobra na imagem priorizando as espécies típicas da Caatinga e do Nordeste brasileiro:
    - Jararaca-da-seca (Bothrops erythromelas) - PEÇONHENTA
    - Cascavel (Crotalus durissus) - PEÇONHENTA
    - Coral-verdadeira (Micrurus ibiboboca) - PEÇONHENTA
    - Coral-falsa (Oxyrhopus trigeminus) - INOFENSIVA
    - Cobra-verde / Cobra-cipó-verde (Philodryas olfersii) - INOFENSIVA para humanos
    - Jiboia (Boa constrictor) - INOFENSIVA

    Responda APENAS com JSON:
    {
        "is_snake": true,
        "name": "Nome popular",
        "scientific": "Nome científico",
        "venomous": true/false,
        "venom_type": "Tipo de veneno ou null (para a cobra-verde use 'Opistóglifa (veneno fraco)')",
        "protected": true/false,
        "protection_status": "Status de proteção",
        "description": "Descrição da espécie (inclua as características visuais que você observou na imagem — especialmente o formato da cabeça e o padrão dos anéis — para justificar a identificação)",
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
                        data = normalize_snake_data(data)
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
