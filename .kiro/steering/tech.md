# Technology Stack

## Core Technologies

- **Framework**: React 18.3+ with TypeScript
- **Build Tool**: Vite 5.4+
- **Styling**: Tailwind CSS 3.4+ with PostCSS
- **Icons**: Lucide React
- **Backend**: Supabase (supabase-js)

## Development Tools

- **Linting**: ESLint 9+ with React Hooks and React Refresh plugins
- **Type Checking**: TypeScript 5.5+ with strict mode
- **Package Manager**: npm

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run typecheck
```

## Configuration Notes

- Vite config excludes `lucide-react` from optimization
- Tailwind scans `index.html` and all `.{js,ts,jsx,tsx}` files in `src/`
- TypeScript uses project references (app + node configs)
- ESLint uses flat config format
