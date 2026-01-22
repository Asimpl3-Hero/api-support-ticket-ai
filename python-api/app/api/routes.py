from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    ProcessTicketRequest,
    ProcessTicketResponse,
    AnalyzeTextRequest,
    AnalyzeTextResponse,
    CreateTicketRequest,
    CreateTicketResponse
)
from app.services.ticket_service import get_ticket_by_id, update_ticket, create_ticket
from app.services.ai_service import analyze_ticket

router = APIRouter()


@router.post(
    "/process-ticket",
    response_model=ProcessTicketResponse,
    summary="Procesar un ticket de soporte",
    response_description="Ticket procesado con categoría y sentimiento detectados",
    responses={
        200: {
            "description": "Ticket procesado exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
                        "category": "soporte técnico",
                        "sentiment": "negativo",
                        "processed": True,
                        "message": "Ticket procesado exitosamente"
                    }
                }
            }
        },
        404: {
            "description": "Ticket no encontrado",
            "content": {
                "application/json": {
                    "example": {"detail": "Ticket con ID 550e8400-e29b-41d4-a716-446655440000 no encontrado"}
                }
            }
        },
        400: {
            "description": "Ticket sin descripción",
            "content": {
                "application/json": {
                    "example": {"detail": "El ticket no tiene descripción para analizar"}
                }
            }
        }
    }
)
def process_ticket(request: ProcessTicketRequest):
    """
    Procesa un ticket de soporte existente en Supabase.

    Este endpoint realiza las siguientes operaciones:

    1. **Obtiene el ticket** de la base de datos Supabase usando el ID proporcionado
    2. **Analiza el texto** utilizando un modelo LLM (Mistral-7B) via Hugging Face
    3. **Extrae la categoría** del ticket (facturación, soporte técnico, ventas, etc.)
    4. **Detecta el sentimiento** (positivo, negativo, neutro)
    5. **Actualiza el ticket** en Supabase marcándolo como `processed: true`

    Si el ticket ya fue procesado anteriormente, retorna los resultados existentes
    sin volver a procesarlo.
    """
    ticket = get_ticket_by_id(request.ticket_id)

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket con ID {request.ticket_id} no encontrado"
        )

    if ticket.get("processed"):
        return ProcessTicketResponse(
            ticket_id=request.ticket_id,
            category=ticket.get("category", ""),
            sentiment=ticket.get("sentiment", ""),
            processed=True,
            message="El ticket ya había sido procesado anteriormente"
        )

    description = ticket.get("description", "")
    if not description:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ticket no tiene descripción para analizar"
        )

    analysis = analyze_ticket(description)

    update_ticket(
        ticket_id=request.ticket_id,
        category=analysis["category"],
        sentiment=analysis["sentiment"]
    )

    return ProcessTicketResponse(
        ticket_id=request.ticket_id,
        category=analysis["category"],
        sentiment=analysis["sentiment"],
        processed=True,
        message="Ticket procesado exitosamente"
    )


@router.post(
    "/analyze-text",
    response_model=AnalyzeTextResponse,
    summary="Analizar texto directamente",
    response_description="Categoría y sentimiento detectados del texto",
    responses={
        200: {
            "description": "Texto analizado exitosamente",
            "content": {
                "application/json": {
                    "examples": {
                        "negativo": {
                            "summary": "Ticket de queja",
                            "value": {
                                "category": "facturación",
                                "sentiment": "negativo"
                            }
                        },
                        "positivo": {
                            "summary": "Feedback positivo",
                            "value": {
                                "category": "información general",
                                "sentiment": "positivo"
                            }
                        },
                        "neutro": {
                            "summary": "Consulta general",
                            "value": {
                                "category": "ventas",
                                "sentiment": "neutro"
                            }
                        }
                    }
                }
            }
        },
        400: {
            "description": "Texto vacío",
            "content": {
                "application/json": {
                    "example": {"detail": "El texto no puede estar vacío"}
                }
            }
        }
    }
)
def analyze_text(request: AnalyzeTextRequest):
    """
    Analiza un texto directamente sin persistirlo en la base de datos.

    Este endpoint es útil para:

    - **Pruebas rápidas** del modelo de IA
    - **Análisis ad-hoc** de textos sin crear tickets
    - **Integración** con otros sistemas que solo necesitan el análisis

    El análisis utiliza el mismo modelo LLM (Mistral-7B) que el procesamiento
    de tickets, pero no guarda resultados en Supabase.
    """
    if not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El texto no puede estar vacío"
        )

    analysis = analyze_ticket(request.text)

    return AnalyzeTextResponse(
        category=analysis["category"],
        sentiment=analysis["sentiment"]
    )


@router.post(
    "/create-ticket",
    response_model=CreateTicketResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo ticket de soporte",
    response_description="Ticket creado exitosamente",
    responses={
        201: {
            "description": "Ticket creado exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
                        "description": "No puedo acceder a mi cuenta",
                        "category": None,
                        "sentiment": None,
                        "processed": False,
                        "message": "Ticket creado exitosamente"
                    }
                }
            }
        },
        400: {
            "description": "Descripción vacía",
            "content": {
                "application/json": {
                    "example": {"detail": "La descripción no puede estar vacía"}
                }
            }
        }
    }
)
def create_ticket_endpoint(request: CreateTicketRequest):
    """
    Crea un nuevo ticket de soporte en Supabase.

    Este endpoint:

    1. **Recibe la descripción** del problema o consulta del cliente
    2. **Opcionalmente** puede recibir categoría y sentimiento pre-definidos
    3. **Inserta el ticket** en Supabase con `processed: false`
    4. **Supabase notifica** a sistemas externos (n8n) via Realtime/Webhooks

    El ticket quedará pendiente de procesamiento con IA.
    """
    if not request.description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La descripción no puede estar vacía"
        )

    ticket = create_ticket(
        description=request.description.strip(),
        category=request.category,
        sentiment=request.sentiment
    )

    return CreateTicketResponse(
        ticket_id=ticket["id"],
        description=ticket["description"],
        category=ticket.get("category"),
        sentiment=ticket.get("sentiment"),
        processed=ticket.get("processed", False),
        message="Ticket creado exitosamente"
    )
