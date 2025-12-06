import { Interaction } from "@/types/lead";

interface InteractionTimelineProps {
  interactions: Interaction[];
}

export const InteractionTimeline = ({ interactions }: InteractionTimelineProps) => {
  console.log("🔥 INTERACTIONS RECEIVED →", interactions);

  return (
    <div className="text-sm text-muted-foreground p-4">
      Logged interactions in console.
    </div>
  );
};
