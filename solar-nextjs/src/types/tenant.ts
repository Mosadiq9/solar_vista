export type TenantStatus = 'active' | 'suspended' | 'trial' | 'churned';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain: string | null;
  status: TenantStatus;
}

export interface TenantSettings {
  tenantId: string;
  companyName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  seoTitle: string | null;
  seoDescription: string | null;
  features: {
    chatbot: boolean;
    calculator: boolean;
    multilingual: boolean;
    [key: string]: boolean;
  };
}

export interface TenantContextType {
  tenant: Tenant | null;
  settings: TenantSettings | null;
  isLoading: boolean;
  error: Error | null;
}
