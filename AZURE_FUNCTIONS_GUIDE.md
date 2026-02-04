# Lejio Fri - Azure Functions Backend Implementation Guide

**Status:** 80% complete - Backend infrastructure ready, deployment pending

## Architecture Overview

```
┌─────────────────────────────┐
│  React Frontend (Vite)      │
│  - Lejio Fri Dashboard      │
│  - Page Builder             │
│  - Authentication           │
└────────────┬────────────────┘
             │ /api/* requests
             ↓
┌─────────────────────────────┐
│  Azure Static Web Apps      │
│  - Frontend hosting         │
│  - API routing to Functions │
└────────────┬────────────────┘
             │ proxies to
             ↓
┌─────────────────────────────┐
│  Azure Functions            │
│  - AuthLogin                │
│  - PagesGetPages            │
│  - PagesCreatePage          │
│  - (more endpoints ready)   │
└────────────┬────────────────┘
             │ SQL queries
             ↓
┌─────────────────────────────┐
│  Azure SQL Database         │
│  - lejio_fri database       │
│  - fri_lessors table        │
│  - fri_pages table          │
│  - fri_page_blocks table    │
│  - fri_vehicles table       │
└─────────────────────────────┘
```

## What Has Been Created

### 1. Database Setup (✅ Complete)

**Migrations:**
- `004_page_builder_schema.sql` - Page builder tables + block types
- `005_test_lessor.sql` - Test lessor (test@lessor.dk) with 3 vehicles
- `006_test_martin_account.sql` - Martin account (martin@lejio.dk) with 3 vehicles
- `007_create_database_user.sql` - Database user (martin_lejio_user) for Azure Functions

**Tables:**
```sql
fri_lessors              -- Lessor accounts
fri_lessor_team_members -- Team members with roles
fri_pages               -- Website pages
fri_page_blocks         -- Page blocks (hero, text, pricing, etc)
fri_vehicles            -- Fleet vehicles
fri_page_templates      -- Pre-built templates
fri_custom_domains      -- Custom domain mappings
fri_block_types         -- 10 block type definitions
```

### 2. Frontend Changes (✅ Complete)

**App.tsx Routes:**
```
/                         → Redirect to /fri
/fri                      → Landing page
/fri/login                → Login page
/fri/signup               → Signup page
/fri/dashboard            → Lessor dashboard
/fri/admin/*              → Admin portal
/dashboard/pages          → Page list
/dashboard/pages/:id/edit → Page builder
/site/:lessorId/*         → Public site renderer
```

**Components Created:**
- `PageBuilder.tsx` - Drag-and-drop editor
- `PageBuilderSettings.tsx` - Block configuration
- `BlockComponents.tsx` - 10 renderable blocks
- `PublicSite.tsx` - Public site renderer
- `PagesDashboard.tsx` - Page management

**Updated Hooks:**
- `useFriAuth.tsx` - Now uses Azure Functions (JWT-based)
- `usePages.tsx` - Mock data for testing

### 3. Azure Functions Backend (✅ Partially Complete)

**Location:** `/azure-functions/`

**Structure:**
```
azure-functions/
├── AuthLogin/
│   ├── index.ts          - JWT login endpoint
│   └── function.json     - Azure config
├── PagesGetPages/
│   ├── index.ts          - List pages for lessor
│   └── function.json
├── PagesCreatePage/
│   ├── index.ts          - Create new page
│   └── function.json
├── host.json             - Functions runtime config
├── local.settings.json   - Local environment variables
└── package.json          - Dependencies
```

**Endpoints Implemented:**
- `POST /api/auth/login` - Login with email/password, returns JWT
- `GET /api/pages` - Get all pages for authenticated lessor
- `POST /api/pages` - Create new page

**Endpoints Needed (TODO):**
- `GET /api/pages/:id` - Get page details
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `POST /api/pages/:id/blocks` - Add block to page
- `PUT /api/pages/:id/blocks/:blockId` - Update block
- `DELETE /api/pages/:id/blocks/:blockId` - Delete block
- `POST /api/pages/:id/publish` - Publish page
- `POST /api/auth/signup` - Register new account
- `GET /api/vehicles` - List lessor's vehicles
- `POST /api/pages/:id/publish` - Publish page to domain

### 4. Authentication Flow

**Current Implementation:**
```
User enters email + password
        ↓
POST /api/auth/login (Azure Function)
        ↓
Connect to Azure SQL
Query: SELECT * FROM fri_lessors WHERE email = @email
        ↓
Validate password (currently plain-text, should be hashed)
        ↓
Generate JWT token with:
- sub: lessor_id
- email
- company_name
- primary_color
- exp: 24 hours
        ↓
Return token to frontend
        ↓
Store in localStorage as 'fri-auth-token'
        ↓
Decode token in React to get user info
        ↓
Redirect to /fri/dashboard
```

**JWT Secret:**
- Environment variable: `JWT_SECRET`
- Default (dev): 'your-secret-key-change-in-production'
- **Must change in production!**

## Database Connection

**SQL Server:**
- Server: `lejio.database.windows.net`
- Database: `lejio_fri`
- User: `martin_lejio_user`
- Password: `TestPassword123!`

**Connection String:**
```
Server=tcp:lejio.database.windows.net,1433;Initial Catalog=lejio_fri;Persist Security Info=False;User ID=martin_lejio_user;Password=TestPassword123!;Encrypt=True;Connection Timeout=30;
```

## Test Accounts

### Account 1: Martin
- Email: `martin@lejio.dk`
- Lessor ID: `lessor-martin-001`
- Company: Martin Biludlejning
- Vehicles: 3 (BMW, Audi, Volvo)
- Password: `TestPassword123!` (set in Supabase, not in DB)

### Account 2: Test Lessor
- Email: `test@lessor.dk`
- Lessor ID: `lessor-test-001`
- Company: Test Biludlejning
- Vehicles: 3 (Tesla, VW Golf, Mercedes Sprinter)

## Deployment Checklist

### Step 1: Create Azure Function App
- [ ] Azure Portal → Create Function App
- [ ] Runtime: Node.js 18
- [ ] Region: Europe (West)
- [ ] Storage account: Create new
- [ ] Hosting plan: Consumption
- [ ] Application Insights: Enabled

### Step 2: Configure Environment Variables
In Azure Function App → Configuration:
```
DB_USER = martin_lejio_user
DB_PASSWORD = TestPassword123!
DB_SERVER = lejio.database.windows.net
DB_NAME = lejio_fri
JWT_SECRET = [strong-random-secret-here]
```

### Step 3: Deploy Functions
```bash
cd azure-functions
npm install
func azure functionapp publish <function-app-name>
```

Or via VS Code:
- Install Azure Functions extension
- Right-click folder → Deploy to Function App
- Select subscription and function app

### Step 4: Configure Azure Static Web Apps
In `staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"],
      "rewrite": "/api/functions/*"
    }
  ]
}
```

Or configure in portal → Configuration

### Step 5: Test Endpoints
```bash
# Login
curl -X POST https://<function-app>.azurewebsites.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"martin@lejio.dk","password":"TestPassword123!"}'

# Get pages (requires token)
curl -X GET https://<function-app>.azurewebsites.net/api/pages \
  -H "Authorization: Bearer <jwt-token>"
```

## Testing Frontend Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:8080/fri/login
# Login with martin@lejio.dk / TestPassword123!
```

**Note:** Requires Azure Functions running locally or remotely for auth to work.

### Run Azure Functions Locally
```bash
cd azure-functions
npm install
func start

# Functions will run on http://localhost:7071
# Frontend needs to use that URL or proxy it
```

## Next Steps (TODO)

### High Priority
1. **Deploy Azure Functions**
   - Create Function App
   - Set environment variables
   - Deploy endpoints

2. **Complete Missing Endpoints**
   - All page CRUD operations
   - Block management
   - Vehicle endpoints

3. **Fix Frontend Integration**
   - Page list loading
   - Page creation flow
   - Block CRUD in editor

4. **Security Hardening**
   - Use bcrypt for password hashing
   - Add CORS headers
   - Validate all inputs
   - Rate limiting
   - Add RLS policies in SQL

### Medium Priority
5. **Image Upload**
   - Implement file upload to Azure Blob Storage
   - Generate presigned URLs

6. **Email Service**
   - Setup SendGrid for notifications
   - Booking confirmations
   - Password resets

7. **Payment Integration**
   - Stripe API
   - Invoice generation

### Low Priority
8. **Advanced Features**
   - Custom domain DNS setup
   - Analytics
   - Booking system
   - GPS tracking

## Key Files Reference

**Frontend:**
- `src/App.tsx` - Main routing
- `src/pages/fri/auth/LoginPage.tsx` - Login UI
- `src/hooks/useFriAuth.tsx` - Auth hook (Azure Functions)
- `src/pages/dashboard/PageBuilder.tsx` - Page editor

**Backend:**
- `azure-functions/AuthLogin/index.ts` - Login endpoint
- `azure-functions/PagesGetPages/index.ts` - Get pages endpoint
- `azure-functions/host.json` - Functions config

**Database:**
- `supabase/migrations/azure-sql/004_*.sql` - Schema
- `supabase/migrations/azure-sql/006_*.sql` - Test data

## Notes

- **Supabase Removed:** No longer using Supabase auth, fully Azure-based
- **JWT Tokens:** Stored in localStorage, decoded on frontend
- **Database User:** Created for Azure Functions to query database
- **PWA Disabled:** Temporarily disabled to avoid caching issues
- **Mock Data:** usePages hook still has mock data for testing

## Issues & Known Limitations

1. **Password Hashing:** Currently checking plain-text password, should use bcrypt
2. **CORS:** May need CORS configuration on Azure Functions
3. **Token Expiry:** Set to 24 hours, no refresh token mechanism
4. **Error Handling:** Basic error messages, should improve
5. **Database Transactions:** No transaction support yet

## Environment Variables

**Frontend (.env):**
```
REACT_APP_API_BASE_URL=/api
```

**Azure Functions (local.settings.json / Portal Configuration):**
```
DB_USER=martin_lejio_user
DB_PASSWORD=TestPassword123!
DB_SERVER=lejio.database.windows.net
DB_NAME=lejio_fri
JWT_SECRET=your-secret-key
```

---

**Last Updated:** February 4, 2026
**Status:** Ready for Azure Functions deployment
**Next Session:** Deploy functions and complete remaining endpoints
