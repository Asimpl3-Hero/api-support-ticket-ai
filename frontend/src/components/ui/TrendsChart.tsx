import { useMemo } from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts'
import type { Ticket } from '../../types/ticket'

interface TrendsChartProps {
  tickets: Ticket[]
}

interface DayData {
  date: string
  label: string
  total: number
  processed: number
  pending: number
  negative: number
}

const COLORS = {
  total: '#3b82f6',      // accent-blue
  processed: '#22c55e',  // accent-green
  negative: '#ef4444',   // accent-red
  grid: '#262626',       // dark-border
  text: '#71717a',       // text-muted
}

export function TrendsChart({ tickets }: TrendsChartProps) {
  const chartData = useMemo(() => {
    const days: DayData[] = []
    const now = new Date()

    // Obtener el lunes de la semana actual
    const monday = new Date(now)
    const dayOfWeek = monday.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Si es domingo, retroceder 6 días
    monday.setDate(monday.getDate() + diff)
    monday.setHours(0, 0, 0, 0)

    // Generar lunes a domingo
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)

      const dateStr = date.toISOString().split('T')[0]
      const dayTickets = tickets.filter((t) => {
        const ticketDate = new Date(t.created_at)
        ticketDate.setHours(0, 0, 0, 0)
        return ticketDate.toISOString().split('T')[0] === dateStr
      })

      days.push({
        date: dateStr,
        label: date.toLocaleDateString('es', { weekday: 'short' }),
        total: dayTickets.length,
        processed: dayTickets.filter((t) => t.processed).length,
        pending: dayTickets.filter((t) => !t.processed).length,
        negative: dayTickets.filter((t) => t.sentiment === 'negativo').length,
      })
    }

    return days
  }, [tickets])

  const totalWeek = chartData.reduce((sum, d) => sum + d.total, 0)
  const processedWeek = chartData.reduce((sum, d) => sum + d.processed, 0)
  const negativeWeek = chartData.reduce((sum, d) => sum + d.negative, 0)

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-text-primary">Actividad Semanal</h3>
          <p className="text-subtitle">Lunes a domingo de esta semana</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-blue" />
            <span className="text-text-muted">Total ({totalWeek})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-green" />
            <span className="text-text-muted">Procesados ({processedWeek})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-red" />
            <span className="text-text-muted">Negativos ({negativeWeek})</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.total} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientProcessed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.processed} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.processed} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.negative} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.negative} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.grid}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: COLORS.text, fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: COLORS.text, fontSize: 12 }}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#141414',
                border: '1px solid #262626',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              }}
              labelStyle={{ color: '#fafafa', fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: '#a1a1aa', fontSize: 13 }}
              cursor={{ stroke: COLORS.grid, strokeDasharray: '3 3' }}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="transparent"
              fill="url(#gradientTotal)"
            />
            <Area
              type="monotone"
              dataKey="processed"
              stroke="transparent"
              fill="url(#gradientProcessed)"
            />
            <Area
              type="monotone"
              dataKey="negative"
              stroke="transparent"
              fill="url(#gradientNegative)"
            />

            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke={COLORS.total}
              strokeWidth={2.5}
              dot={{ fill: COLORS.total, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#141414' }}
            />
            <Line
              type="monotone"
              dataKey="processed"
              name="Procesados"
              stroke={COLORS.processed}
              strokeWidth={2.5}
              dot={{ fill: COLORS.processed, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#141414' }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              name="Negativos"
              stroke={COLORS.negative}
              strokeWidth={2.5}
              dot={{ fill: COLORS.negative, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#141414' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-accent-blue">{totalWeek}</p>
          <p className="text-xs text-text-muted">Total esta semana</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent-green">
            {totalWeek > 0 ? Math.round((processedWeek / totalWeek) * 100) : 0}%
          </p>
          <p className="text-xs text-text-muted">Tasa de procesamiento</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent-red">{negativeWeek}</p>
          <p className="text-xs text-text-muted">Sentimiento negativo</p>
        </div>
      </div>
    </div>
  )
}
