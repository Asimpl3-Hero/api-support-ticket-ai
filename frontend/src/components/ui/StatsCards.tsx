interface StatsCardsProps {
  total: number
  pending: number
  processed: number
  negative: number
  trends?: {
    total: number
    pending: number
    processed: number
    negative: number
  }
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  trend?: number
  trendColor?: string
  borderColor: string
}

function StatCard({ icon, label, value, trend, trendColor = 'text-accent-green', borderColor }: StatCardProps) {
  return (
    <div className={`stat-card ${borderColor}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="icon-container">
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-sm ${trendColor}`}>
            {trend >= 0 ? '↗' : '↘'} {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-text-primary mb-1">
        {value.toLocaleString()}
      </p>
      <p className="text-subtitle">{label}</p>
    </div>
  )
}

export function StatsCards({ total, pending, processed, negative, trends }: StatsCardsProps) {
  return (
    <div className="stats-grid mb-6">
      <StatCard
        icon={<TicketIcon />}
        label="Total Tickets"
        value={total}
        trend={trends?.total}
        trendColor={trends?.total !== undefined && trends.total >= 0 ? 'text-accent-green' : 'text-accent-red'}
        borderColor="border-accent-blue"
      />
      <StatCard
        icon={<ClockIcon />}
        label="Pendientes"
        value={pending}
        trend={trends?.pending}
        trendColor={trends?.pending !== undefined && trends.pending <= 0 ? 'text-accent-green' : 'text-accent-red'}
        borderColor="border-accent-yellow"
      />
      <StatCard
        icon={<CheckIcon />}
        label="Procesados"
        value={processed}
        trend={trends?.processed}
        trendColor={trends?.processed !== undefined && trends.processed >= 0 ? 'text-accent-green' : 'text-accent-red'}
        borderColor="border-accent-green"
      />
      <StatCard
        icon={<AlertIcon />}
        label="Negativos"
        value={negative}
        trend={trends?.negative}
        trendColor={trends?.negative !== undefined && trends.negative <= 0 ? 'text-accent-green' : 'text-accent-red'}
        borderColor="border-accent-red"
      />
    </div>
  )
}

function TicketIcon() {
  return (
    <svg className="icon-md text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="icon-md text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="icon-md text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="icon-md text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
