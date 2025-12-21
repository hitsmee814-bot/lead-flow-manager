import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { InteractionForm } from "./InteractionForm";
import { LeadStatusForm } from "./LeadStatusForm";

interface LeadUpdateFormProps {
  lead: any;
  onRefreshInteractions: () => void;
}

export const LeadUpdateForm = ({ lead, onRefreshInteractions }: LeadUpdateFormProps) => {
  return (
    <Tabs defaultValue="interaction" className="w-full h-full flex flex-col">

      <TabsList
        className="grid grid-cols-2 w-full sticky top-0 z-10 bg-background border border-border p-1 shadow-sm rounded-md"
      >
        <TabsTrigger
          value="interaction"
          className="
    data-[state=active]:bg-primary
    data-[state=active]:text-white
    rounded-md
    transition-all

    px-3
    py-2
    leading-none

    focus:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
  "
        >
          Interaction
        </TabsTrigger>


        <TabsTrigger
          value="status"
          className="
    data-[state=active]:bg-primary
    data-[state=active]:text-white
    rounded-md
    transition-all

    px-3
    py-2
    leading-none

    focus:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
  "
        >
          Status Update
        </TabsTrigger>

      </TabsList>

      <TabsContent value="interaction" className="h-full">
        <InteractionForm
          lead={lead}
          onSuccess={() => {
            onRefreshInteractions();
          }}
        />
      </TabsContent>

      <TabsContent value="status" className="h-full">
        <LeadStatusForm lead={lead} />
      </TabsContent>

    </Tabs>
  );
};
