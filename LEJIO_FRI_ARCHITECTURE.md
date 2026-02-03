# Lejio Fri - Architecture & Development Plan

## 1. HVAD ER LEJIO FRI?

**Lejio Fri** er en hvid-label billeudleningsplatform hvor:
- **Lessors** (billejeudlejere) kan oprette deres egen billeudlejingswebsite
- **Admin** styrer Lejio Fri platformen selv
- **Customers** kan leje biler fra lessors

**Nøglefunktioner:**
- PageBuilder: Lessors laver deres egen hjemmeside via drag-drop editor
- Dashboard: Lessors administrerer deres biler, bookinger, invoicer
- Booking System: Customers booker biler online
- Multi-tenant: Hver lessor har sin egen subdomain/domain

## 2. TEKNOLOGI STACK

**Frontend:**
- Vite + React + TypeScript
- Tailwind CSS + shadcn-ui
- React Router for navigation
- @tanstack/react-query for data fetching

**Backend:**
- Azure Static Web Apps (hosting)
- Azure Functions (API endpoints) i `/api` folder
- Node.js runtime
- Mock authentication (test users)

**Database:**
- Azure SQL (lagring af user data, pages, bookings osv.)
- SQL migrations i `supabase/migrations/` (deploy til Azure SQL)

**Deployment:**
- GitHub Actions CI/CD automatisk deploy på push til main
- Azure Static Web Apps managed API feature

## 3. ARKITEKTUR OVERBLIK

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
│  └─ Other endpoints                 │
└────────────┬────────────────────────┘
             │ Database queries
             ↓
┌─────────────────────────────────────┐
│   Azure SQL (Azure SQL Database Database)    │
│  ├─ auth (users)                    │
│  ├─ lessor_pages                    │
│  ├─ page_blocks                     │
│  ├─ bookings                        │
│  ├─ vehicles                        │
│  └─ other tables                    │
└─────────────────────────────────────┘
```

## 4. KEY FEATURES & COMPONENTS

### 4.1 Authentication (✅ DONE)
- **Mock test user:** martin@lejio.dk / password: test
- **Real endpoint:** `/api/AuthLogin` (POST)
  - Returns: `{ session: { access_token, user } }`
  - Token stored i localStorage som `fri-auth-token`
- **Session check:** `/api/AuthMe` (GET) with Authorization header
- **Context provider:** `FriAuthProvider` + `useFriAuthContext()`

### 4.2 FRI Dashboard (✅ PARTIALLY DONE)
- **Route:** `/fri/dashboard`
- **Protected:** Requires login via `FriAuthProvider`
- **Features:**
  - Overview tab with stats (vehicles, bookings, revenue)
  - Vehicles tab (placeholder for now)
  - Bookings tab (placeholder)
  - Invoices tab (placeholder)
  - Analytics tab (placeholder)
  - Team tab (placeholder)
  - Settings tab (placeholder)
  - **NEW:** "📄 Lav Hjemmeside" button → `/dashboard/pages`

### 4.3 PageBuilder (🟡 IN PROGRESS)
**What it does:**
- Lessors create custom HTML pages using drag-drop interface
- Pages stored in database
- Each page has multiple "blocks" (Hero, Features, CTA, Pricing osv.)
- Pages can be published and shared publicly

**Architecture:**
- **Frontend:** `src/pages/dashboard/PageBuilder.tsx` (drag-drop editor)
- **Frontend:** `src/pages/dashboard/PagesDashboard.tsx` (list pages)
- **Frontend:** `src/pages/PublicSite.tsx` (public renderer)
- **Backend:** 7 API endpoints:
  - `GET /api/GetPages` - fetch pages for lessor
  - `POST /api/CreatePage` - create new page
  - `PUT /api/UpdatePage` - update page metadata
  - `DELETE /api/DeletePage` - delete page
  - `POST /api/AddPageBlock` - add block to page
  - `PUT /api/UpdatePageBlock` - update block config
  - `DELETE /api/DeletePageBlock` - remove block
- **Storage:** Currently in-memory mock, needs Azure SQL integration
- **Block types:** Hero, Text, Pricing, Vehicles, Booking, Contact, Image, CTA, Testimonial, Footer

### 4.4 Database Schema (🟡 MIGRATION READY)
```sql
-- Lessors/Users
users (id, email, password_hash, user_type, created_at)

-- Pages
lessor_pages (id, lessor_id, slug, title, meta_description, is_published, created_at, updated_at)

-- Page content
page_blocks (id, page_id, block_type, position, config[JSON], created_at, updated_at)

-- Vehicles
vehicles (id, lessor_id, make, model, year, license_plate, daily_rate, status, created_at)

-- Bookings
bookings (id, lessor_id, vehicle_id, customer_email, start_date, end_date, total_price, status, created_at)

-- Invoices
invoices (id, lessor_id, booking_id, amount, status, due_date, created_at)
```

## 5. CURRENT STATUS

### ✅ DONE:
- GitHub Actions workflow (automatic Azure deployment)
- Azure Static Web Apps hosting
- 7 Azure Function endpoints
- Mock authentication system
- FRI dashboard loads without errors
- PageBuilder API endpoints created
- PageBuilder knap tilføjet til dashboard
- Database migrations created
- Timeout issues identified and mitigated

### 🟡 IN PROGRESS:
- PageBuilder persistent storage (API ready, needs DB connection)
- Dashboard sub-tabs data loading
- Real authentication against database

### ❌ TODO:
- Connect API endpoints to Azure SQL database
- Implement real token validation
- Load pages from database in PageBuilder UI
- Booking system implementation
- Invoice generation
- Payment integration (Stripe)
- Admin panel functionality
- Live chat integration
- Search/filtering
- Multi-domain support (subdomains per lessor)

## 6. HOW TO BUILD FEATURES

### Adding a new API endpoint:
1. Create folder: `/api/EndpointName/`
2. Create `function.json` with HTTP binding
3. Create `index.js` with handler logic
4. Update frontend to call it (via `/api/EndpointName`)
5. Deploy automatically via GitHub Actions

### Adding a frontend page:
1. Create component: `src/pages/path/ComponentName.tsx`
2. Add route in `src/App.tsx`
3. Lazy-load if needed
4. Call API endpoints for data

### Connecting to database:
1. Create Azure SQL table (migration file)
2. Create API endpoint that queries table
3. Update frontend hook to use API endpoint
4. Update `.vscode/settings.json` if changing timeout needs

## 7. IMPORTANT NOTES

### Authentication:
- ⚠️ Test token validation is mock (just checks presence)
- Real validation needed: decode JWT, check lessor_id, etc.
- Token format: Base64 JSON with lessor_id, email, iat

### Storage:
- ⚠️ ONLY USE AZURE SQL - use Azure SQL or file-based
- Current PageBuilder API uses in-memory mock storage
- Need persistent storage layer (Azure SQL or files on disk)

### Timeout Issues:
- Copilot times out when reading large files
- Solution: Use terminal commands, avoid grep_search/read_file
- Files to exclude: `.copilotignore`, `files.watcherExclude`

### Deployment:
- GitHub Actions workflow: `.github/workflows/azure-static-web-apps-deploy.yml`
- Auto-deploys on push to main
- Takes ~2 minutes for deployment

## 8. NEXT STEPS (PRIORITY ORDER)

1. **Connect PageBuilder to Azure SQL**
   - Update API endpoints to read/write lessor_pages table
   - Test CRUD operations
   - Verify pages persist

2. **Load pages in PageBuilder UI**
   - Update `usePages` hook to use real API
   - Fetch pages on component mount
   - Display in list view

3. **Implement booking system**
   - Create booking API endpoints
   - Build booking form/calendar
   - Save bookings to database

4. **Improve authentication**
   - Real token validation
   - Email verification
   - Password reset flow

5. **Admin panel**
   - Lessor management
   - Payment tracking
   - Support tickets

## 9. TESTING

**Test flow:**
1. Go to `https://zealous-stone-04c86dd03.2.azurestaticapps.net/fri/login`
2. Login: martin@lejio.dk / test
3. See FRI Dashboard
4. Click "📄 Lav Hjemmeside" button
5. Should go to PageBuilder dashboard
6. Try creating a page via UI

**API testing:**
```bash
# Create page
curl -X POST https://zealous-stone-04c86dd03.2.azurestaticapps.net/api/CreatePage \
  -H "Content-Type: application/json" \
  -d '{"lessor_id":"test-1","title":"Home","slug":"home"}'

# Get pages
curl "https://zealous-stone-04c86dd03.2.azurestaticapps.net/api/GetPages?lessor_id=test-1"
```

## 10. FILE STRUCTURE KEY

```
/workspaces/lejio-b75cff1f/
├── src/
│   ├── pages/
│   │   ├── fri/
│   │   │   ├── dashboard/Dashboard.tsx ← FRI Dashboard
│   │   │   ├── auth/LoginPage.tsx ← Login
│   │   │   └── landing/LandingPage.tsx
│   │   └── dashboard/
│   │       ├── PageBuilder.tsx ← Editor
│   │       ├── PagesDashboard.tsx ← List
│   │       └── PublicSite.tsx ← Public renderer
│   ├── components/
│   │   ├── BlockComponents.tsx ← Block types (Hero, CTA osv.)
│   │   └── PageBuilderSettings.tsx ← Block settings
│   ├── hooks/
│   │   ├── useAuth.tsx ← Auth hook
│   │   ├── useFriAuth.tsx ← FRI auth hook
│   │   └── usePages.tsx ← Pages hook (connects to API)
│   ├── providers/
│   │   ├── FriAuthProvider.tsx ← Auth context
│   │   └── BrandContext.tsx ← Branding context
│   └── integrations/
│       └── azure/client.ts ← API client
├── api/
│   ├── AuthLogin/ ← Login endpoint
│   ├── AuthMe/ ← Session check endpoint
│   ├── GetPages/ ← Fetch pages
│   ├── CreatePage/ ← Create page
│   ├── UpdatePage/ ← Update page
│   ├── DeletePage/ ← Delete page
│   ├── AddPageBlock/ ← Add block
│   ├── UpdatePageBlock/ ← Update block
│   ├── DeletePageBlock/ ← Delete block
│   └── storage.js ← File-based storage helper
├── supabase/
│   ├── migrations/
│   │   └── 20260203_create_lessor_pages.sql ← DB schema
│   └── config.toml
├── .github/workflows/
│   └── azure-static-web-apps-deploy.yml ← CI/CD
├── .vscode/
│   └── settings.json ← VS Code config
├── .devcontainer/
│   └── devcontainer.json ← Dev container config
└── .copilotignore ← Files to exclude from AI scanning
```

---

**Last Updated:** 2026-02-03
**Status:** Deployment ready, PageBuilder API endpoints working, persistent storage needed
**Next AI:** Read this file for full context before continuing development
