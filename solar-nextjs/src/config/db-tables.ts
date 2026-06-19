/**
 * Centralized Database Table name constants.
 * Use these constants throughout the application queries to avoid hardcoded string values.
 * If a table name changes in Supabase, updating it here updates it across the entire codebase.
 */
export const DB_TABLES = {
  TENANTS: 'tenants',
  TENANT_SETTINGS: 'tenant_settings',
  TENANT_USERS: 'tenant_users',
  TENANT_DOMAINS: 'tenant_domains',

  LEADS: 'leads',
  QUOTE_REQUESTS: 'quote_requests',
  SAVED_CALCULATIONS: 'saved_calculations',

  FAQS: 'faqs',
  TESTIMONIALS: 'testimonials',
  PROJECTS: 'projects',
  BLOGS: 'blogs',

  CHATBOT_CONVERSATIONS: 'chatbot_conversations',
  CHATBOT_KNOWLEDGE: 'chatbot_knowledge',

  CRM_ACTIVITIES: 'crm_activities',
  SUBSCRIPTIONS: 'subscriptions',
} as const;

export type DbTableName = (typeof DB_TABLES)[keyof typeof DB_TABLES];
