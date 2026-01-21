import pytest
from unittest.mock import patch, MagicMock
from app.services.ai_service import parse_llm_response, analyze_ticket, CATEGORIES, SENTIMENTS


class TestParseLlmResponse:
    """Tests para la función parse_llm_response."""

    def test_parse_valid_json_response(self):
        """Debe extraer correctamente categoría y sentimiento de un JSON válido."""
        response = '{"category": "facturación", "sentiment": "negativo"}'
        result = parse_llm_response(response)

        assert result["category"] == "facturación"
        assert result["sentiment"] == "negativo"

    def test_parse_json_with_extra_text(self):
        """Debe extraer JSON incluso con texto adicional."""
        response = 'Aquí está el análisis: {"category": "soporte técnico", "sentiment": "positivo"} Fin.'
        result = parse_llm_response(response)

        assert result["category"] == "soporte técnico"
        assert result["sentiment"] == "positivo"

    def test_parse_invalid_category_defaults_to_otros(self):
        """Debe usar 'otros' para categorías no válidas."""
        response = '{"category": "categoria_invalida", "sentiment": "positivo"}'
        result = parse_llm_response(response)

        assert result["category"] == "otros"
        assert result["sentiment"] == "positivo"

    def test_parse_invalid_sentiment_defaults_to_neutro(self):
        """Debe usar 'neutro' para sentimientos no válidos."""
        response = '{"category": "ventas", "sentiment": "muy_feliz"}'
        result = parse_llm_response(response)

        assert result["category"] == "ventas"
        assert result["sentiment"] == "neutro"

    def test_parse_uppercase_values_converted_to_lowercase(self):
        """Debe convertir valores a minúsculas."""
        response = '{"category": "VENTAS", "sentiment": "POSITIVO"}'
        result = parse_llm_response(response)

        assert result["category"] == "ventas"
        assert result["sentiment"] == "positivo"

    def test_parse_invalid_json_returns_defaults(self):
        """Debe retornar valores por defecto si el JSON es inválido."""
        response = "esto no es JSON válido"
        result = parse_llm_response(response)

        assert result["category"] == "otros"
        assert result["sentiment"] == "neutro"

    def test_parse_empty_response_returns_defaults(self):
        """Debe retornar valores por defecto para respuesta vacía."""
        result = parse_llm_response("")

        assert result["category"] == "otros"
        assert result["sentiment"] == "neutro"

    def test_parse_missing_category_defaults(self):
        """Debe usar 'otros' si falta la categoría."""
        response = '{"sentiment": "positivo"}'
        result = parse_llm_response(response)

        assert result["category"] == "otros"
        assert result["sentiment"] == "positivo"

    def test_parse_missing_sentiment_defaults(self):
        """Debe usar 'neutro' si falta el sentimiento."""
        response = '{"category": "ventas"}'
        result = parse_llm_response(response)

        assert result["category"] == "ventas"
        assert result["sentiment"] == "neutro"

    @pytest.mark.parametrize("category", CATEGORIES)
    def test_all_valid_categories_are_accepted(self, category):
        """Todas las categorías válidas deben ser aceptadas."""
        response = f'{{"category": "{category}", "sentiment": "neutro"}}'
        result = parse_llm_response(response)

        assert result["category"] == category

    @pytest.mark.parametrize("sentiment", SENTIMENTS)
    def test_all_valid_sentiments_are_accepted(self, sentiment):
        """Todos los sentimientos válidos deben ser aceptados."""
        response = f'{{"category": "otros", "sentiment": "{sentiment}"}}'
        result = parse_llm_response(response)

        assert result["sentiment"] == sentiment


class TestAnalyzeTicket:
    """Tests para la función analyze_ticket."""

    @patch("app.services.ai_service.httpx.Client")
    @patch("app.services.ai_service.get_settings")
    def test_analyze_ticket_success(self, mock_settings, mock_client_class):
        """Debe analizar un ticket correctamente con respuesta válida del LLM."""
        settings = MagicMock()
        settings.huggingface_api_token = "test-token"
        mock_settings.return_value = settings

        mock_response = MagicMock()
        mock_response.json.return_value = [
            {"generated_text": '{"category": "facturación", "sentiment": "negativo"}'}
        ]
        mock_response.raise_for_status = MagicMock()

        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_class.return_value = mock_client

        result = analyze_ticket("Mi factura está mal")

        assert result["category"] == "facturación"
        assert result["sentiment"] == "negativo"

    @patch("app.services.ai_service.httpx.Client")
    @patch("app.services.ai_service.get_settings")
    def test_analyze_ticket_empty_response_returns_defaults(self, mock_settings, mock_client_class):
        """Debe retornar valores por defecto si la respuesta está vacía."""
        settings = MagicMock()
        settings.huggingface_api_token = "test-token"
        mock_settings.return_value = settings

        mock_response = MagicMock()
        mock_response.json.return_value = []
        mock_response.raise_for_status = MagicMock()

        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_class.return_value = mock_client

        result = analyze_ticket("Texto cualquiera")

        assert result["category"] == "otros"
        assert result["sentiment"] == "neutro"

    @patch("app.services.ai_service.httpx.Client")
    @patch("app.services.ai_service.get_settings")
    def test_analyze_ticket_sends_correct_headers(self, mock_settings, mock_client_class):
        """Debe enviar los headers correctos a la API de HuggingFace."""
        settings = MagicMock()
        settings.huggingface_api_token = "my-secret-token"
        mock_settings.return_value = settings

        mock_response = MagicMock()
        mock_response.json.return_value = [{"generated_text": '{"category": "otros", "sentiment": "neutro"}'}]
        mock_response.raise_for_status = MagicMock()

        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_client.__enter__ = MagicMock(return_value=mock_client)
        mock_client.__exit__ = MagicMock(return_value=False)
        mock_client_class.return_value = mock_client

        analyze_ticket("Test")

        call_args = mock_client.post.call_args
        headers = call_args.kwargs["headers"]

        assert headers["Authorization"] == "Bearer my-secret-token"
        assert headers["Content-Type"] == "application/json"
