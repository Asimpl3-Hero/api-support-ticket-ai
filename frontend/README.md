# Support Ticket AI - Frontend

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Dashboard para gestión y monitoreo de tickets de soporte con análisis de sentimiento impulsado por IA.

## Características

- **Dashboard interactivo** con estadísticas en tiempo real
- **Gráfico de tendencias** semanales con Recharts
- **Filtros dinámicos** por estado y sentimiento
- **Modo claro/oscuro** con persistencia en localStorage
- **Actualizaciones en tiempo real** via Supabase Realtime
- **Diseño responsive** optimizado para móvil y desktop

## Requisitos

- Node.js 20+
- npm o pnpm

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

## Variables de Entorno

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_API_URL=http://localhost:8000
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecuta ESLint |

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes de interfaz
│   │   ├── Header.tsx
│   │   ├── StatsCards.tsx
│   │   ├── TrendsChart.tsx
│   │   ├── FilterTabs.tsx
│   │   └── TicketTable.tsx
│   └── ux/              # Componentes de experiencia
│       └── CreateTicketModal.tsx
├── constants/           # Constantes y configuración
│   └── ticket.ts
├── hooks/               # Custom hooks
│   ├── useTickets.ts
│   └── useTheme.ts
├── styles/              # Estilos globales
│   ├── components.css
│   └── global/
│       └── index.css
├── types/               # Tipos TypeScript
│   └── ticket.ts
└── App.tsx
```

## Docker

```bash
# Build de la imagen
docker build \
  --build-arg VITE_SUPABASE_URL=https://tu-proyecto.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=tu-anon-key \
  --build-arg VITE_API_URL=http://localhost:8000 \
  -t support-ticket-frontend .

# Ejecutar contenedor
docker run -d -p 3000:80 --name frontend support-ticket-frontend
```

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| **React 19** | Librería UI |
| **Vite 7** | Build tool y dev server |
| **Tailwind CSS 4** | Framework de estilos |
| **TypeScript** | Tipado estático |
| **Recharts** | Gráficos y visualizaciones |
| **Supabase** | Backend y realtime |

## Licencia

MIT
