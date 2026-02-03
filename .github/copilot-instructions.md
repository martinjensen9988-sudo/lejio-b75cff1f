# Copilot AI Agent Instruktioner for Lejio

## ⚠️ VIGTIG: Lejio ≠ Lejio Fri (RI)

**DETTE ER TO HELT SEPARATE SYSTEMER - BLAND IKKE DATA/AUTH/FEATURES!**

| Aspekt | Lejio | Lejio Fri (RI) |
|--------|-------|----------------|
| **Formål** | Platform til billejekonti (private/professionelle) | White-label SaaS for freelancers/små firmaer |
| **Brugere** | Private, professionelle, corporate kunder | Lessors (owner af egen biludlejning) |
| **Database** | Supabase (main Lejio DB) | Azure SQL (separate fra Lejio) |
| **Auth** | Supabase Auth (via `useAuth()`) | Separate auth (`useFriAuth()`) - Azure Functions |
| **Routes** | `/` root, `/admin/*`, `/dashboard/*` | `/fri/*` (komplet isoleret) |
| **Features** | Lejio-features (CRM, dispatch, fleet) | Fri-features (page builder, lessor site) |
| **API** | Supabase functions | Azure Functions via Static Web Apps |
| **Token** | Supabase JWT | localStorage (`fri-auth-token`) |

---

## Projektoversigt
- **Stack:** Vite + React + TypeScript + Tailwind CSS + shadcn-ui + Supabase + Azure
- **Formål:** **DUAL PLATFORM**: (1) Lejio = billejeplatform for privatpersoner/professionelle/corporate; (2) Lejio Fri (RI) = separate white-label SaaS for lessors
- **Arkitektur:** Komplet isolering mellem Lejio og Lejio Fri - forskellige DBs, auth, features, routes

## Lejio Fri Arkitektur Overblik
```
┌─────────────────────────────────────┐
│     Frontend (React + Vite)         │
│  ├─ FRI Landing (public)            │
│  ├─ FRI Login/Signup                │
│  ├─ FRI Dashboard (lessor)          │
│  ├─ PageBuilder (drag-drop editor)  │
│  └─ Public Site Renderer            │
└────────────┬────────────────────────┘
             │ HTTPS
             ↓
┌─────────────────────────────────────┐
│   Azure Static Web Apps             │
│  (Hosted frontend + managed API)    │
└────────────┬────────────────────────┘
             │ /api/* requests
             ↓
┌─────────────────────────────────────┐
│    Azure Functions (Backend API)    │
│  ├─ AuthLogin, AuthMe, AuthLogout   │
│  ├─ GetPages, CreatePage, UpdatePage│
│  ├─ AddPageBlock, UpdatePageBlock    │
│  ├─ Vehicle CRUD endpoints          │
│  ├─ Booking endpoints               │
│  └─ Invoice endpoints               │
└────────────┬────────────────────────┘
             │ Database queries
             ↓
┌─────────────────────────────────────┐
│      Azure SQL Database             │
│  ├─ auth (users, tokens)            │
│  ├─ lessor_pages & page_blocks      │
│  ├─ vehicles & vehicle_maintenance  │
│  ├─ bookings & invoices             │
│  ├─ payments & discount_codes       │
│  └─ team_members & audit_logs       │
└─────────────────────────────────────┘
```

## Kritisk arkitektur
### Routing & Lazy Loading (App.tsx)
- **Alle ruter** lazy-loadet med `Suspense` for code splitting; fallback er spinner.
- **Tre separate portaler:** `/fri/*` (lessor-platformen), `/admin/*` (Lejio admin), `/dashboard/*` (page builder).
- **Auth-providers:** `<AuthProvider>` (privat/professionel bruger), `<AdminAuthProvider>` (Lejio admin), `<FriAuthProvider>` (Fri lessor).
- **TenantProvider:** Wraps all med `apiBaseUrl="/api"` – bruges til Fri API-routing via Static Web Apps.
- **BrandProvider:** Injicerer branding (farver, virksomhedsnavn) per tenant.

### State Management
- **React Context:** `useAuth()` → user profil, `profile.user_type` ('privat'/'professionel'); `useFriAuth()` → Fri lessor; `useAdminAuth()` → admin.
- **React Query:** Alle API-calls bruger QueryClient med: `staleTime: 5m`, `gcTime: 10m`, `retry: 2`, `refetchOnWindowFocus: false`.
- **Query config i App.tsx:** Følg eksisterende defaults – ændring påvirker hele appen.

### Supabase Integration
- **Service:** Auth, database, storage, edge functions.
- **Auth:** JWT baseret. Brugerprofiler i `profiles` table med `user_type`, `subscription_status`, `feature_flags`.
- **Edge functions:** Deno-baseret i `supabase/functions/`. Konfigureret i `config.toml` – sæt `verify_jwt = true/false` pr. function.
- **CORS:** Alle functions har CORS headers; public functions (fx `vehicle-lookup`) har `verify_jwt = false`.
- **Admin functions:** Bruger `SUPABASE_SERVICE_ROLE_KEY` for uautoriseret DB access; user-facing functions bruger token-baseret auth.

### Hooks mønstre
- **Naming:** `use[Feature]` → camelCase. `useAuth()`, `useFriAuth()`, `useVehicles()`, `useInvoices()` osv.
- **React Query:** Hooks returnerer `{ data, isLoading, error }` fra `useQuery()`/`useMutation()`.
- **Hooks lokation:** `src/hooks/use*.tsx`.
- **Eksempler:** `useFriAuth()` (token + localStorage), `useVehicles()` (bog med Supabase), `useInvoices()` (React Query + invoice generation).

## Udvikler-workflows
- **Start dev:** `npm run dev` → http://localhost:8080
- **Build production:** `npm run build` (rundt copy-api.js script), `npm run build:dev` for development build.
- **Lint:** `npm run lint` (ESLint hele projektet).
- **Preview:** `npm run preview` (serverer build).
- **Test:** Playwright konfigureret (`playwright.config.ts`), men ingen default test-scripts.
- **Deploy:** Lovable web UI → Static Web Apps (Azure) med auto-domain routing.

## Projektkonventioner
- **Imports:** `@/` = `src/` (konfigureret i `vite.config.ts`).
- **Komponenter:** PascalCase, `src/components/`. shadcn-ui komps i `src/components/ui/`.
- **Hooks:** camelCase, `src/hooks/use*.tsx`.
- **Pages:** `src/pages/` + undermapper (fx `src/pages/fri/dashboard/`).
- **Styling:** Tailwind CSS utility-klasser + shadcn-ui komponenter. Brug `clsx()` for conditional classes.
- **Error handling:** `<ErrorBoundary>` wrapper i App.tsx; use `try/catch` i hooks + React Query error states.

## Supabase edge functions mønstre
```typescript
// Standard setup (se generate-invoice/index.ts)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", ... };
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    // Logic here
  } catch (err) { return new Response(JSON.stringify({ error: err.message }), ...); }
});
```
- **JWT auth:** Dekoder token ved `verify_jwt = true`; dekoder manuelt hvis `false`.
- **Deno imports:** Brug stabile versioner (std@0.190.0, @supabase/supabase-js@2.57.2).
- **Logging:** `console.log([FEATURE] message)` til debugging.

## Multi-tenant & Fri-specifik
- **Fri:** Separate lessor-platformen med hvid-label branding. Routes prefixed `/fri/*`.
- **Auth flow:** Token i localStorage (`fri-auth-token`) → verificeres mod `/api/AuthMe` (Azure Function).
- **Tenant data:** `BrandProvider` holder branding config; `TenantProvider` håndterer API-routing.
- **API routing:** Azure Static Web Apps proxy `/api/*` → Azure Functions via `useTenant()` hook.

## Vigtige dependencies
- **UI:** `shadcn-ui` (baseret på Radix UI), `tailwindcss`, `lucide-react` (icons).
- **Data:** `@supabase/supabase-js`, `@tanstack/react-query`.
- **Form:** `react-hook-form`, `@hookform/resolvers`, `zod` (validation).
- **Routing:** `react-router-dom@6.30.1`.
- **Charts:** `recharts`.
- **Maps:** `mapbox-gl@3.17.0`.
- **Animation:** `framer-motion`.
- **Payments:** `@stripe/react-stripe-js`.
- **PWA:** `vite-plugin-pwa` (disabled i dev).
- **Analytics:** `@sentry/react@7.100.0`.

## RI (Rental Interface) - Lejio Fri SaaS Platform

**RI (Rental Interface)** = **White-label SaaS-løsning** hvor freelancere og små/mellemstore biludlejningsfirmaer starter egen biludlejningsvirksomhed.

### Alle Funktioner i Lejio Fri
En komplet løsning til biludlejning. Ingen skjulte funktioner – alt er inkluderet i din plan.

| Område | Features |
|--------|----------|
| **Flådestyring** | Registrer & organiser køretøjer • Spor vedligeholdelse & inspektioner • Administrer forsikring & dokumeter • Billeder & dokumentation • Tilstand & kilometer notater • GPS-tracking & placeringsdata |
| **Bookinger** | Online bookingkalender • Auto-bekræftelse af bookinger • SMS & email påmindelser • Fleksibel prissætning per køretøj • Tilgængelighedsstyring • Dubletbooking-beskyttelse |
| **Fakturaering** | Auto-fakturagenerering • Professionelle fakturaer med branding • Betalingspåmindelser • Spor udestående beløb • Rabatter & kuponkoder • Betalingsmetode-integrationer |
| **Analytik** | Omsætningsrapporter • Utilization rates • Kundetendenser • Køretøjsperformance • Grafer & diagrammer • PDF-eksport |
| **Teamsamarbejde** | Ubegrænsede teammedlemmer • Tilpassede roller & rettigheder • Aktivitetslog & audit • Teamkalender & opgavestyring • Notater & kommentarer • Delegation |
| **Sikkerhed** | 100% SSL-kryptering • GDPR-kompatibel • 2FA (totrins-autentificering) • Daglige backups • Adgangskontrol & logging • Sikker datacenter-hosting |
| **Dokumenthåndtering** | Gem kontrakter & aftaler • Forsikringsdokumenter • Køretøjsdokumentation • Kundeudtalelser & ID • Version kontrol • Deling med team |
| **Kommunikation** | SMS & email integrationer • Auto-påmindelser • Kundebeskeder & notifikationer • Tilpassbare email-skabeloner • Booking-links • Chat-support |
| **Branding & Tilpasning** | Indsæt farver & logo • Tilpasset domæne • Tilpassede email-signaturer • Tilpasset kundeportal • Sidespecifik branding • Hvid-label mulighed |
| **Integration & API** | Webhook-support • REST API (Business plan+) • Regnskabssoftware integration • Excel/CSV export • Kalenderintegration • Payment gateway integrationer |
| **Support & Performance** | 99.9% uptime garanteret • Verden-klasse infrastruktur • Mobil-optimeret • Offline mode • Sync på alle enheder • Personlig onboarding |

### Arkitektur & Multi-tenant Design
```
Lejio Fri Admin Portal (/fri/admin/*)
    ↓
    Manage all lessors, payments, support
    ↓
Supabase Auth (JWT) + Azure SQL Database
    ↑ ↓
Lejio Fri Lessor Dashboard (/fri/dashboard/*)
    ↓
    Fleet management, bookings, invoicing, analytics
    ↑
Lessor's Custom Website (Page Builder - custom domain)
    ↓
    Renters browse & book vehicles
    ↓
Booking System (fri_bookings) → Invoice → Payment
```

### Database Schema (Supabase)
- `fri_lessors` – Lessor accounts (freelancers/companies)
- `fri_lessor_team_members` – Team roles (owner/admin/manager/viewer)
- `fri_vehicles` – Fleet (make, model, year, price, maintenance, insurance)
- `fri_bookings` – Customer bookings (from_date, to_date, price, status)
- `fri_invoices` – Generated & tracked invoices
- `fri_payments` – Payment records & status
- `fri_support_tickets` – Customer support tickets
- `fri_api_keys` – Third-party API integrations
- `fri_pages` – Custom website pages (Page Builder)
- `fri_page_blocks` – Website blocks (Hero, Vehicles, Booking, etc.)
- `fri_custom_domains` – Custom domain mapping (lessor.example.com)

### User Roles & Access
1. **Lejio Fri Admin** (`/fri/admin/*`)
   - Platform operators managing all lessors, payments, disputes
   - Auth: `useFriAdminAuth()` + super_admin check
   - DB: `fri_admins` table
2. **Lessor (Fleet Owner)** (`/fri/dashboard/*`)
   - Freelancer/company managing their rental business
   - Auth: `useFriAuth()` → JWT token in localStorage (`fri-auth-token`)
   - API: Azure Functions `/api/*` (Static Web Apps proxy)
   - Data: isolated by `lessor_id` (RLS enforced)
3. **Renter (Customer)** (Public site + Page Builder site)
   - Browses lessor's website, books vehicles
   - Auth: Optional Supabase auth for bookings
   - Data: Creates `fri_bookings` entry

### Lessor Isolation & Security
- **Row-Level Security (RLS):** Lessors can ONLY see/modify their own data (`lessor_id` isolation)
- **Multi-tenant:** Each lessor is completely isolated - no data leakage
- **Team roles:** owner/admin/manager/viewer with granular permissions
- **Audit logging:** All changes tracked in `fri_audit_logs`

### Key Implementation Patterns

#### 1. Fleet Management (`/fri/dashboard/vehicles/*`)
- `useFriVehicles()` hook → CRUD operations
- Vehicle fields: make, model, year, license_plate, daily_rate, availability, maintenance_schedule, insurance_expiry
- Images & docs stored in Supabase Storage with lessor_id prefix
- GPS tracking integration for live vehicle location

#### 2. Booking System (`/fri/dashboard/bookings/*`)
- `useFriBookings()` hook → booking lifecycle management
- Booking states: pending, confirmed, active, completed, cancelled
- Conflict detection: prevents double-booking same vehicle
- Automated SMS/email: booking confirmation, pickup reminders, return confirmations
- Price calculation: base_rate * days + optional add-ons (insurance, GPS, etc.)

#### 3. Invoice Generation (`/fri/dashboard/invoices/*`)
- `useFriInvoices()` hook → auto-generate & track invoices
- Triggers on booking completion
- PDF generation with lessor branding (logo, colors, company details)
- Payment tracking: sent → unpaid → reminder_sent → paid/overdue
- Supports multiple payment methods (Stripe, MobilePay, etc.)

#### 4. Lessor Website (Page Builder + Public Site)
- Lessor creates pages via drag-and-drop Page Builder
- Published pages viewable at custom domain (lessor.lejio-fri.net)
- VehiclesBlock auto-populates from lessor's fleet
- BookingBlock captures customer bookings → stored in fri_bookings
- SEO metadata auto-generated from page content

#### 5. Admin Portal (`/fri/admin/*`)
- `useFriAdminAuth()` + super_admin check
- Dashboards: lessors list, payments, support tickets, analytics
- Can view any lessor's data (with audit trail)
- Manage disputes, handle refunds, support escalations
- Platform-wide analytics: total revenue, active lessors, bookings

## PageBuilder Completion Guide

**Status:** 50% done - Frontend virker, backend/DB integration mangler

### ✅ What Works:
- PagesDashboard UI (create/list pages)
- PageBuilder drag-drop editor (10 block types)
- Block settings form per type
- PublicSite renderer
- Routes setup (`/dashboard/pages`, `/dashboard/pages/:id/edit`)

### ❌ What's Missing (BLOCKERS):
1. **API integration to Azure SQL** – Pages not persisting to DB
2. **Real authentication** – Auth checks in API endpoints
3. **Auto-save** – Currently no draft saving
4. **Live preview** – No side-by-side preview
5. **Custom domains** – No domain routing yet

### 🎯 STEP-BY-STEP COMPLETION PLAN

#### Step 1: Fix Database Connection (CRITICAL)
```
Current: usePages() calls `/api/CreatePage` etc but API returns mock data
Needed:
1. Update Azure Functions to use Azure SQL (not mock)
2. Connect `/api/GetPages`, `/api/CreatePage`, `/api/UpdatePage` to DB
3. Add lessor_id isolation (RLS pattern)
4. Test with real database queries
```

**Affected Files:**
- `supabase/functions/page-builder-api/index.ts` – Replace mock with DB queries
- `src/hooks/usePages.tsx` – Already correct, just needs working API

**How to implement:**
```typescript
// In page-builder-api/index.ts
const getPages = async (lessorId: string) => {
  const sql = "SELECT * FROM fri_pages WHERE lessor_id = @lessorId ORDER BY created_at DESC";
  const result = await client.query(sql, [lessorId]);
  return result.recordset;
};
```

#### Step 2: Add Lessor ID Context (REQUIRED)
```
Current: Pages don't know which lessor owns them
Needed:
1. Extract lessor_id from JWT token in API
2. Enforce RLS – lessor can ONLY see their own pages
3. Check auth on every API call
```

**Pattern:**
```typescript
// In API endpoint
const token = req.headers.get("Authorization");
const lessorId = decodeToken(token).lessor_id; // From JWT
const pages = await sql("SELECT * FROM fri_pages WHERE lessor_id = ?", [lessorId]);
```

#### Step 3: Implement Auto-Save (UX IMPROVEMENT)
```
Current: Manual save only
Add:
1. Debounced auto-save every 30 seconds
2. Save as draft (is_draft = true)
3. Show "Saving..." indicator
4. Conflict resolution if user edits on multiple tabs
```

**Files to update:**
- `src/pages/dashboard/PageBuilder.tsx` – Add useEffect with setInterval for auto-save
- `src/hooks/usePages.tsx` – Add `autoSavePage()` method

#### Step 4: Add Live Preview (FEATURE)
```
Current: Edit mode only, no preview
Add:
1. Split screen – editor on left, preview on right
2. Mobile/desktop toggle
3. Sync preview as you type
4. Show preview in responsive viewport
```

**Implementation:**
```tsx
// In PageBuilder.tsx
<div className="flex gap-4 h-screen">
  <div className="w-1/2">
    {/* Editor */}
  </div>
  <div className="w-1/2 border-l">
    <PublicSitePreview blocks={blocks} />
  </div>
</div>
```

#### Step 5: Publish to Custom Domain (FINAL)
```
Current: No public site routing
Add:
1. One-click publish button
2. Custom domain mapping (fri_custom_domains table)
3. Lessor's site available at lessor.lejio-fri.net
4. SEO metadata auto-populated
```

**Flow:**
```
Lessor clicks "Publish" 
  → Page set is_published=true
  → Available at /site/{lessor_id}/{slug}
  → If custom domain set: {custom_domain}/{slug}
```

### 📋 Implementation Checklist

- [ ] **Database Connection**
  - [ ] Connect page-builder-api to Azure SQL
  - [ ] Test CREATE, READ, UPDATE, DELETE for pages
  - [ ] Test CREATE, READ, UPDATE, DELETE for blocks
  - [ ] Add lessor_id isolation

- [ ] **Authentication & RLS**
  - [ ] Decode JWT token in all API endpoints
  - [ ] Enforce lessor_id = token.lessor_id
  - [ ] Return 403 if lessor tries to access other lessor's pages

- [ ] **Auto-Save**
  - [ ] Add 30-second debounce timer
  - [ ] Save as draft (is_draft = true)
  - [ ] Show "Saved" indicator
  - [ ] Test concurrent edits

- [ ] **Live Preview**
  - [ ] Split screen layout
  - [ ] Desktop/mobile toggle
  - [ ] Real-time sync from editor to preview
  - [ ] Responsive viewport sizing

- [ ] **Publish & Domains**
  - [ ] "Publish" button triggers is_published=true
  - [ ] Pages available at /site/{lessor_id}/{slug}
  - [ ] Custom domain support
  - [ ] 404 handling for unpublished pages

- [ ] **Testing**
  - [ ] Create page → save → load (persistence)
  - [ ] Add blocks → edit → delete
  - [ ] Switch between pages
  - [ ] Publish → view as public
  - [ ] Check lessor isolation (can't see other lessors' pages)

### 🚀 Recommended Order of Work:
1. **Step 1** – Database Connection (makes everything else possible)
2. **Step 2** – Authentication & RLS (security critical)
3. **Step 3** – Auto-Save (UX polish)
4. **Step 4** – Live Preview (nice-to-have)
5. **Step 5** – Custom Domains (final feature)

After completion: **PageBuilder is 100% production-ready!** ✅

## Website Pages (Page Builder)
**Drag-and-drop website editor for Lejio Fri lessors** – allows custom site creation without coding.

### Key Components
- **PageBuilder.tsx** – Main editor with `react-beautiful-dnd` drag-drop, block palette, live settings.
- **BlockComponents.tsx** – 10 renderable block types: Hero, Text, Pricing, Vehicles, Booking, Contact, Image, CTA, Testimonial, Footer.
- **BlockSettings.tsx** – Dynamic config form for each block type (colors, text, filters, CTAs).
- **PagesDashboard.tsx** – Lessor dashboard: create, list, preview, delete pages.
- **PublicSite.tsx** – Renders published pages with SEO metadata, custom domains, responsive design.
- **usePages() hook** – CRUD operations via `/api/page-builder-api` edge function.

### Database Schema
- `fri_pages` – Page metadata (slug, title, meta_description, is_published, layout_json).
- `fri_page_blocks` – Block instances (block_type, position, config JSON, drag-drop ordering).
- `fri_page_templates` – Pre-built templates for quick start.
- `fri_custom_domains` – Custom domain mapping with verification.
- `fri_block_types` – Reference data for 10 block types.

### Adding New Block Type
1. Add block config to `BlockComponents.tsx` (export Component + settings interface).
2. Extend `BlockSettings.tsx` form fields for new block's config options.
3. Add to block palette in `PageBuilder.tsx` UI.
4. Insert reference data into `fri_block_types` (insert trigger auto-creates when needed).

### Routing
- `/dashboard/pages` – Pages list dashboard (lessor).
- `/dashboard/pages/:id` – Edit page with PageBuilder.
- `/pages/:slug` – Public page view (rendered from `fri_pages` data).
- Custom domains → routed via `PublicSite.tsx` DynamicPublicSite component.

## Pricing Plans & Feature Matrix

| Funktion | Professional | Business | Enterprise |
|----------|--------------|----------|-----------|
| Flådestyring | ✅ | ✅ | ✅ |
| Bookinger | ✅ | ✅ | ✅ |
| Fakturaering | ✅ | ✅ | ✅ |
| Grundlæggende analytik | ✅ | ✅ | ✅ |
| Avanceret analytik | ❌ | ✅ | ✅ |
| Teammedlemmer | 3 | 10 | Ubegrænset |
| API adgang | ❌ | Read-only | Fuld |
| Branding tilpasning | ✅ | ✅ | ✅ |
| Prioritets support | ❌ | Email + Slack | 24/7 prioritets |
| SLA uptime garanteret | ❌ | ❌ | 99.9% |

## File lokationer – vigtige eksempler
- **Auth:** `src/hooks/useAuth.tsx` (main bruger), `src/hooks/useFriAuth.tsx` (Fri lessor), `src/hooks/useAdminAuth.tsx`.
- **App routing:** `src/App.tsx` (lazy routes, QueryClient setup, providers).
- **Supabase:** `src/integrations/azure/client.ts` (Supabase-klient initialisering), `supabase/config.toml` (functions config).
- **API hooks:** Eksempler: `useVehicles()`, `useInvoices()`, `useBookings()`, `usePages()` – alle bruger React Query.
- **UI komponenter:** `src/components/ui/*` (shadcn-ui), `src/components/*` (app-specifikt).
- **Pages eksempel:** `src/pages/fri/dashboard/Dashboard.tsx`, `src/pages/fri/admin/LessorsPage.tsx`, `src/pages/dashboard/PageBuilder.tsx`.

## Red flags & vigtige points
1. **ALDRIG bland Lejio og Lejio Fri data** – De har helt separate DBs, auth, features. Hvis du rører ved Fri-data fra Lejio-kode = BUG.
2. **Route isolation:** Lejio ruter (`/admin/*`, `/dashboard/*`) må IKKE kommunikere med Fri routes (`/fri/*`).
3. **Auth isolation:** `useAuth()` (Lejio) ≠ `useFriAuth()` (Fri). Bland dem IKKE – de har helt forskellige tokens.
4. **Rolle-check:** I Lejio = `profile.user_type === 'professionel'`; I Fri = `useFriAuth()` lessor_id.
5. **API endpoints:** Lejio bruger Supabase functions; Fri bruger Azure Functions (`/api/*`).
6. **Database:** Lejio = Supabase; Fri = Azure SQL. HELT separate!
7. **Lazy imports:** Nye ruter → brug `lazy(() => import(...).then(m => ({ default: m.ComponentName })))` pattern.
8. **QueryClient retry:** Ændringer her påvirker hele app – væk med retries før udgivelse.
9. **CORS på functions:** Public functions (no JWT) skal have `verify_jwt = false` i config.

---
**Når du er usikker:** Søg efter lignende files (fx anden hook, anden route) og follow the pattern. Læs App.tsx for routing, useAuth.tsx for auth-patterns.

## Hvordan man bygger nye features

### Adding a new Azure Function API endpoint:
1. Create folder: `/api/EndpointName/`
2. Create `function.json` with HTTP binding
3. Create `index.js` with handler logic
4. Update frontend to call it via `/api/EndpointName`
5. Auto-deploys via GitHub Actions on push to main

### Adding a new frontend page:
1. Create component: `src/pages/path/ComponentName.tsx`
2. Add lazy-load route in `src/App.tsx`
3. Call API endpoints via custom hooks
4. Use React Query for data fetching

### Connecting to Azure SQL Database:
1. Create migration file in `supabase/migrations/azure-sql/`
2. Create Azure Function endpoint that queries table
3. Update frontend hook to use API endpoint
4. Use RLS (Row-Level Security) to isolate by lessor_id

## Current Implementation Status

### ✅ DONE:
- GitHub Actions CI/CD (automatic Azure deployment)
- Azure Static Web Apps hosting
- Mock authentication system (test user: martin@lejio.dk)
- FRI dashboard loads correctly
- PageBuilder API endpoints (7 endpoints)
- Database migrations created
- Timeout mitigation implemented

### 🟡 IN PROGRESS:
- PageBuilder persistent storage (API ready, needs DB connection)
- Dashboard sub-tabs data loading
- Real token validation against database

### ❌ TODO:
- Connect API endpoints to Azure SQL
- Real JWT token validation
- Load pages from DB in PageBuilder
- Booking system full implementation
- Invoice generation & PDF
- Payment integration (Stripe)
- Admin panel full functionality
- Multi-domain/subdomain support per lessor

## Vigtige references
- **Architecture:** `LEJIO_FRI_ARCHITECTURE.md` - Detaljeret arkitektur guide
- **Features:** `LEJIO_FRI_FEATURES.md` - Komplet feature-liste med checklists
- **Setup:** `LEJIO_FRI_SETUP_GUIDE.md` - Deployment & miljø-setup
- **Main entry:** `src/App.tsx` - Routing & provider setup
- **Auth:** `src/hooks/useFriAuth.tsx` - Fri-authentication
- **API config:** `supabase/config.toml` - Edge functions config

---

## 🚀 Implementation Priority - Hvad der Mangler

### FASE 1: Core Foundation (CRITICAL)
**Uden dette virker ingenting. Prioritet: HØJEST**

1. **Database Connection** 
   - [ ] Connect Azure Functions til Azure SQL
   - [ ] Real JWT token validation
   - [ ] RLS policies per lessor_id
   - **Impact:** Alt afhænger af dette

2. **Authentication & Authorization**
   - [ ] Real token decode & validation
   - [ ] Lessor role checking
   - [ ] Admin role checking
   - **Impact:** Security blocker

3. **PageBuilder Persistence**
   - [ ] Save pages to database
   - [ ] Load pages from database
   - [ ] Persist block configurations
   - **Impact:** Pages feature intet værd uden persistence

### FASE 2: Core Features (ESSENTIAL)
**Uden disse er Fri ikke en biludlejningsplatform. Prioritet: HØJT**

4. **Fleet Management**
   - [ ] Create/edit/delete vehicles
   - [ ] Vehicle attributes (make, model, year, license_plate, daily_rate)
   - [ ] Vehicle images & documentation
   - [ ] Maintenance tracking
   - **Impact:** Kernefunktionalitet

5. **Booking System**
   - [ ] Online booking calendar
   - [ ] Auto-conflict detection (dubletbooking-beskyttelse)
   - [ ] Booking confirmation emails/SMS
   - [ ] Booking status management
   - **Impact:** Revenue generator

6. **Invoice Generation**
   - [ ] Auto-generate on booking completion
   - [ ] Calculate: (daily_rate × days) + fees
   - [ ] Branded PDF generation
   - [ ] Payment status tracking
   - **Impact:** Lessor needs to get paid

7. **Payment Integration**
   - [ ] Stripe integration
   - [ ] Payment webhook handling
   - [ ] Multiple payment methods
   - **Impact:** Revenue flow

### FASE 3: Smart Features (IMPORTANT)
**Gør systemet intelligent & kompetitivt. Prioritet: MEDIUM**

8. **Analytics & Reporting**
   - [ ] Revenue reports
   - [ ] Utilization rates per vehicle
   - [ ] Customer trends
   - [ ] PDF export
   - **Impact:** Data-driven decisions

9. **Team Management**
   - [ ] Invite team members
   - [ ] Role-based access (owner/admin/manager/viewer)
   - [ ] Audit logging
   - **Impact:** Multi-user support

10. **Smart Page Builder Features**
    - [ ] AI page templates
    - [ ] Auto-populate vehicle blocks from fleet
    - [ ] Live preview (desktop + mobile)
    - [ ] Auto-save functionality
    - [ ] SEO auto-fill
    - **Impact:** User experience

### FASE 4: Polish & Scale (NICE-TO-HAVE)
**Gør det professionelt. Prioritet: LØT**

11. **Communications**
    - [ ] SMS reminders (Twilio)
    - [ ] Email templates
    - [ ] Customer notifications
    - **Impact:** Customer retention

12. **Document Management**
    - [ ] Insurance document storage
    - [ ] Contract templates
    - [ ] Version control
    - **Impact:** Compliance

13. **Admin Portal**
    - [ ] Lessor management
    - [ ] Payment tracking
    - [ ] Support tickets
    - [ ] Platform analytics
    - **Impact:** Operations

14. **Custom Domains & Branding**
    - [ ] Custom domain mapping
    - [ ] Logo & color branding
    - [ ] Custom email signatures
    - [ ] White-label experience
    - **Impact:** Brand identity

---

## Kritiske Blockers Rigtnusom skal Løses First

**Hvis disse ikke er done, ingenting virker:**

1. **Azure SQL Connection** - API endpoints kan ikke tale med database
2. **Real Auth** - Uden JWT validation er alt usikker
3. **PageBuilder Save/Load** - Pages forsvinder hvis ikke persisteret
4. **Booking System** - Revenue loop broken uden bookings

**Jeg anbefaler at starte med Fase 1 + Fase 2 inden man lancerer Fri.**