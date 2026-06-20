'use client';

import { useEffect, useState } from 'react';
import type { AdminRole } from '@/modules/admin/types';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import { useAuthStore } from '@/modules/crm/auth/store/useAuthStore';
// import { useTenant } from '@/providers/TenantProvider';

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string; name: string; role: AdminRole } | null;
  signOut: () => void;
}

export function useAdminAuth(): AdminAuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminAuthState['user']>(null);
  // Removed tenant hook since we are single-tenant
  // const { tenant } = useTenant();

  useEffect(() => {
    console.log('[useAdminAuth] Initializing hook.');

    let supabase;
    try {
      supabase = createClient();
    } catch (err) {
      console.error('[useAdminAuth] Critical error creating Supabase client:', err);
      setIsLoading(false);
      setUser(null);
      return;
    }

    const fetchUserRole = async (userId: string, email: string, name: string) => {
      console.log('[useAdminAuth] Fetching user role for:', email, 'ID:', userId);
      try {
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', userId)
          .single();

        if (error || !adminUser) {
          console.error('[useAdminAuth] User not associated with admin_users or error:', error?.message);
          setUser(null);
        } else {
          console.log('[useAdminAuth] User role fetched successfully:', adminUser.role);
          const finalRole = (adminUser.role as AdminRole) || 'super_admin'; // Fallback for null roles
          
          const userData = {
            id: userId,
            email: email,
            name: name, // Ensure UserProfile shape matches AdminRole
            full_name: name,
            role: finalRole,
          };
          
          setUser(userData);
          useAuthStore.getState().setUser(userData);
        }
      } catch (err) {
        console.error('[useAdminAuth] Exception in fetchUserRole:', err);
        setUser(null);
      } finally {
        console.log('[useAdminAuth] fetchUserRole complete. Setting isLoading to false.');
        setIsLoading(false);
      }
    };

    const checkSession = async () => {
      try {
        console.log('[DEBUG] Calling getSession(). URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        const sessionResult = await supabase.auth.getSession();
        console.log('[DEBUG] getSession() returned!', sessionResult);
        
        const session = sessionResult?.data?.session;
        if (session?.user) {
          console.log('[DEBUG] Session found, calling fetchUserRole...');
          await fetchUserRole(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name || 'Admin User'
          );
          console.log('[DEBUG] fetchUserRole completed.');
        } else {
          console.log('[DEBUG] No session found, setting user to null.');
          setUser(null);
          useAuthStore.getState().setUser(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[DEBUG] checkSession threw an error:', err);
        setUser(null);
        useAuthStore.getState().setUser(null);
        setIsLoading(false);
      }
    };

    checkSession();

    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(
          '[useAdminAuth] Auth state changed event:',
          event,
          'session user:',
          session?.user?.email
        );
        try {
          if (session?.user) {
            await fetchUserRole(
              session.user.id,
              session.user.email || '',
              session.user.user_metadata?.name || 'Admin User'
            );
          } else {
            setUser(null);
            useAuthStore.getState().setUser(null);
            setIsLoading(false);
          }
        } catch (err) {
          console.error('[useAdminAuth] Exception in onAuthStateChange handler:', err);
          setUser(null);
          useAuthStore.getState().setUser(null);
          setIsLoading(false);
        }
      });
      subscription = data.subscription;
    } catch (err) {
      console.error('[useAdminAuth] Exception setting up onAuthStateChange listener:', err);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    useAuthStore.getState().setUser(null);
    setIsLoading(false);
    window.location.href = '/admin/login';
  };

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
    signOut,
  };
}

export function hasPermission(role: AdminRole | undefined, required: AdminRole[]): boolean {
  if (!role) return false;
  const hierarchy: Record<AdminRole, number> = {
    super_admin: 4,
    admin: 3,
    editor: 2,
    support: 1,
  };
  return required.some((r) => hierarchy[role] >= hierarchy[r]);
}
