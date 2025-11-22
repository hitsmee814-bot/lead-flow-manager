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
import { Badge } from "@/components/Badge";

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
      <DialogContent
        className="max-w-7xl h-[90vh] p-0 flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="default">Lead Details – {lead.first_name} {lead.last_name}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 p-6 flex-1 overflow-hidden">
          <div className="col-span-3 border-r pr-6 overflow-hidden">
            <ScrollArea className="h-full">
              <LeadDetailPanel lead={lead} />
            </ScrollArea>
          </div>

          <div className="col-span-5 border-r pr-6 overflow-hidden">
            <ScrollArea className="h-full">
              <LeadUpdateForm lead={lead} onUpdate={onUpdate} />
            </ScrollArea>
          </div>

          <div className="col-span-4 overflow-hidden">
            <ScrollArea className="h-full">
              <InteractionTimeline interactions={interactions} />
            </ScrollArea>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};
