import { useEffect } from 'react'
import type { Ticket } from '../../types/ticket'

interface TicketModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  onProcess?: (ticketId: string) => void
  processing?: boolean
}

export function TicketModal({ ticket, isOpen, onClose, onProcess, processing }: TicketModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !ticket) return null

  const sentimentConfig: Record<string, { label: string; class: string }> = {
    positivo: { label: 'Positivo', class: 'bg-accent-green/20 text-accent-green' },
    negativo: { label: 'Negativo', class: 'bg-accent-red/20 text-accent-red' },
    neutro: { label: 'Neutro', class: 'bg-text-muted/20 text-text-muted' },
  }

  const sentiment = ticket.sentiment ? sentimentConfig[ticket.sentiment] : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <div>
            <span className="text-xs text-text-muted">TK-{ticket.id.slice(0, 3).toUpperCase()}</span>
            <h2 className="text-lg font-semibold text-text-primary">Detalles del Ticket</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              ticket.processed
                ? 'bg-accent-green/20 text-accent-green'
                : 'bg-accent-yellow/20 text-accent-yellow'
            }`}>
              {ticket.processed ? 'Procesado' : 'Pendiente'}
            </span>

            {sentiment && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${sentiment.class}`}>
                {sentiment.label}
              </span>
            )}

            {ticket.category && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-blue/20 text-accent-blue">
                {ticket.category}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-2">Descripción</h3>
            <p className="text-text-primary bg-dark-bg rounded-lg p-4 text-sm leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-1">Creado</h3>
              <p className="text-sm text-text-primary">
                {new Date(ticket.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-1">ID</h3>
              <p className="text-sm text-text-primary font-mono">{ticket.id.slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-dark-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Cerrar
          </button>

          {!ticket.processed && onProcess && (
            <button
              onClick={() => onProcess(ticket.id)}
              disabled={processing}
              className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-accent-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {processing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Procesar con IA
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
