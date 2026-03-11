# AGENTS.md - Wedding Site Developer Guide

This guide provides essential information for AI coding agents working on this wedding website project.

## Project Overview

**Stack**: React 19 + TypeScript 5.8 + Vite 7 + Supabase + Tailwind CSS 4  
**UI Library**: shadcn/ui (New York style) + Radix UI primitives  
**Routing**: React Router 7  
**Forms**: React Hook Form + Zod validation  
**Animations**: GSAP

## Build & Development Commands

```bash
# Development
npm run dev              # Start dev server (Vite)

# Production
npm run build            # TypeScript check + build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint

# Testing
# ⚠️ No test framework configured yet
```

### Running Individual Tests
Currently, no test framework (Jest/Vitest) is set up. When adding tests:
- Recommended: Use Vitest (integrates well with Vite)
- Run single test: `npm test -- path/to/test.spec.ts`

## Project Structure

```
src/
├── pages/           # Route pages (e.g., rsvp.tsx)
├── components/      # Custom React components
│   └── ui/          # shadcn/ui components (button, input, etc.)
├── lib/
│   ├── utils.ts     # cn() utility for Tailwind classes
│   └── supabase.ts  # Supabase client initialization
└── App.tsx          # Main application component
```

## Code Style Guidelines

### Import Conventions

1. **Path Aliases**: Always use `@/` for absolute imports
   ```typescript
   import { Button } from '@/components/ui/button'
   import { cn } from '@/lib/utils'
   import type { RSVPData } from '@/types'
   ```

2. **Import Order** (implicit from codebase patterns):
   - React imports first
   - Third-party libraries
   - Local components/utilities (using @/ alias)
   - Types (prefer `import type` for type-only imports)
   - CSS files last (relative paths)

3. **Type-Only Imports**: Use explicit type imports
   ```typescript
   import type { ComponentProps } from 'react'
   import { type ClassValue } from 'clsx'
   ```

### TypeScript Standards

- **Strict Mode**: Enabled - all strict checks enforced
- **No Unused Variables**: `noUnusedLocals` and `noUnusedParameters` enabled
- **Target**: ES2022 with browser globals
- **Module Resolution**: Bundler mode
- **JSX**: `react-jsx` (no need to import React in components)

### Component Patterns

1. **Function Components**: Use `function` keyword (not arrow functions for main exports)
   ```typescript
   export default function RsvpPage() {
     // Component logic
   }
   ```

2. **Named vs Default Exports**:
   - UI components: Default exports
   - Utilities and hooks: Named exports
   - Multiple exports from one file: Named exports

3. **Component Props Typing**:
   ```typescript
   import type { ComponentProps } from 'react'
   
   interface ButtonProps extends ComponentProps<'button'> {
     variant?: 'default' | 'ghost'
   }
   ```

### React Patterns

1. **Hooks**: Import and use at component top-level
   ```typescript
   const [state, setState] = useState<Type>(initialValue)
   const location = useLocation()
   ```

2. **Form Handling**: Use React Hook Form + Zod
   ```typescript
   const formSchema = z.object({
     field: z.string().min(1, 'Required message')
   })
   
   const { register, handleSubmit } = useForm<FormData>({
     resolver: zodResolver(formSchema)
   })
   ```

3. **State Management**: Local useState for component state, no global state library

### Styling

1. **Tailwind CSS**: Use utility classes extensively
   ```typescript
   <div className="flex items-center justify-between p-4 bg-background">
   ```

2. **Conditional Classes**: Use `cn()` utility from `@/lib/utils`
   ```typescript
   import { cn } from '@/lib/utils'
   
   <div className={cn(
     "base-classes",
     condition && "conditional-classes",
     variant === 'primary' && "variant-classes"
   )}>
   ```

3. **Component Variants**: Use `class-variance-authority` (cva) for complex variants
   ```typescript
   import { cva, type VariantProps } from 'class-variance-authority'
   
   const buttonVariants = cva('base-classes', {
     variants: {
       variant: { default: '...', ghost: '...' }
     }
   })
   ```

### Error Handling

1. **Async Operations**: Always use try-catch-finally
   ```typescript
   const handleSubmit = async (data: FormData) => {
     setLoading(true)
     try {
       const { error } = await supabase.from('table').insert(data)
       if (error) throw error
       // Success handling
     } catch (error) {
       console.error('Error:', error)
       setError('User-friendly message')
     } finally {
       setLoading(false)
     }
   }
   ```

2. **Supabase Error Codes**: Check specific codes when relevant
   ```typescript
   if (error.code === '23505') {
     // Handle unique constraint violation
   }
   ```

### Naming Conventions

- **Components**: PascalCase (e.g., `CountdownTimer`, `AppNavbar`)
- **Files**: 
  - Components: kebab-case with .tsx (e.g., `countdown-timer.tsx`)
  - Pages: kebab-case with .tsx (e.g., `rsvp.tsx`)
  - Utilities: kebab-case with .ts (e.g., `supabase.ts`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### Environment Variables

Access via `import.meta.env.VITE_PUBLIC_*` (Vite convention):
```typescript
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
```

## Supabase Integration

```typescript
import { supabase } from '@/lib/supabase'

// Insert
const { data, error } = await supabase
  .from('table_name')
  .insert(payload)
  .select()

// Query
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components use:
- Radix UI primitives for accessibility
- Tailwind CSS variables for theming
- CVA for variant management

## ESLint Configuration

- Uses flat config format (eslint.config.js)
- Plugins: typescript-eslint, react-hooks, react-refresh
- Auto-fixes available via IDE integration
- Ignore patterns: `dist/`

## Key Dependencies

- **@supabase/supabase-js**: Database & auth
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **lucide-react**: Icon library
- **clsx + tailwind-merge**: Conditional class merging
- **gsap**: Animation library

## Best Practices

1. Always validate forms with Zod schemas
2. Use semantic HTML elements
3. Keep components focused and single-responsibility
4. Handle loading and error states for async operations
5. Use TypeScript strict mode - no `any` types
6. Leverage shadcn/ui components instead of building from scratch
7. Use self-closing tags for elements without children: `<Component />`
8. Prefer composition over prop drilling for complex component trees
