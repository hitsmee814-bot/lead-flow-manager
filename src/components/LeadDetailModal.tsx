import { useState } from "react";
import { Lead, Interaction } from "@/types/lead";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadDetailPanel } from "./LeadDetailPanel";
import { LeadUpdateForm } from "./LeadUpdateForm";
import { InteractionTimeline } from "./InteractionTimeline";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeadDetailModalProps {
  lead: Lead | null;
  interactions: Interaction[];
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

export const LeadDetailModal = ({
  lead,
  interactions,
  onClose,
  onUpdate,
}: LeadDetailModalProps) => {
  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl">
            Lead Details - {lead.first_name} {lead.last_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-12 gap-6 p-6 overflow-hidden h-full">
          {/* Left Panel - Lead Details */}
          <div className="col-span-3 border-r pr-6">
            <ScrollArea className="h-full">
              <LeadDetailPanel lead={lead} />
            </ScrollArea>
          </div>

          {/* Middle Panel - Update Form */}
          <div className="col-span-5 border-r pr-6">
            <ScrollArea className="h-full">
              <LeadUpdateForm lead={lead} onUpdate={onUpdate} />
            </ScrollArea>
          </div>

          {/* Right Panel - Interaction History */}
          <div className="col-span-4">
            <ScrollArea className="h-full">
              <InteractionTimeline interactions={interactions} />
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
