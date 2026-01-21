import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


class TestRootEndpoint:
    """Tests para el endpoint raíz."""

    def test_root_returns_message(self):
        """El endpoint raíz debe retornar mensaje de bienvenida."""
        response = client.get("/")

        assert response.status_code == 200
        assert "API Support Ticket AI" in response.json()["message"]


class TestHealthEndpoint:
    """Tests para el endpoint de health check."""

    def test_health_returns_ok(self):
        """El endpoint health debe retornar status ok."""
        response = client.get("/health")

        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestProcessTicketEndpoint:
    """Tests para el endpoint /process-ticket."""

    @patch("app.api.routes.update_ticket")
    @patch("app.api.routes.analyze_ticket")
    @patch("app.api.routes.get_ticket_by_id")
    def test_process_ticket_success(self, mock_get_ticket, mock_analyze, mock_update):
        """Debe procesar un ticket correctamente."""
        mock_get_ticket.return_value = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "description": "Mi factura está mal",
            "processed": False
        }
        mock_analyze.return_value = {
            "category": "facturación",
            "sentiment": "negativo"
        }
        mock_update.return_value = {"id": "550e8400-e29b-41d4-a716-446655440000"}

        response = client.post(
            "/process-ticket",
            json={"ticket_id": "550e8400-e29b-41d4-a716-446655440000"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "facturación"
        assert data["sentiment"] == "negativo"
        assert data["processed"] is True
        assert data["message"] == "Ticket procesado exitosamente"

    @patch("app.api.routes.get_ticket_by_id")
    def test_process_ticket_not_found(self, mock_get_ticket):
        """Debe retornar 404 si el ticket no existe."""
        mock_get_ticket.return_value = None

        response = client.post(
            "/process-ticket",
            json={"ticket_id": "nonexistent-id"}
        )

        assert response.status_code == 404
        assert "no encontrado" in response.json()["detail"]

    @patch("app.api.routes.get_ticket_by_id")
    def test_process_ticket_already_processed(self, mock_get_ticket):
        """Debe retornar datos existentes si el ticket ya fue procesado."""
        mock_get_ticket.return_value = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "description": "Test",
            "category": "ventas",
            "sentiment": "positivo",
            "processed": True
        }

        response = client.post(
            "/process-ticket",
            json={"ticket_id": "550e8400-e29b-41d4-a716-446655440000"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "ventas"
        assert data["sentiment"] == "positivo"
        assert "ya había sido procesado" in data["message"]

    @patch("app.api.routes.get_ticket_by_id")
    def test_process_ticket_no_description(self, mock_get_ticket):
        """Debe retornar 400 si el ticket no tiene descripción."""
        mock_get_ticket.return_value = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "description": "",
            "processed": False
        }

        response = client.post(
            "/process-ticket",
            json={"ticket_id": "550e8400-e29b-41d4-a716-446655440000"}
        )

        assert response.status_code == 400
        assert "no tiene descripción" in response.json()["detail"]

    def test_process_ticket_missing_ticket_id(self):
        """Debe retornar 422 si falta el ticket_id."""
        response = client.post("/process-ticket", json={})

        assert response.status_code == 422


class TestAnalyzeTextEndpoint:
    """Tests para el endpoint /analyze-text."""

    @patch("app.api.routes.analyze_ticket")
    def test_analyze_text_success(self, mock_analyze):
        """Debe analizar texto correctamente."""
        mock_analyze.return_value = {
            "category": "soporte técnico",
            "sentiment": "negativo"
        }

        response = client.post(
            "/analyze-text",
            json={"text": "Mi computadora no enciende, necesito ayuda urgente"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "soporte técnico"
        assert data["sentiment"] == "negativo"

    def test_analyze_text_empty_text(self):
        """Debe retornar 400 si el texto está vacío."""
        response = client.post("/analyze-text", json={"text": "   "})

        assert response.status_code == 400
        assert "no puede estar vacío" in response.json()["detail"]

    def test_analyze_text_missing_text(self):
        """Debe retornar 422 si falta el campo text."""
        response = client.post("/analyze-text", json={})

        assert response.status_code == 422

    @patch("app.api.routes.analyze_ticket")
    def test_analyze_text_returns_correct_structure(self, mock_analyze):
        """La respuesta debe tener la estructura correcta."""
        mock_analyze.return_value = {
            "category": "ventas",
            "sentiment": "positivo"
        }

        response = client.post(
            "/analyze-text",
            json={"text": "Quiero comprar su producto"}
        )

        data = response.json()
        assert "category" in data
        assert "sentiment" in data
        assert len(data) == 2
