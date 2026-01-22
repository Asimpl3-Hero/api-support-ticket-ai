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

  const stats = useMemo(() => ({
    total: tickets.length,
    pending: tickets.filter((t) => !t.processed).length,
    processed: tickets.filter((t) => t.processed).length,
    positive: tickets.filter((t) => t.sentiment === 'positivo').length,
    negative: tickets.filter((t) => t.sentiment === 'negativo').length,
  }), [tickets])

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
