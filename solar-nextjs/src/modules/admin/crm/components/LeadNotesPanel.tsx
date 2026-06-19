'use client';

import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import type { AdminLead } from '@/modules/admin/types';

interface LeadNotesPanelProps {
  lead: AdminLead;
  onAddNote: (leadId: string, content: string, authorName: string) => void;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function LeadNotesPanel({ lead, onAddNote }: LeadNotesPanelProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 200));
    onAddNote(lead.id, content.trim(), 'Admin');
    setContent('');
    setSubmitting(false);
  };

  return (
    <AdminCard padding="none">
      <div className="flex items-center gap-2 border-b border-white/[0.06] p-4">
        <MessageSquare className="h-4 w-4 text-brand-primary" />
        <h3 className="font-display text-sm font-semibold text-white">Notes</h3>
        <span className="ml-auto text-xs text-white/30">{lead.notes.length}</span>
      </div>

      {/* Notes list */}
      <div className="max-h-64 divide-y divide-white/[0.04] overflow-y-auto">
        {lead.notes.length === 0 ? (
          <p className="px-4 py-5 text-center text-xs text-white/25">No notes yet</p>
        ) : (
          lead.notes.map((note) => (
            <div key={note.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-white/60">{note.authorName}</span>
                <span className="text-2xs text-white/25">{timeAgo(note.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-white/70">{note.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="border-t border-white/[0.06] p-3">
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-xs text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-primary/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as never);
            }}
          />
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="flex h-8 w-8 items-center justify-center self-end rounded-lg bg-brand-primary/15 text-brand-primary transition-colors hover:bg-brand-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1 text-2xs text-white/20">⌘Enter to submit</p>
      </form>
    </AdminCard>
  );
}
