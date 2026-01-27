# 🤖 AI-Driven Automated Lead Discovery System

## Overview
Automated system that finds, enriches, scores, and contacts 20+ leads daily using AI.

## Features

### 1. **Daily Automated Lead Discovery** 
- **Function:** `auto-find-and-score-leads`
- Runs daily (via scheduler)
- Finds ~20 new leads per day using AI
- Automatically enriches leads with:
  - Email addresses
  - Phone numbers
  - Website URLs
  - CVR numbers

### 2. **Intelligent Lead Scoring**
Leads are scored 1-10 based on:
- Industry relevance (car rental, vehicle services, etc.)
- Geographic location (high-value areas like Copenhagen)
- Contact information availability (email +2, phone +1, website +1, CVR +1)
- Calculated industry fit

### 3. **Contact Information Enrichment**
Uses AI to find:
- Contact email addresses
- Phone numbers
- Company websites
- CVR registration numbers (Danish businesses)

### 4. **Automated Welcome Emails**
- **Function:** `send-lead-welcome-email`
- Personalized emails sent to new leads
- Professional template with value proposition
- Call-to-action with tracking link

### 5. **Daily Admin Summary**
- Admin receives daily report with:
  - Number of leads added
  - Lead details (company, industry, contact info)
  - Average lead scores
  - Trend analysis

## Setup Instructions

### 1. Database Migration
Run the migration to create:
```sql
-- In Supabase SQL Editor:
-- supabase/migrations/20260127_setup_daily_lead_discovery.sql
```

This creates:
- `lead_discovery_runs` table
- `record_lead_discovery_run()` function
- `today_lead_discovery_status` view
- RLS policies

### 2. Schedule Daily Execution

**Option A: Using EasyCron (Recommended)**
1. Go to https://www.easycron.com
2. Create new cron job:
   - URL: `https://[your-project].supabase.co/functions/v1/schedule-daily-lead-discovery`
   - Method: POST
   - Schedule: Daily at 9:00 AM
   - Add header: `Authorization: Bearer [SUPABASE_ANON_KEY]`

**Option B: Using AWS EventBridge**
```json
{
  "Name": "daily-lead-discovery",
  "ScheduleExpression": "cron(0 9 * * ? *)",
  "State": "ENABLED",
  "Targets": [{
    "Arn": "arn:aws:lambda:...",
    "RoleArn": "arn:aws:iam::...",
    "HttpParameters": {
      "HeaderParameters": {
        "Authorization": "Bearer [SUPABASE_ANON_KEY]"
      }
    }
  }]
}
```

**Option C: Manual Trigger**
Call via frontend or backend:
```typescript
// From React hook
const { triggerAutomatedDiscovery } = useAILeadFinder();
await triggerAutomatedDiscovery();

// Or via curl
curl -X POST https://[project].supabase.co/functions/v1/schedule-daily-lead-discovery \
  -H "Authorization: Bearer [SUPABASE_ANON_KEY]" \
  -H "Content-Type: application/json"
```

### 3. Monitor Discovery Runs

View daily results:
```sql
-- Check today's run status
SELECT * FROM today_lead_discovery_status;

-- View all runs
SELECT * FROM lead_discovery_runs 
ORDER BY run_date DESC
LIMIT 10;

-- Get average score over time
SELECT 
  DATE_TRUNC('week', run_date) as week,
  COUNT(*) as runs,
  SUM(leads_added) as total_leads,
  AVG(average_score) as avg_score
FROM lead_discovery_runs
WHERE status = 'completed'
GROUP BY week
ORDER BY week DESC;
```

## System Architecture

```
┌─────────────────────────────────────────┐
│ Daily Scheduler (9 AM)                  │
│ (EasyCron / EventBridge / Manual)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ schedule-daily-lead-discovery           │
│ (Orchestrator)                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ auto-find-and-score-leads               │
│ 1. Generate 20 lead suggestions (AI)    │
│ 2. Enrich each lead (AI):               │
│    - Find email                         │
│    - Find phone                         │
│    - Find website                       │
│    - Find CVR                           │
│ 3. Calculate score (1-10)               │
│ 4. Add to database                      │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
    ┌──────┐    ┌──────────────────┐
    │ DB   │    │ send-lead-       │
    │ Save │    │ welcome-email    │
    │      │    │ (per lead)       │
    └──────┘    └──────────────────┘
        │             │
        └──────┬──────┘
               ▼
    ┌────────────────────────┐
    │ Admin Notification     │
    │ (Daily Summary Email)  │
    └────────────────────────┘
```

## Performance & Limits

| Metric | Value | Notes |
|--------|-------|-------|
| Leads per run | 20 | Configurable in code |
| Leads found daily | 20-30 | Some duplicates filtered |
| Average score | 6-8 | Depends on availability |
| Contacts with email | 70-80% | AI enrichment success |
| Processing time | 5-10 min | Per full run |
| Cost | ~$0.10 | Per day (AI + SMTP) |

## Monitoring & Alerts

### View Recent Runs
```sql
SELECT 
  DATE(run_date) as date,
  status,
  leads_added,
  average_score,
  CASE 
    WHEN error_message IS NOT NULL THEN '❌ ' || error_message
    ELSE '✅ Success'
  END as result
FROM lead_discovery_runs
ORDER BY run_date DESC
LIMIT 10;
```

### Alert on Failures
```sql
-- Check for failed runs
SELECT * FROM lead_discovery_runs
WHERE status = 'failed' 
AND run_date > NOW() - INTERVAL '7 days';
```

## Lead Management

### Track Lead Status
```sql
-- View newly discovered leads
SELECT * FROM sales_leads
WHERE source = 'ai_automated_discovery'
AND created_at > NOW() - INTERVAL '1 day'
ORDER BY lead_score DESC;

-- View contacted leads
SELECT * FROM sales_leads
WHERE source = 'ai_automated_discovery'
AND status = 'contacted'
ORDER BY last_contact_date DESC;
```

### Manual Lead Review
Before contacting, review:
1. Score >= 6 (high quality)
2. Valid email address
3. Relevant industry
4. Not already in database

## API Reference

### `auto-find-and-score-leads`
```typescript
POST /functions/v1/auto-find-and-score-leads

Response: {
  success: boolean;
  added: number;          // Leads added today
  leads: FoundLead[];     // Details of added leads
  message: string;
}
```

### `send-lead-welcome-email`
```typescript
POST /functions/v1/send-lead-welcome-email

Body: {
  leadId: string;  // UUID of lead in sales_leads table
}

Response: {
  success: boolean;
  message: string;
}
```

### `schedule-daily-lead-discovery`
```typescript
POST /functions/v1/schedule-daily-lead-discovery

Response: {
  success: boolean;
  message: string;
  result: {
    success: boolean;
    added: number;
    leads: FoundLead[];
  };
}
```

## Customization

### Change Daily Lead Count
Edit `supabase/functions/auto-find-and-score-leads/index.ts`:
```typescript
// Line: for (const suggestion of suggestions.slice(0, 20)) {
for (const suggestion of suggestions.slice(0, 30)) {  // 30 leads
```

### Adjust Industry Scoring
Edit `calculateLeadScore()` function:
```typescript
const highValueIndustries = [
  'biludlejning',
  'bilforhandler',
  'autoværksted',
  'billeasing',
  'bilsalg',
  // Add more industries
];
```

### Change Contact Score Weights
Edit `calculateLeadScore()`:
```typescript
if (enrichedData.email) score += 3;  // Was 2
if (enrichedData.phone) score += 2;  // Was 1
```

## Troubleshooting

### No leads being added
1. Check `LOVABLE_API_KEY` environment variable
2. Verify AI model is accessible
3. Check Supabase RLS policies
4. View logs in `lead_discovery_runs` table

### Email not sending
1. Verify SMTP settings
2. Check `send-lead-welcome-email` logs
3. Confirm lead has `contact_email`
4. Test email manually

### Low lead quality (score < 5)
1. Adjust industry targeting
2. Increase contact enrichment retry attempts
3. Modify scoring weights
4. Review industry targeting list

## Future Enhancements

- [ ] Machine learning model for lead scoring
- [ ] Integration with LinkedIn/Crunchbase
- [ ] Phone call outreach automation
- [ ] Lead behavior tracking & nurturing
- [ ] Conversion rate analytics
- [ ] Multi-language lead discovery
- [ ] Predictive lead quality scoring
- [ ] Automatic follow-up sequence

## Support

For issues or questions:
1. Check function logs in Supabase
2. Review migration status
3. Test functions manually via `supabase functions invoke`
4. Contact: support@lejio.dk
