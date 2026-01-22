export type FilterType = 'all' | 'pending' | 'processed' | 'positive' | 'negative'

interface FilterTabsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: {
    all: number
    pending: number
    processed: number
    positive: number
    negative: number
  }
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'processed', label: 'Procesados' },
  { key: 'positive', label: 'Positivos' },
  { key: 'negative', label: 'Negativos' },
]

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 mb-6 border-b border-dark-border">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeFilter === key
              ? 'text-text-primary border-accent-blue'
              : 'text-text-muted border-transparent hover:text-text-secondary'
          }`}
        >
          {label}
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              activeFilter === key
                ? 'bg-accent-blue text-white'
                : 'bg-dark-hover text-text-muted'
            }`}
          >
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  )
}
