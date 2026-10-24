# Wanderlust - Project Context & Architecture

> Canonical project-level context, architecture guide, development commands, and coding conventions for the **Wanderlust** application.

---

## 1. Project Overview & Architecture

**Wanderlust** is a modern travel and exploration web application built on Next.js 16 (App Router) and React 19. It leverages the latest React Compiler, Tailwind CSS v4, Base UI primitives with shadcn's `base-nova` design system, and Turbopack.

### Tech Stack Summary

| Layer | Technology | Version / Details |
|---|---|---|
| **Framework** | Next.js (App Router) | `16.4.3` with Turbopack, `cacheComponents`, `partialPrefetching` |
| **Runtime & Library** | React & React DOM | `19.3.0` |
| **Compiler** | React Compiler | `babel-plugin-react-compiler` (`1.0.0`) via Next.js `reactCompiler: true` |
| **Language** | TypeScript | `^5.0` with strict mode, `moduleResolution: bundler` |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/turbopack`, CSS-first config in `globals.css` |
| **Animations** | `tw-animate-css` | `^1.4.0` |
| **Design System** | shadcn (base-nova) | `@shadcn/react`, styled on `@base-ui/react` primitives |
| **UI Primitives** | Base UI | `@base-ui/react` (`^1.9.0`) — *not Radix* |
| **Class Merging** | `cn` | `^0.5.0` (direct package import) |
| **Icons** | Lucide React | `lucide-react` (`^1.61.0`) |
| **Data Viz & Charts** | Recharts | `recharts` (`^3.8.0`) |
| **Syntax Highlighting** | Shiki | `shiki` (`^4.5.0`) with dynamic language loaders |
| **Interactive UI** | CMDK, Embla, React-Day-Picker | `cmdk`, `embla-carousel-react`, `react-day-picker`, `react-resizable-panels`, `input-otp` |
| **Typography** | Josefin Sans | Loaded via `next/font/google` in `layout.tsx` |
| **Package Manager** | npm | `package-lock.json` committed |

---

## 2. Key Folder Structure

```
wanderlust/
├── .next/                   # Next.js build and dev cache (including typed routes)
├── public/                  # Static assets served at root
│   ├── images/              # Travel UI assets (Banner.png, CTA.png, avatars, logos)
│   ├── file.svg, globe.svg  # Default Next.js vector assets
│   └── next.svg, vercel.svg
├── src/
│   ├── app/                 # Next.js App Router root
│   │   ├── favicon.ico      # App icon
│   │   ├── globals.css      # Tailwind v4 theme, OKLCH CSS variables, dark theme
│   │   ├── layout.tsx       # Root layout (Josefin Sans font, metadata)
│   │   └── page.tsx         # Home page entry point
│   ├── components/
│   │   └── ui/              # 40+ base-nova UI components (@base-ui/react based)
│   │       ├── button.tsx, dialog.tsx, drawer.tsx, card.tsx
│   │       ├── carousel.tsx, chart.tsx, sidebar.tsx, calendar.tsx
│   │       └── ... (accordion, popover, tabs, tooltip, toast, etc.)
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.ts    # Media query breakpoint detection (768px)
│   │   └── use-highlighted-code.ts # Shiki streaming syntax highlighter hook
│   └── lib/                 # Core utilities
│       ├── utils.ts         # Re-exports { cn } from "cn"
│       └── highlighter.tsx  # Shiki core instance with on-demand language loading
├── AGENTS.md                # Agent instructions & rules loaded by AI coding assistants
├── components.json          # shadcn configuration (base-nova style, neutral color)
├── eslint.config.mjs        # ESLint 9 flat config (Next core-web-vitals + typescript)
├── next.config.ts           # Next.js configuration (reactCompiler, cacheComponents, Turbopack)
├── package.json             # Dependencies and npm scripts
├── PROJECT_CONTEXT.md       # Canonical project architecture and guidelines (this file)
├── README.md                # General readme
└── tsconfig.json            # TypeScript configuration with @/* alias and typed routes
```

---

## 3. Setup, Run, and Verification Commands

### Package Installation
```bash
npm install
```

### Development Server
Starts the local development server with Turbopack on port 3000:
```bash
npm run dev
```
Accessible at [http://localhost:3000](http://localhost:3000).

### Production Build & Run
```bash
npm run build
npm run start
```

### Typechecking & Linting
Run both checks after making changes (no automated CI pipeline is currently configured):
```bash
# Typecheck TypeScript (App Router typed routes included)
npx tsc --noEmit
# On Windows PowerShell if script execution is restricted:
npx.cmd tsc --noEmit

# Run ESLint
npm run lint
# Or targeted linting / fixing:
npx eslint <path-to-file-or-dir>
npx eslint src/components --fix
```

### Component Scaffolding
Use shadcn CLI configured with `base-nova` style:
```bash
npx shadcn list
npx shadcn add <component-name>
```

### Testing Status
- There is currently **no test suite** (Jest / Vitest / Playwright) configured in the repository. Verify functionality via `npx tsc --noEmit`, `npm run lint`, and manual dev server validation.

---

## 4. Coding Guidelines and Conventions

### 1. Next.js 16 & React 19 Architectural Conventions
- **React Compiler Enabled**: Do **not** manually add `useMemo` or `useCallback` for performance optimization. React Compiler handles memoization automatically at build/compile time.
- **Cache Components & Dynamic Data (`cacheComponents: true`)**:
  - Asynchronous data fetching in Server Components must be awaited inside `<Suspense>` boundaries or properly cached (e.g. `use cache`).
  - Unhandled dynamic data access outside suspense boundaries will trigger build errors.
- **Partial Prefetching (`partialPrefetching: true`)**: Enabled in `next.config.ts`. Ensure static layout shells and dynamic content streams are separated with Suspense.
- **Typed Routes**: `tsconfig.json` includes `.next/dev/types/**/*.ts` and `.next/types/**/*.ts`. Utilize generated route parameter helpers (e.g., `LayoutProps<"/">`, `PageProps`).
- **Breaking Changes in Next.js 16**: If uncertain about updated APIs, refer to `node_modules/next/dist/docs/`.

### 2. UI Components & Design System (`base-nova`)
- **Base UI, NOT Radix**: UI components in `src/components/ui/*` are built on top of **`@base-ui/react`**. `@radix-ui/*` packages are **not** installed. Do not import or introduce Radix primitives.
- **Class Helper Import**:
  - Components use `import { cn } from "cn"`.
  - `src/lib/utils.ts` also re-exports `cn` for project-wide compatibility (`export { cn } from "cn"`).
  - Do not rewrite existing imports across `src/components/ui/*` from `"cn"` to `"@/lib/utils"`.
- **Component Modification**: Prefer using `npx shadcn add <component>` to add or refresh components. Avoid manual edits to vendor-generated UI scaffolding unless customizing styles.

### 3. Styling & Theming (Tailwind CSS v4)
- **CSS-First Configuration**: There is **no** `tailwind.config.js` or `tailwind.config.ts`.
- **Theme Variables**: All design tokens live in `src/app/globals.css` inside `@theme inline` using modern **OKLCH** color values.
- **Dark Mode**: Configured as `@custom-variant dark (&:is(.dark *));`. Theme styles switch under the `.dark` class ancestor.
- **Font**: Google's `Josefin_Sans` is applied on `html` (`${josefinSans.className} h-full antialiased`) in `src/app/layout.tsx`.

### 4. Code Structure & Import Aliases
- Use path alias `@/*` resolving to `./src/*`:
  - Components: `@/components/...`
  - UI Primitives: `@/components/ui/...`
  - Hooks: `@/hooks/...`
  - Utilities: `@/lib/...`
  - App files: `@/app/...`

### 5. ESLint & State Management Rules
- React 19 rules strictly flag calling `setState` synchronously inside `useEffect` bodies (`react-hooks/set-state-in-effect`). Ensure state updates inside effects are wrapped in callbacks, event listeners, or handled during render without cascading effects.

