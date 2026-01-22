import { useState } from 'react'
import type { Ticket } from '../../types/ticket'
import { processTicket } from '../../lib/api'
import { LoadingSpinner } from '../ux/LoadingSpinner'
import { EmptyState } from '../ux/EmptyState'
import { TicketModal } from '../ux/TicketModal'
import { useToast } from '../ux/Toast'
import { CATEGORY_TEXT_COLORS, SENTIMENT_CONFIG } from '../../constants'

interface TicketTableProps {
  tickets: Ticket[]
  loading: boolean
  searchQuery?: string
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} horas`
  if (diffDays < 7) return `Hace ${diffDays} días`
  return date.toLocaleDateString()
}

function generateTicketId(id: string): string {
  return `TK-${id.slice(0, 3).toUpperCase()}`
}

export function TicketTable({ tickets, loading, searchQuery }: TicketTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { showToast } = useToast()

  async function handleProcess(ticketId: string) {
    try {
      setProcessingId(ticketId)
      await processTicket(ticketId)
      showToast('success', 'Ticket procesado exitosamente')
      setSelectedTicket(null)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Error al procesar ticket')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="Cargando tickets..." />
  }

  if (tickets.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState
          icon="search"
          title="Sin resultados"
          description={`No se encontraron tickets que coincidan con "${searchQuery}"`}
        />
      )
    }
    return (
      <EmptyState
        icon="tickets"
        title="No hay tickets"
        description="Aún no hay tickets de soporte registrados en el sistema"
      />
    )
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="font-semibold text-text-primary">Tickets Recientes</h2>
          <span className="text-subtitle">{tickets.length} tickets</span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="divider">
                <th className="table-header">Ticket</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Sentimiento</th>
                <th className="table-header">Categoría</th>
                <th className="table-header">Creado</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {tickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onViewDetails={() => setSelectedTicket(ticket)}
                  onProcess={() => handleProcess(ticket.id)}
                  processing={processingId === ticket.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TicketModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onProcess={handleProcess}
        processing={!!processingId}
      />
    </>
  )
}

interface TicketRowProps {
  ticket: Ticket
  onViewDetails: () => void
  onProcess: () => void
  processing: boolean
}

function TicketRow({ ticket, onViewDetails, onProcess, processing }: TicketRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const sentiment = ticket.sentiment ? SENTIMENT_CONFIG[ticket.sentiment] : null
  const categoryColor = ticket.category ? CATEGORY_TEXT_COLORS[ticket.category] || 'text-text-muted' : 'text-text-muted'

  return (
    <tr className="table-row">
      <td className="table-cell">
        <div>
          <span className="text-xs text-text-muted">{generateTicketId(ticket.id)}</span>
          <p className="font-medium text-text-primary line-clamp-1">
            {ticket.description.slice(0, 50)}
            {ticket.description.length > 50 ? '...' : ''}
          </p>
          <p className="text-sm text-text-muted line-clamp-1">
            {ticket.description.slice(0, 80)}
          </p>
        </div>
      </td>
      <td className="table-cell">
        <span className={`badge ${ticket.processed ? 'badge-success' : 'badge-warning'}`}>
          {ticket.processed ? 'Procesado' : 'Pendiente'}
        </span>
      </td>
      <td className="table-cell">
        {sentiment ? (
          <span className={`badge ${sentiment.class}`}>
            {sentiment.label}
          </span>
        ) : (
          <span className="text-text-muted text-sm">-</span>
        )}
      </td>
      <td className="table-cell">
        <span className={`text-sm ${categoryColor}`}>
          {ticket.category || '-'}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-subtitle">
          {formatRelativeTime(ticket.created_at)}
        </span>
      </td>
      <td className="table-cell">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-dark-border transition-colors"
          >
            <MoreIcon className="icon-md text-text-muted" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="dropdown-menu right-0 mt-1 w-48">
                {!ticket.processed && (
                  <button
                    onClick={() => { onProcess(); setMenuOpen(false) }}
                    disabled={processing}
                    className="dropdown-item disabled:opacity-50"
                  >
                    <SparklesIcon className="icon-sm text-accent-blue" />
                    {processing ? 'Procesando...' : 'Procesar con IA'}
                  </button>
                )}
                <button
                  onClick={() => { onViewDetails(); setMenuOpen(false) }}
                  className="dropdown-item"
                >
                  <EyeIcon className="icon-sm text-text-muted" />
                  Ver detalles
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
