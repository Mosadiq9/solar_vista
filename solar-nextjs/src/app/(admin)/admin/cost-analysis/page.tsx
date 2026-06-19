'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { CostAnalysisTable } from '@/modules/crm/finance/components/CostAnalysisTable';
import { useFinanceStore } from '@/modules/crm/finance/store/useFinanceStore';

export default function CostAnalysisPage() {
  const { fetchCostAnalysis } = useFinanceStore();

  useEffect(() => {
    fetchCostAnalysis();
  }, [fetchCostAnalysis]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Cost Analysis & Profitability" 
        description="Review material, labor, and miscellaneous costs vs total revenue for each project" 
      />
      <CostAnalysisTable />
    </div>
  );
}
