import json
import re
import httpx
from app.core.config import get_settings


CATEGORIES = [
    "facturación",
    "soporte técnico",
    "ventas",
    "devoluciones",
    "información general",
    "quejas",
    "otros"
]

SENTIMENTS = ["positivo", "negativo", "neutro"]

HF_API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1"


def analyze_ticket(ticket_text: str) -> dict:
    """
    Analiza un ticket de soporte y extrae la categoría y el sentimiento.

    Args:
        ticket_text: El texto del ticket a analizar.

    Returns:
        Un diccionario con 'category' y 'sentiment'.
    """
    settings = get_settings()

    prompt = f"""Eres un asistente que analiza tickets de soporte al cliente.

Analiza el siguiente ticket y responde ÚNICAMENTE con un JSON válido con dos campos:
- "category": una de estas categorías: {", ".join(CATEGORIES)}
- "sentiment": uno de estos sentimientos: {", ".join(SENTIMENTS)}

Ticket: "{ticket_text}"

Responde SOLO con el JSON, ejemplo: {{"category": "soporte técnico", "sentiment": "negativo"}}"""

    headers = {
        "Authorization": f"Bearer {settings.huggingface_api_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 256,
            "temperature": 0.1,
            "return_full_text": False
        }
    }

    with httpx.Client(timeout=60.0) as client:
        response = client.post(HF_API_URL, headers=headers, json=payload)
        response.raise_for_status()

    result = response.json()

    if isinstance(result, list) and len(result) > 0:
        generated_text = result[0].get("generated_text", "")
        return parse_llm_response(generated_text)

    return {"category": "otros", "sentiment": "neutro"}


def parse_llm_response(response: str) -> dict:
    """
    Parsea la respuesta del LLM y extrae el JSON.

    Args:
        response: La respuesta del modelo LLM.

    Returns:
        Un diccionario con 'category' y 'sentiment'.
    """
    try:
        json_match = re.search(r'\{[^}]+\}', response)
        if json_match:
            result = json.loads(json_match.group())

            category = result.get("category", "otros").lower()
            sentiment = result.get("sentiment", "neutro").lower()

            if category not in CATEGORIES:
                category = "otros"
            if sentiment not in SENTIMENTS:
                sentiment = "neutro"

            return {
                "category": category,
                "sentiment": sentiment
            }
    except (json.JSONDecodeError, AttributeError):
        pass

    return {
        "category": "otros",
        "sentiment": "neutro"
    }
