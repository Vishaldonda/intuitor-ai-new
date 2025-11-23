# Project Structure

## Directory Organization

```
/
├── src/
│   ├── components/          # React components (screens)
│   │   ├── Dashboard.tsx
│   │   ├── LandingPage.tsx
│   │   ├── TopicPage.tsx
│   │   ├── QuestionScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── ProfilePage.tsx
│   ├── App.tsx             # Main app with screen routing
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global styles (Tailwind imports)
│   └── vite-env.d.ts       # Vite type definitions
├── index.html              # HTML entry point
└── [config files]          # Various config files at root
```

## Architecture Patterns

### Navigation
- Simple string-based screen routing in `App.tsx`
- Each screen component receives `onNavigate` callback
- Screen state managed via `useState` hook

### Component Props
- Navigation callbacks: `onNavigate: (screen: string) => void`
- Action callbacks: `onStart: () => void`
- Components are functional with TypeScript interfaces

### Styling Conventions
- Tailwind utility classes for all styling
- Gradient backgrounds: `from-slate-900 via-slate-800 to-slate-900`
- Color scheme: Slate (dark), Cyan/Blue (primary), Orange (streaks)
- Consistent border radius: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Hover effects with transitions on interactive elements

### Component Structure
- All components in `src/components/` directory
- One component per file
- Default exports
- TypeScript for type safety
