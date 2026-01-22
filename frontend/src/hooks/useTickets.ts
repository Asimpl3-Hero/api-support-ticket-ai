import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { Ticket } from '../types/ticket'
import type { FilterType } from '../components/ui/FilterTabs'

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  useEffect(() => {
    fetchTickets()

    const channel = supabase
      .channel('tickets-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        (payload) => {
          setTickets((current) => [payload.new as Ticket, ...current])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tickets' },
        (payload) => {
          setTickets((current) =>
            current.map((ticket) =>
              ticket.id === payload.new.id ? (payload.new as Ticket) : ticket
            )
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tickets' },
        (payload) => {
          setTickets((current) =>
            current.filter((ticket) => ticket.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchTickets() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tickets')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    // Tickets del período actual (últimos 7 días)
    const currentPeriod = tickets.filter(
      (t) => new Date(t.created_at) >= sevenDaysAgo
    )
    // Tickets del período anterior (7-14 días atrás)
    const previousPeriod = tickets.filter(
      (t) => {
        const date = new Date(t.created_at)
        return date >= fourteenDaysAgo && date < sevenDaysAgo
      }
    )

    // Función para calcular porcentaje de cambio
    const calcTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100 * 10) / 10
    }

    // Stats actuales
    const currentStats = {
      total: currentPeriod.length,
      pending: currentPeriod.filter((t) => !t.processed).length,
      processed: currentPeriod.filter((t) => t.processed).length,
      negative: currentPeriod.filter((t) => t.sentiment === 'negativo').length,
    }

    // Stats período anterior
    const previousStats = {
      total: previousPeriod.length,
      pending: previousPeriod.filter((t) => !t.processed).length,
      processed: previousPeriod.filter((t) => t.processed).length,
      negative: previousPeriod.filter((t) => t.sentiment === 'negativo').length,
    }

    return {
      total: tickets.length,
      pending: tickets.filter((t) => !t.processed).length,
      processed: tickets.filter((t) => t.processed).length,
      positive: tickets.filter((t) => t.sentiment === 'positivo').length,
      negative: tickets.filter((t) => t.sentiment === 'negativo').length,
      trends: {
        total: calcTrend(currentStats.total, previousStats.total),
        pending: calcTrend(currentStats.pending, previousStats.pending),
        processed: calcTrend(currentStats.processed, previousStats.processed),
        negative: calcTrend(currentStats.negative, previousStats.negative),
      },
    }
  }, [tickets])

  const counts = useMemo(() => ({
    all: tickets.length,
    pending: tickets.filter((t) => !t.processed).length,
    processed: tickets.filter((t) => t.processed).length,
    positive: tickets.filter((t) => t.sentiment === 'positivo').length,
    negative: tickets.filter((t) => t.sentiment === 'negativo').length,
  }), [tickets])

  const filteredTickets = useMemo(() => {
    let result = tickets

    // Apply filter
    switch (activeFilter) {
      case 'pending':
        result = result.filter((t) => !t.processed)
        break
      case 'processed':
        result = result.filter((t) => t.processed)
        break
      case 'positive':
        result = result.filter((t) => t.sentiment === 'positivo')
        break
      case 'negative':
        result = result.filter((t) => t.sentiment === 'negativo')
        break
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((t) =>
        t.description.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
      )
    }

    return result
  }, [tickets, activeFilter, searchQuery])

  return {
    tickets: filteredTickets,
    allTickets: tickets,
    loading,
    error,
    stats,
    counts,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
  }
}
