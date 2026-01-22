# API Support Ticket AI

![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.10.0-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging_Face-Mistral_7B-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Pydantic](https://img.shields.io/badge/Pydantic-2.9.2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Microservicio de inteligencia artificial para procesar tickets de soporte al cliente. Utiliza **FastAPI** y **Hugging Face Inference API** para analizar automáticamente el texto de los tickets y extraer la categoría y el sentimiento.

## Tecnologías

- **FastAPI** - Framework web de alto rendimiento
- **Hugging Face Inference API** - Modelo Mistral-7B-Instruct para análisis de texto
- **Supabase** - Base de datos PostgreSQL como servicio
- **Pydantic** - Validación de datos
- **HTTPX** - Cliente HTTP

## Estructura del Proyecto

```
api-support-ticket-ai/
├── .env                    # Variables de entorno
├── .env.example            # Ejemplo de configuración
├── .gitignore
├── requirements.txt
├── main.py                 # Punto de entrada
├── README.md
│
└── app/
    ├── __init__.py
    ├── main.py             # Aplicación FastAPI
    │
    ├── api/
    │   ├── __init__.py
    │   └── routes.py       # Endpoints de la API
    │
    ├── core/
    │   ├── __init__.py
    │   ├── config.py       # Configuración y settings
    │   └── database.py     # Cliente de Supabase
    │
    ├── models/
    │   ├── __init__.py
    │   └── schemas.py      # Modelos Pydantic
    │
    └── services/
        ├── __init__.py
        ├── ai_service.py      # Lógica de IA con Hugging Face
        └── ticket_service.py  # Operaciones CRUD de tickets
```

## Requisitos Previos

- Python 3.10+
- Cuenta en [Supabase](https://supabase.com)
- Token de [Hugging Face](https://huggingface.co)

## Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd api-support-ticket-ai
```

2. **Crear entorno virtual**

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. **Instalar dependencias**

```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**

Copiar el archivo de ejemplo y completar con tus credenciales:

```bash
cp .env.example .env
```

Editar `.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-api-key
HUGGINGFACE_API_TOKEN=tu-token-de-huggingface
```

## Base de Datos

La API espera una tabla `tickets` en Supabase con la siguiente estructura:

```sql
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  description text not null,
  category text,
  sentiment text,
  processed boolean default false
);

alter table public.tickets enable row level security;

create policy "ticketpolicy"
on public.tickets
for select
to public
using (true);
```

## Ejecución

```bash
python main.py
```

O con uvicorn directamente:

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en `http://localhost:8000`

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Health check básico |
| GET | `/health` | Estado del servicio |
| POST | `/process-ticket` | Procesa un ticket por ID |
| POST | `/analyze-text` | Analiza texto directamente |

### POST /process-ticket

Procesa un ticket existente en Supabase, extrae categoría y sentimiento, y lo marca como procesado.

**Request:**

```json
{
  "ticket_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**

```json
{
  "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
  "category": "soporte técnico",
  "sentiment": "negativo",
  "processed": true,
  "message": "Ticket procesado exitosamente"
}
```

### POST /analyze-text

Analiza un texto directamente sin guardarlo en la base de datos.

**Request:**

```json
{
  "text": "Mi factura está incorrecta, me cobraron el doble del monto acordado."
}
```

**Response:**

```json
{
  "category": "facturación",
  "sentiment": "negativo"
}
```

## Categorías Soportadas

- Facturación
- Soporte técnico
- Ventas
- Devoluciones
- Información general
- Quejas
- Otros

## Sentimientos Detectados

- Positivo
- Negativo
- Neutro

## Documentación Interactiva

Una vez ejecutado el servidor, accede a la documentación:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Ejemplo de Uso con cURL

```bash
# Procesar un ticket existente
curl -X POST http://localhost:8000/process-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id": "tu-uuid-aqui"}'

# Analizar texto directamente
curl -X POST http://localhost:8000/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Excelente atención, muy satisfecho con el servicio"}'
```
