# Tests - API Support Ticket AI

## Estructura

```
tests/
├── conftest.py              # Fixtures compartidos
├── api/
│   └── test_routes.py       # Tests de endpoints API
├── models/
│   └── test_schemas.py      # Tests de validación Pydantic
└── services/
    ├── test_ai_service.py   # Tests del servicio de IA
    └── test_ticket_service.py # Tests del servicio de tickets
```

## Ejecutar tests

```bash
# Todos los tests
pytest

# Con output detallado
pytest -v

# Un módulo específico
pytest tests/services/

# Un archivo específico
pytest tests/services/test_ai_service.py

# Un test específico
pytest tests/services/test_ai_service.py::TestParseLlmResponse::test_parse_valid_json_response

# Con reporte de cobertura (requiere pytest-cov)
pytest --cov=app
```

## Cobertura por módulo

| Carpeta | Archivo | Tests | Descripción |
|---------|---------|-------|-------------|
| `api/` | `test_routes.py` | 11 | Endpoints `/health`, `/process-ticket`, `/analyze-text` |
| `models/` | `test_schemas.py` | 14 | Validación de request/response models |
| `services/` | `test_ai_service.py` | 14 | Parseo de respuestas LLM, validación de categorías |
| `services/` | `test_ticket_service.py` | 6 | CRUD de tickets con Supabase (mocked) |

## Fixtures disponibles

Definidos en `conftest.py`:

- `client` - TestClient de FastAPI
- `mock_settings` - Configuración mockeada
- `mock_supabase` - Cliente Supabase mockeado
- `sample_ticket` - Ticket de ejemplo sin procesar
- `processed_ticket` - Ticket ya procesado

## Notas

- Los tests usan mocks para no depender de servicios externos
- No se requiere conexión a Supabase ni HuggingFace
- Ejecutar antes de hacer deploy para verificar que todo funciona
