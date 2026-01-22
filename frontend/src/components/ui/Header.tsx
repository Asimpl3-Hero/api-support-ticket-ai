import { useTheme } from '../../hooks/useTheme'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewTicket?: () => void
}

export function Header({ searchQuery, onSearchChange, onNewTicket }: HeaderProps) {
  const { toggleTheme, isDark } = useTheme()

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-title">Dashboard</h1>
        <p className="text-subtitle">Gestiona y monitorea todos los tickets de soporte</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm text-text-muted" />
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input input-with-icon w-64"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="btn btn-icon"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? (
            <MoonIcon className="icon-md text-text-secondary" />
          ) : (
            <SunIcon className="icon-md text-text-secondary" />
          )}
        </button>

        <button className="btn btn-icon relative">
          <BellIcon className="icon-md text-text-secondary" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-green rounded-full text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {onNewTicket && (
          <button
            onClick={onNewTicket}
            className="btn btn-primary"
          >
            <PlusIcon className="icon-sm" />
            Nuevo Ticket
          </button>
        )}
      </div>
    </header>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

