import { useState } from "react";
import { LeadsTable } from "@/components/LeadsTable";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { mockLeads, mockInteractions } from "@/data/mockLeads";
import { Lead } from "@/types/lead";
import { Users, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/Badge";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const filteredLeads = groupFilter === "all"
    ? leads
    : leads.filter(lead => lead.assigned_group === groupFilter);

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(leads.map(lead =>
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setSelectedLead(updatedLead);
  };

  const groups = Array.from(new Set(leads.map(lead => lead.assigned_group).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/images/logoPrimary.png"
                  alt="Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-primary">Bon</span>
                  <span className="text-black">homiee</span>
                </h1>
                <p className="text-sm text-muted-foreground">Campaign Management Solution</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">All Leads</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your campaign leads
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group!}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <LeadsTable
          leads={filteredLeads}
          onLeadClick={setSelectedLead}
        />
      </main>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        interactions={selectedLead ? mockInteractions[selectedLead.id] || [] : []}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleLeadUpdate}
      />
    </div>
  );
};

export default Index;
