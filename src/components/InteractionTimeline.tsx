import { Interaction } from "@/types/lead";
import { Clock, User, ArrowRight } from "lucide-react";

interface InteractionTimelineProps {
  interactions: Interaction[];
}

export const InteractionTimeline = ({ interactions }: InteractionTimelineProps) => {
  if (interactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No interactions recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Interaction History</h3>
      
      <div className="relative space-y-6">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
        
        {interactions.map((interaction, index) => (
          <div key={interaction.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-2.5 top-2 h-3 w-3 rounded-full bg-primary border-2 border-background" />
            
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{interaction.timestamp}</span>
                  {interaction.duration && (
                    <span className="text-xs">({interaction.duration})</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">{interaction.summary}</h4>
                <p className="text-sm text-muted-foreground">{interaction.details}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{interaction.who_interacted}</span>
              </div>
              
              {interaction.next_action && (
                <div className="flex items-start gap-2 pt-2 border-t">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Next Action</p>
                    <p className="text-sm font-medium">{interaction.next_action}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
