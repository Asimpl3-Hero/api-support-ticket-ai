import { Header } from './components/ui/Header'
import { StatsCards } from './components/ui/StatsCards'
import { FilterTabs } from './components/ui/FilterTabs'
import { TicketTable } from './components/ui/TicketTable'
import { useTickets } from './hooks/useTickets'

function App() {
  const {
    tickets,
    loading,
    error,
    stats,
    counts,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
  } = useTickets()

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <StatsCards
          total={stats.total}
          pending={stats.pending}
          processed={stats.processed}
          negative={stats.negative}
        />

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {error ? (
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-4 text-accent-red">
            {error}
          </div>
        ) : (
          <TicketTable tickets={tickets} loading={loading} />
        )}
      </div>
    </div>
  )
}

export default App
