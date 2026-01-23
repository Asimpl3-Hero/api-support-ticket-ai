import { useState } from 'react'
import { Header } from './components/ui/Header'
import { StatsCards } from './components/ui/StatsCards'
import { TrendsChart } from './components/ui/TrendsChart'
import { FilterTabs } from './components/ui/FilterTabs'
import { TicketTable } from './components/ui/TicketTable'
import { CreateTicketModal } from './components/ux/CreateTicketModal'
import { useTickets } from './hooks/useTickets'

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    tickets,
    allTickets,
    loading,
    error,
    stats,
    counts,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    addTicket,
  } = useTickets()

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewTicket={() => setIsCreateModalOpen(true)}
        />

        <StatsCards
          total={stats.total}
          pending={stats.pending}
          processed={stats.processed}
          negative={stats.negative}
          trends={stats.trends}
        />

        <TrendsChart tickets={allTickets} />

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
          <TicketTable tickets={tickets} loading={loading} searchQuery={searchQuery} />
        )}
      </div>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={addTicket}
      />
    </div>
  )
}

export default App
