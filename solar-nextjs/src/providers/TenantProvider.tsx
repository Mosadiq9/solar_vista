'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Tenant, TenantSettings, TenantContextType } from '@/types/tenant';

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  settings: null,
  isLoading: true,
  error: null,
});

export function TenantProvider({
  children,
  tenant,
  settings,
}: {
  children: React.ReactNode;
  tenant: Tenant | null;
  settings: TenantSettings | null;
}) {
  const value = useMemo(
    () => ({
      tenant,
      settings,
      isLoading: false,
      error: null,
    }),
    [tenant, settings]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
