import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LeadsTable } from "@/components/LeadsTable";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { Lead } from "@/types/lead";
import { Filter, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";


const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [loadingLead, setLoadingLead] = useState(false);


  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(
          "http://150.241.244.100:51800/leads?limit=100&offset=0"
        );
        const data = await res.json();
        setLeads(data.leads);
      } catch (err) {
        console.error("Error fetching leads:", err);
        toast({
          variant: "destructive",
          title: "Failed to load leads",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const fetchLeadDetails = async (id: string) => {
    try {
      const res = await fetch(`http://150.241.244.100:51800/leads/${id}`);
      const data = await res.json();
      toast({
        variant: "default",
        title: "Lead details fetched.",
        description: "Succesfully fetch lead details.",
      })
      setSelectedLead(data);
    } catch (err) {
      console.error("Error fetching lead details:", err);
      toast({
        variant: "destructive",
        title: "Failed to load lead details",
        description: err,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const filteredLeads =
    groupFilter === "all"
      ? leads
      : leads.filter((lead) => lead.destination_country === groupFilter);

  const groups = Array.from(
    new Set(leads.map((lead) => lead.destination_country).filter(Boolean))
  );

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
    setSelectedLead(updatedLead);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/images/logoPrimary.png"
                  alt="Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-blue-400">Bon</span>
                  <span className="text-black">homiee</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Lead Management Solution
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {filteredLeads.length}{" "}
                {filteredLeads.length === 1 ? "Lead" : "Leads"}
              </Badge>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout? You will be redirected to
                      the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

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
            <Select
              value={groupFilter}
              onValueChange={setGroupFilter}
              disabled={loading}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by destination country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group!}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <p>Loading leads...</p>
        ) : (
          <LeadsTable
            leads={filteredLeads}
            onLeadClick={(lead) => {
              fetchLeadDetails(lead.id);
            }}
          />
        )}
      </main>

      <LeadDetailModal
        lead={selectedLead}
        interactions={[]}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleLeadUpdate}
      />
    </div>
  );
};

export default Index;
