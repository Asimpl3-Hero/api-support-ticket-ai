from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from app.api.routes import router

DESCRIPTION = """
## API de Procesamiento de Tickets con IA

Este microservicio utiliza **LangChain** y **Hugging Face** para analizar tickets de soporte
y extraer automáticamente la categoría y el sentimiento.

### Funcionalidades principales:

* **Procesar tickets**: Analiza tickets almacenados en Supabase
* **Análisis de texto**: Analiza texto directamente sin persistencia

### Categorías soportadas:
- Facturación
- Soporte técnico
- Ventas
- Devoluciones
- Información general
- Quejas
- Otros

### Sentimientos detectados:
- Positivo
- Negativo
- Neutro
"""

tags_metadata = [
    {
        "name": "health",
        "description": "Endpoints de estado y salud del servicio",
    },
    {
        "name": "tickets",
        "description": "Operaciones de procesamiento de tickets con IA",
    },
]

app = FastAPI(
    title="API Support Ticket AI",
    description=DESCRIPTION,
    version="1.0.0",
    openapi_tags=tags_metadata,
    contact={
        "name": "Soporte API",
        "email": "soporte@ejemplo.com",
    },
    license_info={
        "name": "MIT",
    },
)


@app.get("/", tags=["health"])
def root():
    """
    Endpoint raíz que confirma que el servicio está activo.
    """
    return {"message": "API Support Ticket AI - Microservicio activo"}


@app.get("/health", tags=["health"])
def health_check():
    """
    Verifica el estado de salud del servicio.

    Retorna el estado actual del microservicio.
    """
    return {"status": "healthy"}


app.include_router(router, tags=["tickets"])
