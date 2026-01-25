import { Clock, User, Info, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface InteractionTimelineProps {
  interactions: any[];
  firstCall: any
}

export const InteractionTimeline = ({ interactions, firstCall }: InteractionTimelineProps) => {
  console.log("🔥 RECEIVED INTERACTIONS →", interactions);
  const hasFirstCall = Boolean(firstCall && firstCall.summary);
  const list =
    Array.isArray(interactions) && interactions.length > 0 ? interactions : [];

  const toLocal = (gmtString: string) => {
    if (!gmtString) return "N/A";
    const d = new Date(gmtString);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };



  return (
    <div className="space-y-5">
      <div
        className={`rounded-xl border p-4 ${hasFirstCall
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
          : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
          }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles
            className={`h-4 w-4 ${hasFirstCall ? "text-indigo-500" : "text-red-500"
              }`}
          />
          <h3
            className={`text-sm font-semibold ${hasFirstCall ? "text-indigo-700" : "text-red-700"
              }`}
          >
            AI Summary
          </h3>
        </div>

        <p
          className={`text-xs leading-relaxed ${hasFirstCall ? "text-indigo-900" : "text-red-900"
            }`}
        >
          {hasFirstCall
            ? firstCall.summary
            : "Initial call not yet completed"}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-2">Interaction History</h3>
      <TooltipProvider delayDuration={0}>
        {list.length>0 ? (
          <div className="relative space-y-6">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {list.map((i: any) => (
              <div key={i.id} className="relative pl-10">
                <div className="absolute left-2.5 top-3 h-3 w-3 rounded-full bg-primary border-2 border-background" />

                <div className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{i.summary}</h4>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{toLocal(i.occurred_at)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <User className="h-4 w-4" />
                        <span>By: {i.changed_by}</span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Category {i.category} • Budget {i.budget} {i.currency}
                      </p>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                      </TooltipTrigger>

                      <TooltipContent
                        side="right"
                        align="start"
                        className="max-w-xs p-3 text-xs"
                      >
                        <div className="space-y-1">
                          <p><strong>Summary:</strong> {i.summary}</p>
                          <p><strong>Details:</strong> {i.dtls_interaction || "N/A"}</p>
                          <p><strong>Occurred At:</strong> {toLocal(i.occurred_at)}</p>
                          <p><strong>Start:</strong> {toLocal(i.start_time_of_interaction)}</p>
                          <p><strong>End:</strong> {toLocal(i.end_time_of_interaction)}</p>
                          <p><strong>Duration:</strong> {i.dur_interaction_seconds} sec</p>
                          <p><strong>Category:</strong> {i.category}</p>
                          <p><strong>Budget:</strong> {i.budget} {i.currency}</p>
                          <p><strong>Profession:</strong> {i.profession}</p>
                          <p><strong>Traveller:</strong> {i.traveller}</p>
                          <p><strong>Next Call:</strong> {toLocal(i.next_call_date_time)}</p>
                          <p><strong>Next Action:</strong> {i.next_actions}</p>
                          <p><strong>Changed By:</strong> {i.changed_by}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <p className="text-muted-foreground text-sm mt-4">No interactions recorded yet</p> 
        )}
      </TooltipProvider>

    </div>
  );
};
