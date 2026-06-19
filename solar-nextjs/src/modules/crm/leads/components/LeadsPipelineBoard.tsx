'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Lead, LeadStatus } from '../types';
import { useLeadsStore } from '../store/useLeadsStore';
import { cn } from '@/lib/utils';
import { Phone, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: 'new', title: 'New Leads', color: 'border-blue-500/20 bg-blue-500/5' },
  { id: 'contacted', title: 'Contacted', color: 'border-yellow-500/20 bg-yellow-500/5' },
  { id: 'qualified', title: 'Qualified', color: 'border-brand-primary/20 bg-brand-primary/5' },
  { id: 'proposal', title: 'Proposal Sent', color: 'border-purple-500/20 bg-purple-500/5' },
  { id: 'closed', title: 'Closed Won', color: 'border-green-500/20 bg-green-500/5' },
];

export function LeadsPipelineBoard() {
  const { leads, updateLeadStatus } = useLeadsStore();
  const [boardData, setBoardData] = useState<Record<LeadStatus, Lead[]>>({
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    closed: [],
    lost: [],
  });

  // Hydrate columns on load or leads update
  useEffect(() => {
    const newBoard: Record<LeadStatus, Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      proposal: [],
      closed: [],
      lost: [],
    };
    leads.forEach((lead) => {
      if (newBoard[lead.status]) {
        newBoard[lead.status].push(lead);
      }
    });
    setBoardData(newBoard);
  }, [leads]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = source.droppableId as LeadStatus;
    const destCol = destination.droppableId as LeadStatus;

    // Optimistic UI update
    const sourceItems = Array.from(boardData[sourceCol]);
    const destItems = sourceCol === destCol ? sourceItems : Array.from(boardData[destCol]);
    const [movedItem] = sourceItems.splice(source.index, 1);
    
    // Update the item's status locally
    movedItem.status = destCol;
    destItems.splice(destination.index, 0, movedItem);

    setBoardData({
      ...boardData,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    });

    // Fire the async update
    if (sourceCol !== destCol) {
      try {
        await updateLeadStatus(draggableId, destCol);
      } catch (error) {
        // Handle error implicitly by Zustand or we could revert the state here
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] gap-4 overflow-x-auto pb-4 scrollbar-thin">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex min-w-[320px] flex-col rounded-xl border border-white/[0.06] bg-brand-surface shadow-card">
            {/* Column Header */}
            <div className={cn('flex items-center justify-between border-b px-4 py-3', col.color)}>
              <h3 className="font-semibold text-white/90">{col.title}</h3>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/70">
                {boardData[col.id].length}
              </span>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'flex-1 overflow-y-auto p-3 transition-colors',
                    snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''
                  )}
                >
                  {boardData[col.id].map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            'mb-3 rounded-lg border border-white/[0.06] bg-brand-surface-2 p-3 shadow-sm transition-all',
                            snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl border-brand-primary/50 ring-1 ring-brand-primary/20' : 'hover:border-white/20'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-white/90">{lead.name}</h4>
                            {lead.system_kw && (
                              <span className="rounded bg-white/5 px-1.5 py-0.5 text-2xs font-semibold text-white/70 border border-white/10">
                                {lead.system_kw} KW
                              </span>
                            )}
                          </div>
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                            {lead.city && (
                              <div className="flex items-center gap-2 text-xs text-white/50">
                                <User className="h-3 w-3" />
                                <span>{lead.city}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-white/40 pt-2 mt-2 border-t border-white/[0.06]">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(lead.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
