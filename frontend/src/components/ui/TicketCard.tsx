import { useState } from 'react'
import type { Ticket } from '../../types/ticket'
import { processTicket } from '../../lib/api'
import { SENTIMENT_BADGE_COLORS, CATEGORY_BADGE_COLORS } from '../../constants'

interface TicketCardProps {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sentimentClass = ticket.sentiment
    ? SENTIMENT_BADGE_COLORS[ticket.sentiment] || 'badge-muted'
    : ''

  const categoryClass = ticket.category
    ? CATEGORY_BADGE_COLORS[ticket.category] || 'badge-muted'
    : ''

  async function handleProcess() {
    try {
      setProcessing(true)
      setError(null)
      await processTicket(ticket.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="card p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-subtitle">
          {new Date(ticket.created_at).toLocaleString()}
        </span>
        <span className={`badge ${ticket.processed ? 'badge-success' : 'badge-warning'}`}>
          {ticket.processed ? 'Procesado' : 'Pendiente'}
        </span>
      </div>

      <p className="text-text-secondary mb-3 line-clamp-3">{ticket.description}</p>

      <div className="flex gap-2 flex-wrap mb-3">
        {ticket.category && (
          <span className={`badge ${categoryClass}`}>
            {ticket.category}
          </span>
        )}
        {ticket.sentiment && (
          <span className={`badge ${sentimentClass}`}>
            {ticket.sentiment}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-accent-red mb-2">{error}</p>
      )}

      {!ticket.processed && (
        <button
          onClick={handleProcess}
          disabled={processing}
          className="btn btn-primary w-full"
        >
          {processing ? 'Procesando...' : 'Procesar con IA'}
        </button>
      )}
    </div>
  )
}
