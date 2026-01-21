import pytest
from pydantic import ValidationError
from app.models.schemas import (
    ProcessTicketRequest,
    ProcessTicketResponse,
    AnalyzeTextRequest,
    AnalyzeTextResponse
)


class TestProcessTicketRequest:
    """Tests para el schema ProcessTicketRequest."""

    def test_valid_ticket_id(self):
        """Debe aceptar un ticket_id válido."""
        request = ProcessTicketRequest(ticket_id="550e8400-e29b-41d4-a716-446655440000")

        assert request.ticket_id == "550e8400-e29b-41d4-a716-446655440000"

    def test_missing_ticket_id_raises_error(self):
        """Debe fallar si falta ticket_id."""
        with pytest.raises(ValidationError) as exc_info:
            ProcessTicketRequest()

        assert "ticket_id" in str(exc_info.value)

    def test_empty_ticket_id_is_accepted(self):
        """String vacío es técnicamente válido (validación de negocio va en otro lugar)."""
        request = ProcessTicketRequest(ticket_id="")

        assert request.ticket_id == ""


class TestProcessTicketResponse:
    """Tests para el schema ProcessTicketResponse."""

    def test_valid_response(self):
        """Debe crear una respuesta válida."""
        response = ProcessTicketResponse(
            ticket_id="550e8400-e29b-41d4-a716-446655440000",
            category="facturación",
            sentiment="negativo",
            processed=True,
            message="Ticket procesado exitosamente"
        )

        assert response.ticket_id == "550e8400-e29b-41d4-a716-446655440000"
        assert response.category == "facturación"
        assert response.sentiment == "negativo"
        assert response.processed is True
        assert response.message == "Ticket procesado exitosamente"

    def test_missing_required_fields_raises_error(self):
        """Debe fallar si faltan campos requeridos."""
        with pytest.raises(ValidationError):
            ProcessTicketResponse(
                ticket_id="123",
                category="otros"
            )

    def test_serialization_to_dict(self):
        """Debe serializar correctamente a diccionario."""
        response = ProcessTicketResponse(
            ticket_id="123",
            category="ventas",
            sentiment="positivo",
            processed=True,
            message="OK"
        )

        data = response.model_dump()

        assert data["ticket_id"] == "123"
        assert data["category"] == "ventas"
        assert data["sentiment"] == "positivo"
        assert data["processed"] is True
        assert data["message"] == "OK"


class TestAnalyzeTextRequest:
    """Tests para el schema AnalyzeTextRequest."""

    def test_valid_text(self):
        """Debe aceptar texto válido."""
        request = AnalyzeTextRequest(text="Mi factura está incorrecta")

        assert request.text == "Mi factura está incorrecta"

    def test_missing_text_raises_error(self):
        """Debe fallar si falta el texto."""
        with pytest.raises(ValidationError) as exc_info:
            AnalyzeTextRequest()

        assert "text" in str(exc_info.value)

    def test_empty_text_raises_error(self):
        """Debe fallar con texto vacío por min_length=1."""
        with pytest.raises(ValidationError):
            AnalyzeTextRequest(text="")

    def test_long_text_is_accepted(self):
        """Debe aceptar textos largos."""
        long_text = "Este es un texto muy largo. " * 100
        request = AnalyzeTextRequest(text=long_text)

        assert len(request.text) > 1000


class TestAnalyzeTextResponse:
    """Tests para el schema AnalyzeTextResponse."""

    def test_valid_response(self):
        """Debe crear una respuesta válida."""
        response = AnalyzeTextResponse(
            category="soporte técnico",
            sentiment="negativo"
        )

        assert response.category == "soporte técnico"
        assert response.sentiment == "negativo"

    def test_missing_category_raises_error(self):
        """Debe fallar si falta category."""
        with pytest.raises(ValidationError):
            AnalyzeTextResponse(sentiment="positivo")

    def test_missing_sentiment_raises_error(self):
        """Debe fallar si falta sentiment."""
        with pytest.raises(ValidationError):
            AnalyzeTextResponse(category="ventas")

    def test_serialization_to_json(self):
        """Debe serializar correctamente a JSON."""
        response = AnalyzeTextResponse(
            category="devoluciones",
            sentiment="neutro"
        )

        json_str = response.model_dump_json()

        assert '"category":"devoluciones"' in json_str.replace(" ", "")
        assert '"sentiment":"neutro"' in json_str.replace(" ", "")

    def test_response_only_has_two_fields(self):
        """La respuesta solo debe tener category y sentiment."""
        response = AnalyzeTextResponse(
            category="otros",
            sentiment="positivo"
        )

        data = response.model_dump()

        assert len(data) == 2
        assert set(data.keys()) == {"category", "sentiment"}
