import pytest
from unittest.mock import patch, MagicMock
from app.services.ticket_service import get_ticket_by_id, update_ticket


class TestGetTicketById:
    """Tests para la función get_ticket_by_id."""

    @patch("app.services.ticket_service.get_supabase_client")
    def test_get_existing_ticket(self, mock_get_client):
        """Debe retornar el ticket si existe."""
        sample_ticket = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "description": "Mi factura está incorrecta, me cobraron el doble",
            "category": None,
            "sentiment": None,
            "processed": False,
            "created_at": "2024-01-01T00:00:00Z"
        }

        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.data = [sample_ticket]

        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_get_client.return_value = mock_client

        result = get_ticket_by_id("550e8400-e29b-41d4-a716-446655440000")

        assert result == sample_ticket
        mock_client.table.assert_called_with("tickets")

    @patch("app.services.ticket_service.get_supabase_client")
    def test_get_nonexistent_ticket_returns_none(self, mock_get_client):
        """Debe retornar None si el ticket no existe."""
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.data = []

        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_get_client.return_value = mock_client

        result = get_ticket_by_id("nonexistent-id")

        assert result is None

    @patch("app.services.ticket_service.get_supabase_client")
    def test_get_ticket_with_none_data_returns_none(self, mock_get_client):
        """Debe retornar None si response.data es None."""
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.data = None

        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_get_client.return_value = mock_client

        result = get_ticket_by_id("some-id")

        assert result is None


class TestUpdateTicket:
    """Tests para la función update_ticket."""

    @patch("app.services.ticket_service.get_supabase_client")
    def test_update_ticket_success(self, mock_get_client):
        """Debe actualizar el ticket correctamente."""
        updated_ticket = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "category": "facturación",
            "sentiment": "negativo",
            "processed": True
        }

        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.data = [updated_ticket]

        mock_client.table.return_value.update.return_value.eq.return_value.execute.return_value = mock_response
        mock_get_client.return_value = mock_client

        result = update_ticket(
            ticket_id="550e8400-e29b-41d4-a716-446655440000",
            category="facturación",
            sentiment="negativo"
        )

        assert result == updated_ticket
        mock_client.table.return_value.update.assert_called_with({
            "category": "facturación",
            "sentiment": "negativo",
            "processed": True
        })

    @patch("app.services.ticket_service.get_supabase_client")
    def test_update_ticket_not_found_raises_exception(self, mock_get_client):
        """Debe lanzar excepción si el ticket no se puede actualizar."""
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.data = []

        mock_client.table.return_value.update.return_value.eq.return_value.execute.return_value = mock_response
        mock_get_client.return_value = mock_client

        with pytest.raises(Exception) as exc_info:
            update_ticket(
                ticket_id="nonexistent-id",
                category="otros",
                sentiment="neutro"
            )

        assert "No se pudo actualizar el ticket" in str(exc_info.value)

    @patch("app.services.ticket_service.get_supabase_client")
    def test_update_ticket_with_none_data_raises_exception(self, mock_get_client):
        """Debe lanzar excepción si response.data es None."""
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.data = None

        mock_client.table.return_value.update.return_value.eq.return_value.execute.return_value = mock_response
        mock_get_client.return_value = mock_client

        with pytest.raises(Exception):
            update_ticket(
                ticket_id="some-id",
                category="otros",
                sentiment="neutro"
            )
