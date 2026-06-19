// ─────────────────────────────────────────────────────────────────────────────
// COMMON SHARED TYPES
// ─────────────────────────────────────────────────────────────────────────────

// Supported Locale codes
export type Locale = 'en' | 'hi' | 'gu';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'hi', 'gu'];
export const DEFAULT_LOCALE: Locale = 'en';

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Generic select option
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
}

// Image type
export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

// Animation variant type
export type AnimationVariant = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn';

// Theme modes
export type ThemeMode = 'dark' | 'light';

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
  city?: string;
  rooftopArea?: number;
  electricityBill?: number;
  preferredLanguage?: Locale;
}

// Lead data
export interface Lead extends ContactFormData {
  id: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  source: 'website' | 'whatsapp' | 'referral' | 'social' | 'direct';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
}

// Solar quote request
export interface QuoteRequest {
  rooftopArea: number;
  monthlyBill: number;
  location: string;
  connectionType: 'residential' | 'commercial' | 'industrial';
  preferredCapacity?: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

// Solar quote response
export interface QuoteResponse {
  systemCapacity: number;
  estimatedGeneration: number;
  totalCost: number;
  subsidyAmount: number;
  netCost: number;
  paybackPeriod: number;
  yearlyRevenue: number;
  co2Savings: number;
  roiPercentage: number;
}

// Component props base types
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

export interface WithChildrenProps extends BaseComponentProps {
  children: React.ReactNode;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
