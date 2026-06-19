// ─────────────────────────────────────────────────────────────────────────────
// DATABASE TYPES — generated-style typed schema
// Replace this file with `npx supabase gen types typescript` output once live
// ─────────────────────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          tenant_id: string | null;
          name: string;
          phone: string;
          email: string;
          city: string;
          monthly_bill: string;
          message: string | null;
          status: 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
          source: 'website' | 'whatsapp' | 'referral' | 'social';
          utm_source: string | null;
          utm_campaign: string | null;
          assigned_to: string | null;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      faqs: {
        Row: {
          id: string;
          created_at: string;
          tenant_id: string;
          category: string;
          question: string;
          answer: string;
          sort_order: number;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          created_at: string;
          tenant_id: string;
          client_name: string;
          client_role: string | null;
          content: string;
          rating: 1 | 2 | 3 | 4 | 5;
          system_size: string | null;
          savings_estimate: string | null;
          avatar_url: string | null;
          featured: boolean;
          sort_order: number;
        };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          tenant_id: string;
          title: string;
          category: 'residential' | 'commercial' | 'industrial';
          location: string;
          capacity: string;
          savings: string;
          image_url: string | null;
          case_study_slug: string | null;
          featured: boolean;
          sort_order: number;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      crm_activities: {
        Row: {
          id: string;
          created_at: string;
          tenant_id: string;
          lead_id: string;
          activity_type: string;
          notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['crm_activities']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['crm_activities']['Insert']>;
      };
      tenant_users: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          tenant_id: string;
          role: string;
        };
        Insert: Omit<Database['public']['Tables']['tenant_users']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tenant_users']['Insert']>;
      };
      quote_requests: {
        Row: {
          id: string;
          created_at: string;
          lead_id: string | null;
          monthly_bill: number;
          property_type: 'home' | 'office' | 'factory';
          roof_area: string;
          system_size_kw: number;
          annual_savings: number;
          payback_period: number;
          co2_offset: number;
          status: 'draft' | 'sent' | 'accepted' | 'rejected';
        };
        Insert: Omit<Database['public']['Tables']['quote_requests']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['quote_requests']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          locale: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          author: string;
          category: string;
          tags: string[];
          published: boolean;
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          read_time_minutes: number;
        };
        Insert: Omit<
          Database['public']['Tables']['blog_posts']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
