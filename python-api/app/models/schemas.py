from pydantic import BaseModel, Field


class ProcessTicketRequest(BaseModel):
    """Solicitud para procesar un ticket existente en la base de datos."""

    ticket_id: str = Field(
        ...,
        description="UUID del ticket a procesar",
        json_schema_extra={"example": "550e8400-e29b-41d4-a716-446655440000"}
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"ticket_id": "550e8400-e29b-41d4-a716-446655440000"}
            ]
        }
    }


class ProcessTicketResponse(BaseModel):
    """Respuesta del procesamiento de un ticket."""

    ticket_id: str = Field(
        ...,
        description="UUID del ticket procesado"
    )
    category: str = Field(
        ...,
        description="Categoría detectada del ticket",
        json_schema_extra={"example": "soporte técnico"}
    )
    sentiment: str = Field(
        ...,
        description="Sentimiento detectado en el ticket",
        json_schema_extra={"example": "negativo"}
    )
    processed: bool = Field(
        ...,
        description="Indica si el ticket fue procesado exitosamente"
    )
    message: str = Field(
        ...,
        description="Mensaje descriptivo del resultado",
        json_schema_extra={"example": "Ticket procesado exitosamente"}
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
                    "category": "soporte técnico",
                    "sentiment": "negativo",
                    "processed": True,
                    "message": "Ticket procesado exitosamente"
                }
            ]
        }
    }


class AnalyzeTextRequest(BaseModel):
    """Solicitud para analizar un texto directamente."""

    text: str = Field(
        ...,
        min_length=1,
        description="Texto del ticket a analizar",
        json_schema_extra={"example": "Mi factura está incorrecta, me cobraron el doble del monto acordado. Necesito una solución urgente."}
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"text": "Mi factura está incorrecta, me cobraron el doble del monto acordado. Necesito una solución urgente."},
                {"text": "Excelente servicio, muy satisfecho con la atención recibida."},
                {"text": "Quisiera información sobre los planes disponibles para empresas."}
            ]
        }
    }


class AnalyzeTextResponse(BaseModel):
    """Respuesta del análisis de texto."""

    category: str = Field(
        ...,
        description="Categoría detectada del texto. Valores posibles: facturación, soporte técnico, ventas, devoluciones, información general, quejas, otros",
        json_schema_extra={"example": "facturación"}
    )
    sentiment: str = Field(
        ...,
        description="Sentimiento detectado. Valores posibles: positivo, negativo, neutro",
        json_schema_extra={"example": "negativo"}
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "category": "facturación",
                    "sentiment": "negativo"
                },
                {
                    "category": "información general",
                    "sentiment": "neutro"
                }
            ]
        }
    }
