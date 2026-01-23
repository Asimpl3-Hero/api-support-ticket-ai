from app.core.database import get_supabase_client


def get_ticket_by_id(ticket_id: str) -> dict | None:
    """Obtiene un ticket por su ID."""
    client = get_supabase_client()
    response = client.table("tickets").select("*").eq("id", ticket_id).execute()

    if response.data and len(response.data) > 0:
        return response.data[0]
    return None


def create_ticket(
    description: str,
    category: str | None = None,
    sentiment: str | None = None,
    processed: bool = False
) -> dict:
    """Crea un nuevo ticket en la base de datos."""
    client = get_supabase_client()

    ticket_data = {
        "description": description,
        "processed": processed
    }

    if category:
        ticket_data["category"] = category
    if sentiment:
        ticket_data["sentiment"] = sentiment

    response = client.table("tickets").insert(ticket_data).execute()

    if response.data and len(response.data) > 0:
        return response.data[0]
    raise Exception("No se pudo crear el ticket")


def update_ticket(ticket_id: str, category: str, sentiment: str) -> dict:
    """Actualiza un ticket con la categoría, sentimiento y marca como procesado."""
    client = get_supabase_client()
    response = client.table("tickets").update({
        "category": category,
        "sentiment": sentiment,
        "processed": True
    }).eq("id", ticket_id).execute()

    if response.data and len(response.data) > 0:
        return response.data[0]
    raise Exception(f"No se pudo actualizar el ticket con ID: {ticket_id}")
