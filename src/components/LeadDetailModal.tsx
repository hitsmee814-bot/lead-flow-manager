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
  firstCall:any,
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
  onRefreshInteractions: () => void;
}

export const LeadDetailModal = ({
  lead,
  interactions,
  firstCall,
  onClose,
  onUpdate,
  onRefreshInteractions
}: LeadDetailModalProps) => {
  if (!lead) return null;

  return (
    <Dialog
      open={!!lead}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-w-[100rem] h-[90vh] p-0"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl">
            Lead Details - {lead.first_name} {lead.last_name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-12 gap-6 p-6 h-full overflow-hidden">
          {/* Left */}
          <div className="col-span-3 border-r pr-6 h-full flex flex-col min-h-0">
            <ScrollArea className="h-full">
              <LeadDetailPanel lead={lead} />
            </ScrollArea>
          </div>

          <div className="col-span-5 border-r pr-6 h-full flex flex-col min-h-0">
            <ScrollArea className="h-full">
              <LeadUpdateForm lead={lead} onRefreshInteractions={onRefreshInteractions}/>
            </ScrollArea>
          </div>

          <div className="col-span-4 h-full flex flex-col min-h-0">
            <ScrollArea className="h-full">
              <InteractionTimeline interactions={interactions} firstCall={firstCall}/>
            </ScrollArea>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};
