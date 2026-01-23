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

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"


def analyze_ticket(ticket_text: str) -> dict:
    """
    Analiza un ticket de soporte y extrae la categoría y el sentimiento.

    Args:
        ticket_text: El texto del ticket a analizar.

    Returns:
        Un diccionario con 'category' y 'sentiment'.
    """
    settings = get_settings()

    system_prompt = "Eres un asistente que analiza tickets de soporte al cliente. Responde ÚNICAMENTE con JSON válido."

    user_prompt = f"""Analiza el siguiente ticket y responde con un JSON con dos campos:
- "category": una de estas categorías: {", ".join(CATEGORIES)}
- "sentiment": uno de estos sentimientos: {", ".join(SENTIMENTS)}

Ticket: "{ticket_text}"

Responde SOLO con el JSON, ejemplo: {{"category": "soporte técnico", "sentiment": "negativo"}}"""

    headers = {
        "Authorization": f"Bearer {settings.huggingface_api_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek-ai/DeepSeek-V3:fastest",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": 100,
        "temperature": 0.1
    }

    with httpx.Client(timeout=120.0) as client:
        response = client.post(HF_API_URL, headers=headers, json=payload)
        response.raise_for_status()

    result = response.json()

    if "choices" in result and len(result["choices"]) > 0:
        generated_text = result["choices"][0].get("message", {}).get("content", "")
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
