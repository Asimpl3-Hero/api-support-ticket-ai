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
    <div className="tab-container mb-6">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`tab ${activeFilter === key ? 'tab-active' : 'tab-inactive'}`}
        >
          {label}
          <span className={`tab-count ${activeFilter === key ? 'tab-count-active' : 'tab-count-inactive'}`}>
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  )
}
