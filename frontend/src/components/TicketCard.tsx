import type { Ticket } from '../types/ticket'

interface TicketCardProps {
  ticket: Ticket
}

const sentimentColors: Record<string, string> = {
  positivo: 'bg-green-100 text-green-800',
  negativo: 'bg-red-100 text-red-800',
  neutro: 'bg-gray-100 text-gray-800',
}

const categoryColors: Record<string, string> = {
  'facturación': 'bg-blue-100 text-blue-800',
  'soporte técnico': 'bg-purple-100 text-purple-800',
  'ventas': 'bg-yellow-100 text-yellow-800',
  'devoluciones': 'bg-orange-100 text-orange-800',
  'información general': 'bg-cyan-100 text-cyan-800',
  'quejas': 'bg-red-100 text-red-800',
  'otros': 'bg-gray-100 text-gray-800',
}

export function TicketCard({ ticket }: TicketCardProps) {
  const sentimentClass = ticket.sentiment
    ? sentimentColors[ticket.sentiment] || 'bg-gray-100 text-gray-800'
    : ''

  const categoryClass = ticket.category
    ? categoryColors[ticket.category] || 'bg-gray-100 text-gray-800'
    : ''

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-500">
          {new Date(ticket.created_at).toLocaleString()}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${ticket.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {ticket.processed ? 'Procesado' : 'Pendiente'}
        </span>
      </div>

      <p className="text-gray-700 mb-3 line-clamp-3">{ticket.description}</p>

      <div className="flex gap-2 flex-wrap">
        {ticket.category && (
          <span className={`text-xs px-2 py-1 rounded-full ${categoryClass}`}>
            {ticket.category}
          </span>
        )}
        {ticket.sentiment && (
          <span className={`text-xs px-2 py-1 rounded-full ${sentimentClass}`}>
            {ticket.sentiment}
          </span>
        )}
      </div>
    </div>
  )
}
