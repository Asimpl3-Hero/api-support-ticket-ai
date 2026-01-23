import { useState, useEffect } from 'react'
import { createTicket } from '../../lib/api'
import { useToast } from './Toast'
import type { Ticket } from '../../types/ticket'

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated?: (ticket: Ticket) => void
}

const CATEGORIES = [
  { value: '', label: 'Sin categoría (detectar con IA)' },
  { value: 'facturación', label: 'Facturación' },
  { value: 'soporte técnico', label: 'Soporte Técnico' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'devoluciones', label: 'Devoluciones' },
  { value: 'información general', label: 'Información General' },
  { value: 'quejas', label: 'Quejas' },
  { value: 'otros', label: 'Otros' },
]

const SENTIMENTS = [
  { value: '', label: 'Sin sentimiento (detectar con IA)' },
  { value: 'positivo', label: 'Positivo' },
  { value: 'negativo', label: 'Negativo' },
  { value: 'neutro', label: 'Neutro' },
]

export function CreateTicketModal({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [sentiment, setSentiment] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!description.trim()) {
      showToast('warning', 'Por favor ingresa una descripción')
      return
    }

    try {
      setLoading(true)

      const response = await createTicket({
        description: description.trim(),
        category: category || null,
        sentiment: sentiment || null,
      })

      // Agregar ticket al estado local inmediatamente
      if (onTicketCreated) {
        onTicketCreated({
          id: response.ticket_id,
          description: response.description,
          category: response.category,
          sentiment: response.sentiment,
          processed: response.processed,
          created_at: new Date().toISOString(),
        })
      }

      showToast('success', response.message)
      resetForm()
      onClose()
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Error al crear ticket')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setDescription('')
    setCategory('')
    setSentiment('')
  }

  function handleClose() {
    if (!loading) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Nuevo Ticket</h2>
            <p className="text-sm text-text-muted">Crea un nuevo ticket de soporte</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-dark-hover transition-colors disabled:opacity-50"
          >
            <CloseIcon className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Description */}
            <label className="block">
              <span className="text-sm font-medium text-text-secondary mb-2 block">
                Descripción del problema <span className="text-accent-red">*</span>
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el problema o consulta del cliente..."
                rows={4}
                disabled={loading}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors resize-none disabled:opacity-50"
              />
            </label>

            {/* Category & Sentiment row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <label className="block">
                <span className="text-sm font-medium text-text-secondary mb-2 block">
                  Categoría
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue transition-colors disabled:opacity-50 appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Sentiment */}
              <label className="block">
                <span className="text-sm font-medium text-text-secondary mb-2 block">
                  Sentimiento
                </span>
                <select
                  value={sentiment}
                  onChange={(e) => setSentiment(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue transition-colors disabled:opacity-50 appearance-none cursor-pointer"
                >
                  {SENTIMENTS.map((sent) => (
                    <option key={sent.value} value={sent.value}>
                      {sent.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="text-xs text-text-muted">
              Si no seleccionas categoría o sentimiento, se detectarán automáticamente con IA al crear el ticket.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-dark-border">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-accent-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  Crear Ticket
                </>
              )}
            </button>
          </div>
        </form>
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}
