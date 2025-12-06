import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { InteractionForm } from "./InteractionForm";
import { LeadStatusForm } from "./LeadStatusForm";

export const LeadUpdateForm = ({ lead }: any) => {
  return (
    <Tabs defaultValue="interaction" className="w-full h-full flex flex-col">

      <TabsList
        className="grid grid-cols-2 w-full sticky top-0 z-10 bg-background border-b p-1 shadow-sm rounded-md"
      >
        <TabsTrigger
          value="interaction"
          className="data-[state=active]:bg-primary data-[state=active]:text-white 
               rounded-md transition-all"
        >
          Interaction
        </TabsTrigger>

        <TabsTrigger
          value="status"
          className="data-[state=active]:bg-primary data-[state=active]:text-white 
               rounded-md transition-all"
        >
          Status Update
        </TabsTrigger>
      </TabsList>


      <TabsContent value="interaction" className="h-full">
        <InteractionForm lead={lead} />
      </TabsContent>

      <TabsContent value="status" className="h-full">
        <LeadStatusForm lead={lead} />
      </TabsContent>

    </Tabs>
  );
};
