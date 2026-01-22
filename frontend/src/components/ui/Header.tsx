interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewTicket?: () => void
}

export function Header({ searchQuery, onSearchChange, onNewTicket }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted">Gestiona y monitorea todos los tickets de soporte</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>

        <button className="relative p-2 rounded-lg bg-dark-card border border-dark-border hover:bg-dark-hover transition-colors">
          <BellIcon className="w-5 h-5 text-text-secondary" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-green rounded-full text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {onNewTicket && (
          <button
            onClick={onNewTicket}
            className="flex items-center gap-2 px-4 py-2 bg-text-primary text-dark-bg rounded-lg font-medium text-sm hover:bg-text-secondary transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo Ticket
          </button>
        )}
      </div>
    </header>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
