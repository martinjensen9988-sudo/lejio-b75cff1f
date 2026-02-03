import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";

interface SignupRequest {
  company_name: string;
  email: string;
  subdomain: string;
}

interface TenantResponse {
  id: string;
  name: string;
  subdomain: string;
  domain: string;
  trial_end_date: string;
  message: string;
}

// Mock database - replace with SQL query in production
const tenants: Map<string, any> = new Map();

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.log('Tenant operations function triggered');

  // Handle different endpoints
  const path = req.url.split('?')[0];

  if (req.method === 'POST' && path.includes('/api/tenant/signup')) {
    handleSignup(context, req);
  } else if (req.method === 'GET' && path.includes('/api/tenant')) {
    handleGetTenant(context, req);
  } else {
    context.res = {
      status: 404,
      body: { error: 'Endpoint not found' },
    };
  }
};

async function handleSignup(context: Context, req: HttpRequest): Promise<void> {
  try {
    const { company_name, email, subdomain } = req.body as SignupRequest;

    // Validate input
    if (!company_name || !email || !subdomain) {
      context.res = {
        status: 400,
        body: { error: 'Missing required fields: company_name, email, subdomain' },
      };
      return;
    }

    // Validate subdomain format (alphanumeric, hyphens, 3-50 chars)
    if (!/^[a-z0-9-]{3,50}$/.test(subdomain)) {
      context.res = {
        status: 400,
        body: { error: 'Invalid subdomain format. Use 3-50 chars, lowercase letters, numbers, and hyphens.' },
      };
      return;
    }

    // Check if subdomain already exists
    const existingTenant = Array.from(tenants.values()).find(
      (t) => t.subdomain === subdomain
    );
    if (existingTenant) {
      context.res = {
        status: 409,
        body: { error: 'Subdomain already taken' },
      };
      return;
    }

    // Create new tenant
    const tenantId = `tenant-${uuidv4()}`;
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const tenant = {
      id: tenantId,
      name: company_name,
      slug: subdomain,
      subdomain,
      domain: `${subdomain}.lejio-fri.dk`,
      plan: 'trial',
      status: 'active',
      owner_email: email,
      primary_color: '#3b82f6',
      trial_start_date: new Date(),
      trial_end_date: trialEndDate,
      created_at: new Date(),
      updated_at: new Date(),
    };

    tenants.set(tenantId, tenant);

    context.log(`Tenant created: ${tenantId} (${company_name})`);

    const response: TenantResponse = {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      domain: tenant.domain,
      trial_end_date: tenant.trial_end_date.toISOString(),
      message: `Welcome ${company_name}! Your trial account is ready.`,
    };

    context.res = {
      status: 201,
      body: response,
    };
  } catch (error) {
    context.log.error('Signup error:', error);
    context.res = {
      status: 500,
      body: { error: 'Failed to create tenant' },
    };
  }
}

async function handleGetTenant(context: Context, req: HttpRequest): Promise<void> {
  try {
    const subdomain = req.query.subdomain;

    if (!subdomain) {
      context.res = {
        status: 400,
        body: { error: 'Missing subdomain parameter' },
      };
      return;
    }

    // Find tenant by subdomain
    const tenant = Array.from(tenants.values()).find(
      (t) => t.subdomain === subdomain
    );

    if (!tenant) {
      context.res = {
        status: 404,
        body: { error: 'Tenant not found' },
      };
      return;
    }

    context.res = {
      status: 200,
      body: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        subdomain: tenant.subdomain,
        domain: tenant.domain,
        plan: tenant.plan,
        status: tenant.status,
        owner_email: tenant.owner_email,
        primary_color: tenant.primary_color,
        logo_url: tenant.logo_url,
        trial_end_date: tenant.trial_end_date.toISOString(),
      },
    };
  } catch (error) {
    context.log.error('Get tenant error:', error);
    context.res = {
      status: 500,
      body: { error: 'Failed to fetch tenant' },
    };
  }
}

export default httpTrigger;
