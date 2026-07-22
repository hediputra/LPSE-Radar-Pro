import { Request, Response, NextFunction } from 'express';
import { MOCK_TENANTS, Tenant } from '../../src/data/mockTenants.js';

/**
 * Interface representing the Tenant Context injected into Express HTTP Requests
 */
export interface TenantContext {
  tenantId: string;
  tenant: Tenant;
  subdomain: string;
  tier: string;
  isolationMode: 'STRICT_HEADER' | 'SUBDOMAIN' | 'QUERY_PARAM' | 'DEFAULT_FALLBACK';
  
  /**
   * Helper function to inject database query context / filter records strictly by tenant_id
   */
  queryFilter: {
    tenant_id: string;
  };

  /**
   * Utility to filter an array of database records enforcing row-level security (RLS)
   */
  applyTenantFilter: <T extends Record<string, any>>(records: T[], tenantKey?: string) => T[];
}

// Extend Express Request interface to include tenantContext
declare global {
  namespace Express {
    interface Request {
      tenantContext?: TenantContext;
    }
  }
}

/**
 * Express Middleware: Tenant Identification & Database Query Isolation Middleware
 * Detects tenant_id from HTTP Request Headers, Subdomains, or Query Parameters
 * and injects a tenant database isolation context into the request object.
 */
export const tenantIsolationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let resolvedTenantId: string | null = null;
  let resolvedSubdomain: string | null = null;
  let isolationMode: TenantContext['isolationMode'] = 'DEFAULT_FALLBACK';

  // 1. Check HTTP Header 'x-tenant-id' or 'X-Tenant-ID'
  const headerTenantId = req.headers['x-tenant-id'] || req.headers['x-tenant-subdomain'];
  if (headerTenantId && typeof headerTenantId === 'string' && headerTenantId.trim() !== '') {
    resolvedTenantId = headerTenantId.trim();
    isolationMode = 'STRICT_HEADER';
  }

  // 2. Check Host / Subdomain (e.g. wika.ptfas.co.id -> subdomain 'wika')
  if (!resolvedTenantId) {
    const host = req.headers.host || req.hostname || '';
    const hostParts = host.split('.');
    
    // Check if host has a subdomain (excluding www or localhost root)
    if (hostParts.length >= 3 && hostParts[0] !== 'www' && hostParts[0] !== 'localhost') {
      resolvedSubdomain = hostParts[0].toLowerCase();
      isolationMode = 'SUBDOMAIN';
    } else if (host.includes('-')) {
      // Handles test subdomains like wika-tenant.localhost
      const potentialSubdomain = host.split('-')[0].toLowerCase();
      const match = MOCK_TENANTS.find((t) => t.branding.subdomain === potentialSubdomain);
      if (match) {
        resolvedTenantId = match.id;
        isolationMode = 'SUBDOMAIN';
      }
    }
  }

  // 3. Check Query Parameter 'tenant_id' or 'subdomain' as fallback (useful for API testing & webhooks)
  if (!resolvedTenantId && !resolvedSubdomain) {
    const queryTenantId = req.query.tenant_id as string;
    const querySubdomain = req.query.subdomain as string;

    if (queryTenantId) {
      resolvedTenantId = queryTenantId;
      isolationMode = 'QUERY_PARAM';
    } else if (querySubdomain) {
      resolvedSubdomain = querySubdomain;
      isolationMode = 'QUERY_PARAM';
    }
  }

  // 4. Resolve Tenant from MOCK_TENANTS database registry
  let tenant: Tenant | undefined;

  if (resolvedTenantId) {
    tenant = MOCK_TENANTS.find(
      (t) => t.id.toLowerCase() === resolvedTenantId?.toLowerCase() ||
             t.branding.subdomain.toLowerCase() === resolvedTenantId?.toLowerCase()
    );
  } else if (resolvedSubdomain) {
    tenant = MOCK_TENANTS.find(
      (t) => t.branding.subdomain.toLowerCase() === resolvedSubdomain?.toLowerCase()
    );
  }

  // 5. Fallback to Default Primary Tenant if not matched
  if (!tenant) {
    tenant = MOCK_TENANTS[0]; // Default: PT Wijaya Karya (Persero) Tbk
    isolationMode = 'DEFAULT_FALLBACK';
  }

  // 6. Build the Tenant Database Query Isolation Context
  const tenantContext: TenantContext = {
    tenantId: tenant.id,
    tenant,
    subdomain: tenant.branding.subdomain,
    tier: tenant.tier,
    isolationMode,
    queryFilter: {
      tenant_id: tenant.id,
    },
    applyTenantFilter: <T extends Record<string, any>>(records: T[], tenantKey: string = 'tenantId'): T[] => {
      // Strict Row-Level Security (RLS) simulation: filters records where tenant_id or tenantId matches
      return records.filter((item) => {
        const itemTenantId = item[tenantKey] || item['tenant_id'] || item['tenantId'];
        // If record has no tenant binding (global public data like public LPSE tenders), keep it accessible
        if (!itemTenantId) return true;
        return String(itemTenantId).toLowerCase() === tenant!.id.toLowerCase();
      });
    }
  };

  // Attach to Express Request
  req.tenantContext = tenantContext;

  // 7. Inject Security Audit Headers into HTTP Response
  res.setHeader('X-Tenant-Resolved-Id', tenant.id);
  res.setHeader('X-Tenant-Subdomain', tenant.branding.subdomain);
  res.setHeader('X-Tenant-Tier', tenant.tier);
  res.setHeader('X-Tenant-Isolation-Mode', isolationMode);

  // Optional: Enforce Strict Mode if header 'x-strict-tenant-check: true' and tenant was not found
  const strictMode = req.headers['x-strict-tenant-check'] === 'true';
  if (strictMode && !resolvedTenantId && !resolvedSubdomain) {
    return res.status(403).json({
      error: 'TENANT_ISOLATION_FAILURE',
      message: 'Strict tenant isolation enforced: missing or invalid x-tenant-id header or subdomain',
      requiredHeader: 'x-tenant-id'
    });
  }

  next();
};

/**
 * Utility function to extract tenant query isolation context from any Express request
 */
export function getTenantIsolationContext(req: Request): TenantContext {
  if (!req.tenantContext) {
    throw new Error('TenantIsolationMiddleware has not been initialized on this request route.');
  }
  return req.tenantContext;
}
