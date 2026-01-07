# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server (localhost:4321)
bun dev

# Build production site to ./dist/
bun build

# Preview production build locally
bun preview

# Run Astro CLI commands
bun astro ...
```

## Architecture Overview

### Technology Stack
- **Framework**: Astro 5 with React 19 integration
- **Styling**: Tailwind CSS 4 with custom configuration
- **Animations**: GSAP for UI transitions
- **UI Components**: shadcn/ui (New York style) + Radix UI primitives
- **3D Graphics**: Three.js with shader effects via @paper-design/shaders-react
- **Package Manager**: Bun

### Project Structure

```
src/
├── components/
│   ├── header.tsx       # Site header component
│   ├── footer.tsx       # Site footer component
│   ├── loading.tsx      # Session-based loading screen
│   ├── shader.tsx       # Animated background shader
│   └── ui/              # shadcn/ui component library
├── content/             # Astro content collections (profile, activity, works)
├── pages/               # Astro pages (index.astro is main entry)
├── layouts/             # Astro layout templates (Layout.astro)
├── lib/                 # Utilities (utils.ts for cn() helper)
├── assets/              # Static assets (images, SVGs)
└── styles/              # Global CSS (global.css)
```

### Key Architecture Patterns

**Simple Single Page Site**
- Main entry point: `src/pages/index.astro`
- Static layout with Header, Logo (SVG), and Footer
- No scroll behavior: `overflow: hidden` set globally in global.css on html/body elements
- Fixed positioning used throughout

**Loading Experience**
- Session-based loading screen: shows once per session via `sessionStorage.getItem('hasVisited')`
- `Loading.tsx` component renders grid animation with GSAP stagger effects
- Script in `index.astro` handles fade-in after loading completes or skips loading on subsequent visits
- Loading element fades out after 2.5 seconds on first visit, main content fades in

**Shader Background**
- `Shader.tsx` (previously MotionBackground.tsx) renders full-screen animated background
- Uses `Dithering` shader from `@paper-design/shaders-react`
- Positioned with `-z-10` to stay behind all content
- Responsive sizing based on window dimensions

**Content Collections**
- Profile, activity, and works data stored in `src/content/` directories
- Schemas defined in `src/content/config.ts` with Zod validation
- Collections: `profile` (personal info), `activity` (timeline data), `works` (portfolio items)

**Component Hydration Strategy**
- Client directives: `client:load` used for interactive components (Loading, Shader)
- GSAP animations run in browser via Astro inline scripts or React useEffect hooks

**Path Aliases**
- `~/*` maps to `src/*` (configured in astro.config.mjs)
- Allows imports like `import Header from '~/components/header'`

**GSAP Animation Architecture**
- Loading grid animation uses stagger effects with center origin
- Page fade-in/out transitions in index.astro inline script
- All animations include proper cleanup in useEffect returns

**shadcn/ui Integration**
- Components in `src/components/ui/` follow New York style variant
- Configuration in `components.json` with path aliases
- Utility function `cn()` in `src/lib/utils.ts` for conditional classes (clsx + tailwind-merge)

**Custom Fonts**
- Adobe Typekit integration (kitId: 'vza3sdw') loaded in Layout.astro
- Google Fonts (Fira Mono) for monospace text
- Tailwind extends with custom font families: fugaz, fira, futura_100, futura_pt, comma, eurostile, eurostile_cond

**Analytics**
- Vercel Analytics integrated in Layout.astro via `@vercel/analytics/react`

## Development Notes

- This is a portfolio/personal website for Kizuki Aiki (kz creation)
- Scroll behavior is intentionally disabled globally via `overflow: hidden` on html/body - do not re-enable
- Session-based loading screen requires testing in incognito/clearing sessionStorage to see first-visit experience
- New content collections require schema definition in `src/content/config.ts`
- UI components should use existing shadcn/ui components in `src/components/ui/` before creating new ones
- GSAP animations should always include cleanup in useEffect return to prevent memory leaks
- Shader component dimensions update on window resize via useLayoutEffect
