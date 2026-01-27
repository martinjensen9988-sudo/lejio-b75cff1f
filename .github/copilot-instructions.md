# Copilot AI Agent Instruktioner for Lejio

## Projektoversigt
- **Stack:** Vite + React + TypeScript + Tailwind CSS + shadcn-ui + Supabase (backend, auth, functions)
- **Formål:** Biludlejningsplatform for private, professionelle og erhverv, med admin- og forhandler-portal, live chat og AI-funktioner.

## Arkitektur & Mønstre
- **Sider:** Alle ruter i `src/pages/` (og undermapper) er React-komponenter, ofte lazy-loadet for performance.
- **Komponenter:** Delt UI og forretningslogik i `src/components/` og `src/hooks/`.
- **State & Data:**
  - Global state via React Context (`useAuth`, `useAdminAuth`)
  - Datahentning/mutation via [@tanstack/react-query](https://tanstack.com/query/latest)
  - Supabase er backend (auth, storage, DB, edge functions i `supabase/functions/`).
- **Routing:** `react-router-dom` til navigation. Admin- og dashboardruter beskyttes af context providers.
- **Styling:** Tailwind CSS og shadcn-ui til alt UI. Brug utility-klasser og shadcn-mønstre til nyt UI.
- **Build:** Vite config i `vite.config.ts` (se manualChunks for code splitting, PWA setup og plugins).

## Udvikler-workflows
- **Start dev server:** `npm run dev`
- **Byg til produktion:** `npm run build`
- **Lint:** `npm run lint`
- **Preview build:** `npm run preview`
- **Supabase functions:** Læg edge functions i `supabase/functions/`. Konfigurer JWT i `supabase/config.toml`.
- **Deploy:** Brug Lovable web UI til deployment og domænestyring.

## Projektkonventioner
- **Imports:** Brug `@/` alias for `src/` (se `vite.config.ts`).
- **Komponentstruktur:** Saml relaterede filer. PascalCase til komponenter, camelCase til hooks.
- **Auth:** Brug `useAuth` til bruger, `useAdminAuth` til admin. Tjek altid `profile.user_type` for rolle.
- **API:** Brug Supabase-klient til DB og auth. Til custom logik, brug edge functions (se `use*` hooks).
- **Test:** Playwright config findes, men ingen testscripts som standard.

## Integrationer
- **Supabase:** Al backend, auth og storage. Edge functions i `supabase/functions/` (se `config.toml` for JWT).
- **Mapbox:** Bruges til kort (se `mapbox-gl` dependency og relaterede hooks/komponenter).
- **AI/Automation:** Flere edge functions og hooks bruger AI (fx `ai-find-leads`, `ai-price-suggestion`).
- **Live Chat:** Chat-komponenter i `src/components/chat/` og relaterede hooks.

## Eksempler
- **Tilføj dashboard-side:** Opret fil i `src/pages/dashboard/`, tilføj lazy import i `App.tsx` og registrer ruten.
- **Tilføj Supabase function:** Læg kode i `supabase/functions/`, konfigurer i `config.toml` hvis JWT kræves.
- **Tilføj ny hook:** Læg i `src/hooks/`, brug camelCase og følg eksisterende mønstre.

## Referencer
- Main entry: `src/App.tsx`
- Auth: `src/hooks/useAuth.tsx`, `src/hooks/useAdminAuth.tsx`
- Supabase config: `supabase/config.toml`
- Vite config: `vite.config.ts`
- UI-mønstre: `src/components/ui/`, shadcn-ui docs

---
Se også [README.md](../README.md) og kodekommentarer. Er du i tvivl, så følg eksisterende mønstre og find lignende filer.