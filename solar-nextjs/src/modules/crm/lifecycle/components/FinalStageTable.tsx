'use client';

import { useEffect, useState } from 'react';
import { ProjectStage } from '../types';
import { useLifecycleStore } from '../store/useLifecycleStore';
import { CheckCircle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/modules/admin/shared/components/ui/EmptyState';

export function FinalStageTable() {
  const { stages, isLoading, fetchStages, updateStageStatus, toggleChecklist } = useLifecycleStore();
  const [localChecklists, setLocalChecklists] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    fetchStages('final_stage');
  }, [fetchStages]);

  const currentStages = stages['final_stage'] || [];

  const handleToggle = (customerId: string, field: string) => {
    setLocalChecklists(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: !prev[customerId]?.[field]
      }
    }));
    toggleChecklist(customerId, field as any);
  };

  const isAllChecked = (customerId: string) => {
    const checks = localChecklists[customerId] || {};
    return checks.is_approved && checks.is_fill_dp && checks.is_inspection && checks.is_solder && checks.is_submission;
  };

  if (isLoading) return <div className="h-48 animate-pulse rounded-xl bg-white/[0.02]" />;

  if (currentStages.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-brand-surface p-8">
        <EmptyState icon={Flag} title="No projects in final stage" description="Projects ready for final inspection and handover will appear here." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {currentStages.map((stage) => {
        const allChecked = isAllChecked(stage.customer_id);
        const isCompleted = stage.status === 'completed';

        return (
          <div key={stage.id} className="rounded-xl border border-white/[0.06] bg-brand-surface p-5 shadow-card">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
              <div>
                <h3 className="font-semibold text-white/90 text-lg">{stage.customer_name}</h3>
                <p className="text-sm text-white/50">{stage.city} &bull; {stage.system_kw} KW System</p>
              </div>
              <button
                disabled={!allChecked || isCompleted}
                onClick={() => updateStageStatus(stage.id, 'final_stage', 'completed')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all',
                  isCompleted 
                    ? 'bg-green-500/10 text-green-400' 
                    : allChecked 
                      ? 'bg-brand-primary text-brand-bg shadow-glow hover:bg-brand-primary/90' 
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                )}
              >
                <CheckCircle className="h-4 w-4" />
                {isCompleted ? 'Handover Complete' : 'Complete Handover'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { key: 'is_approved', label: 'Approved' },
                { key: 'is_fill_dp', label: 'DP Filled' },
                { key: 'is_solder', label: 'Soldering' },
                { key: 'is_inspection', label: 'Inspection' },
                { key: 'is_submission', label: 'Submission' }
              ].map((item) => {
                const checked = localChecklists[stage.customer_id]?.[item.key] || false;
                return (
                  <button
                    key={item.key}
                    onClick={() => !isCompleted && handleToggle(stage.customer_id, item.key)}
                    disabled={isCompleted}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-xl border transition-all',
                      checked 
                        ? 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary' 
                        : 'border-white/[0.06] bg-white/[0.02] text-white/50 hover:bg-white/[0.04]',
                      isCompleted && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full mb-2',
                      checked ? 'bg-brand-primary text-brand-bg' : 'bg-white/10 text-transparent'
                    )}>
                      {checked && <CheckCircle className="h-4 w-4" />}
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
