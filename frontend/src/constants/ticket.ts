// Colores de categorías para badges
export const CATEGORY_BADGE_COLORS: Record<string, string> = {
  'facturación': 'badge-info',
  'soporte técnico': 'badge-purple',
  'ventas': 'badge-warning',
  'devoluciones': 'badge-orange',
  'información general': 'badge-cyan',
  'quejas': 'badge-error',
  'otros': 'badge-muted',
}

// Colores de categorías para texto
export const CATEGORY_TEXT_COLORS: Record<string, string> = {
  'facturación': 'text-accent-blue',
  'soporte técnico': 'text-accent-purple',
  'ventas': 'text-accent-yellow',
  'devoluciones': 'text-accent-orange',
  'información general': 'text-accent-cyan',
  'quejas': 'text-accent-red',
  'otros': 'text-text-muted',
}

// Colores de sentimiento para badges
export const SENTIMENT_BADGE_COLORS: Record<string, string> = {
  positivo: 'badge-success',
  negativo: 'badge-error',
  neutro: 'badge-muted',
}

// Configuración de sentimiento con labels
export const SENTIMENT_CONFIG: Record<string, { label: string; class: string }> = {
  positivo: { label: 'Positivo', class: 'badge-success' },
  negativo: { label: 'Negativo', class: 'badge-error' },
  neutro: { label: 'Neutro', class: 'badge-muted' },
}

// Lista de categorías disponibles
export const CATEGORIES = [
  'facturación',
  'soporte técnico',
  'ventas',
  'devoluciones',
  'información general',
  'quejas',
  'otros',
] as const

// Lista de sentimientos disponibles
export const SENTIMENTS = ['positivo', 'negativo', 'neutro'] as const

// Tipos derivados de las constantes
export type Category = typeof CATEGORIES[number]
export type Sentiment = typeof SENTIMENTS[number]
