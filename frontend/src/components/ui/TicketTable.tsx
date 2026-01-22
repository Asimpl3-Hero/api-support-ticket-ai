import { useState } from 'react'
import type { Ticket } from '../../types/ticket'
import { processTicket } from '../../lib/api'

interface TicketTableProps {
  tickets: Ticket[]
  loading: boolean
}

const categoryColors: Record<string, string> = {
  'facturación': 'text-accent-blue',
  'soporte técnico': 'text-accent-purple',
  'ventas': 'text-accent-yellow',
  'devoluciones': 'text-accent-orange',
  'información general': 'text-accent-cyan',
  'quejas': 'text-accent-red',
  'otros': 'text-text-muted',
}

const sentimentConfig: Record<string, { label: string; class: string }> = {
  positivo: { label: 'Positivo', class: 'bg-accent-green/20 text-accent-green' },
  negativo: { label: 'Negativo', class: 'bg-accent-red/20 text-accent-red' },
  neutro: { label: 'Neutro', class: 'bg-text-muted/20 text-text-muted' },
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

export function TicketTable({ tickets, loading }: TicketTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center text-text-muted">
        No hay tickets disponibles
      </div>
    )
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
        <h2 className="font-semibold text-text-primary">Tickets Recientes</h2>
        <span className="text-sm text-text-muted">{tickets.length} tickets</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Ticket</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Estado</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Sentimiento</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Categoría</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Creado</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  const [processing, setProcessing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleProcess() {
    try {
      setProcessing(true)
      await processTicket(ticket.id)
    } catch (err) {
      console.error('Error processing ticket:', err)
    } finally {
      setProcessing(false)
      setMenuOpen(false)
    }
  }

  const sentiment = ticket.sentiment ? sentimentConfig[ticket.sentiment] : null
  const categoryColor = ticket.category ? categoryColors[ticket.category] || 'text-text-muted' : 'text-text-muted'

  return (
    <tr className="hover:bg-dark-hover transition-colors">
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
          ticket.processed
            ? 'bg-accent-green/20 text-accent-green'
            : 'bg-accent-yellow/20 text-accent-yellow'
        }`}>
          {ticket.processed ? 'Procesado' : 'Pendiente'}
        </span>
      </td>
      <td className="px-6 py-4">
        {sentiment ? (
          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${sentiment.class}`}>
            {sentiment.label}
          </span>
        ) : (
          <span className="text-text-muted text-sm">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`text-sm ${categoryColor}`}>
          {ticket.category || '-'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-text-muted">
          {formatRelativeTime(ticket.created_at)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-dark-border transition-colors"
          >
            <MoreIcon className="w-5 h-5 text-text-muted" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg z-20">
                {!ticket.processed && (
                  <button
                    onClick={handleProcess}
                    disabled={processing}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-dark-hover transition-colors disabled:opacity-50"
                  >
                    {processing ? 'Procesando...' : 'Procesar con IA'}
                  </button>
                )}
                <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-dark-hover transition-colors">
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
