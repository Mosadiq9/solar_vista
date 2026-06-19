import { createTenantSupabaseClient, getTenantByHost } from '../tenant/tenant.server';
import { DB_TABLES } from '@/config/db-tables';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string | null;
  content: string;
  rating: number;
  systemSize: string | null;
  savingsEstimate: string | null;
  avatarUrl: string | null;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  location: string;
  capacity: string;
  savings: string;
  imageUrl: string | null;
  caseStudySlug: string | null;
}

/**
 * CMS Service - Fetches dynamic tenant-specific website content.
 * All queries are context-aware and isolated.
 */
export class CMSService {
  /**
   * Retrieves active tenant's FAQs.
   */
  static async getFAQs(): Promise<FAQItem[]> {
    const { tenant } = await getTenantByHost();
    if (!tenant) return [];

    const supabase = createTenantSupabaseClient();
    const { data, error } = await supabase
      .from(DB_TABLES.FAQS)
      .select('id, category, question, answer')
      .eq('tenant_id', tenant.id)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch FAQs:', error.message);
      return [];
    }

    return data || [];
  }

  /**
   * Retrieves active tenant's Testimonials.
   */
  static async getTestimonials(): Promise<TestimonialItem[]> {
    const { tenant } = await getTenantByHost();
    if (!tenant) return [];

    const supabase = createTenantSupabaseClient();
    const { data, error } = await supabase
      .from(DB_TABLES.TESTIMONIALS)
      .select(
        'id, client_name, client_role, content, rating, system_size, savings_estimate, avatar_url'
      )
      .eq('tenant_id', tenant.id)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch Testimonials:', error.message);
      return [];
    }

    return (data || []).map((t) => ({
      id: t.id,
      clientName: t.client_name,
      clientRole: t.client_role,
      content: t.content,
      rating: t.rating,
      systemSize: t.system_size,
      savingsEstimate: t.savings_estimate,
      avatarUrl: t.avatar_url,
    }));
  }

  /**
   * Retrieves active tenant's Showcase Projects.
   */
  static async getProjects(): Promise<ProjectItem[]> {
    const { tenant } = await getTenantByHost();
    if (!tenant) return [];

    const supabase = createTenantSupabaseClient();
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .select('id, title, category, location, capacity, savings, image_url, case_study_slug')
      .eq('tenant_id', tenant.id)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch Projects:', error.message);
      return [];
    }

    return (data || []).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      location: p.location,
      capacity: p.capacity,
      savings: p.savings,
      imageUrl: p.image_url,
      caseStudySlug: p.case_study_slug,
    }));
  }
}
