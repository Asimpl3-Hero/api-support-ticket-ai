import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Cliente de prueba para FastAPI."""
    return TestClient(app)


@pytest.fixture
def mock_settings():
    """Mock de configuración para pruebas."""
    with patch("app.core.config.get_settings") as mock:
        settings = MagicMock()
        settings.supabase_url = "https://test.supabase.co"
        settings.supabase_key = "test-key"
        settings.huggingface_api_token = "test-token"
        mock.return_value = settings
        yield settings


@pytest.fixture
def mock_supabase():
    """Mock del cliente de Supabase."""
    with patch("app.services.ticket_service.get_supabase_client") as mock:
        client = MagicMock()
        mock.return_value = client
        yield client


@pytest.fixture
def sample_ticket():
    """Ticket de ejemplo para pruebas."""
    return {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "description": "Mi factura está incorrecta, me cobraron el doble",
        "category": None,
        "sentiment": None,
        "processed": False,
        "created_at": "2024-01-01T00:00:00Z"
    }


@pytest.fixture
def processed_ticket():
    """Ticket ya procesado para pruebas."""
    return {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "description": "Mi factura está incorrecta",
        "category": "facturación",
        "sentiment": "negativo",
        "processed": True,
        "created_at": "2024-01-01T00:00:00Z"
    }
