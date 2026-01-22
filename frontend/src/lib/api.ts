const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ProcessTicketResponse {
  ticket_id: string
  category: string
  sentiment: string
  processed: boolean
  message: string
}

export interface CreateTicketRequest {
  description: string
  category?: string | null
  sentiment?: string | null
}

export interface CreateTicketResponse {
  ticket_id: string
  description: string
  category: string | null
  sentiment: string | null
  processed: boolean
  message: string
}

export async function createTicket(data: CreateTicketRequest): Promise<CreateTicketResponse> {
  const response = await fetch(`${API_URL}/create-ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error al crear el ticket')
  }

  return response.json()
}

export async function processTicket(ticketId: string): Promise<ProcessTicketResponse> {
  const response = await fetch(`${API_URL}/process-ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticket_id: ticketId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error al procesar el ticket')
  }

  return response.json()
}
