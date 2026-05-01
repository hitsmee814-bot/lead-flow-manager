import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LeadsTable } from "@/components/LeadsTable";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { Lead } from "@/types/lead";
import { Filter, LogOut, LogOutIcon, Plus, RefreshCw } from "lucide-react";
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
import { Loader2 } from "lucide-react";
import { deleteSessionCookie } from "@/util/authCookies";
import { apiFetch } from "@/util/apiClient";
import logo from "@/assets/images/logoPrimary.png"

import { LeadInsertModal } from "@/components/LeadInsertModal";


const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [loadingLead, setLoadingLead] = useState(false);
  const [leadInteractions, setLeadInteractions] = useState<any[]>([]);
  const [leadFirstCall, setLeadFirstCall] = useState<null>(null);

  const [openInsertLead, setOpenInsertLead] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/leads?limit=100&offset=0");
      const data = await res;

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleRefreshLeads = async () => {
    setGroupFilter("all");
    setCityFilter("all");

    setSelectedLead(null);
    setLeadInteractions([]);
    setLeadFirstCall(null);

    await fetchLeads();

    toast({
      variant: "default",
      title: "Leads refreshed",
      description: "Latest leads have been loaded.",
    });
  };


  const fetchLeadInteractions = async (id: string) => {
    try {
      const res = await apiFetch(`/lead_interactions/history/${id}`);
      const data: any = await res;
      console.log("API gave interactions as ", data);
      return data;
    } catch (err) {
      console.error("Error fetching interactions:", err);
      toast({
        variant: "destructive",
        title: "Failed to load interactions",
        description: String(err),
      });
      return [];
    }
  };

  const fetchLeadFirstCall = async (id: string) => {
    try {
      const res = await apiFetch(`/lead_interactions/first_call/${id}`);
      const data: any = await res;
      console.log("API gave first call as ", data);
      return data;
    } catch (err) {
      console.error("Error fetching first call:", err);
      toast({
        variant: "destructive",
        title: "Failed to load first call details",
        description: String(err),
      });
      return [];
    }
  };

  const refreshInteractions = async () => {
    if (!selectedLead) return;

    const interactions: any = await fetchLeadInteractions(selectedLead.id);

    const sorted = [...(interactions?.interactions || [])].sort(
      (a, b) =>
        new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    );

    setLeadInteractions(sorted);
  };


  const fetchLeadDetails = async (id: string) => {
    try {
      setLoadingLead(true);

      const res = await apiFetch(`/leads/${id}`);
      const data = await res

      const [history, interactions, firstCall] = await Promise.all([
        fetchLeadHistory(id),
        fetchLeadInteractions(id),
        fetchLeadFirstCall(id)
      ]);

      const firstCallInteraction =
      firstCall?.interactions?.length > 0
        ? firstCall.interactions[0]
        : null;

      setSelectedLead({
        ...data,
        history,
      });

      const sortedInteractions = [...(interactions?.interactions || [])].sort(
        (a, b) =>
          new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
      );

      setLeadInteractions(sortedInteractions);
      setLeadFirstCall(firstCallInteraction);
    } catch (err) {
      console.error("Error fetching lead details:", err);
      toast({
        variant: "destructive",
        title: "Failed to load lead details",
        description: String(err),
      });
    } finally {
      setLoadingLead(false);
    }
  };



  const fetchLeadHistory = async (id: string) => {
    try {
      const res = await apiFetch(`/leads/history/${id}`);
      const data = await res
      return data;
    } catch (err) {
      console.log(err);
      if (err?.status === 404) {
        return;
      }
      toast({
        variant: "destructive",
        title: "Failed to load lead history",
        description: String(err),
      });
      return [];
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      deleteSessionCookie("auth_token");
      deleteSessionCookie("user_id");

      toast({
        title: "Logged out",
        description: "You have been safely logged out.",
        className: "border-blue-500 bg-blue-50 text-blue-900",
        action: <LogOutIcon className="h-5 w-5 text-blue-600" />,
      });

      navigate("/", { replace: true });
    }, 2000);
  };

  const filteredLeads = leads.filter((lead) => {
    const countryMatch =
      groupFilter === "all" ||
      lead.destination_country === groupFilter;

    const cityMatch =
      cityFilter === "all" ||
      lead.city === cityFilter;

    return countryMatch && cityMatch;
  });


  const groups = Array.from(
    new Set(leads.map((lead) => lead.destination_country).filter(Boolean))
  );
  const cities = Array.from(
    new Set(
      leads
        .filter(
          (lead) =>
            groupFilter === "all" ||
            lead.destination_country === groupFilter
        )
        .map((lead) => lead.city)
        .filter(Boolean)
    )
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
                  src={logo}
                  alt="Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#00AFEF" }}>
                  Bonhomiee
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
              onValueChange={(value) => {
                setGroupFilter(value);
                setCityFilter("all");
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {groups.map((country) => (
                  <SelectItem key={country} value={country!}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={cityFilter}
              onValueChange={setCityFilter}
              disabled={loading || cities.length === 0}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city!}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setOpenInsertLead(true)}
              className="whitespace-nowrap flex items-center gap-2"
              style={{ backgroundColor: "#00AFEF", color: "white" }} // custom color
            >
              <Plus className="w-4 h-4" />
              Insert Lead
            </Button>
            <Button
            onClick={handleRefreshLeads}
            className="whitespace-nowrap flex items-center gap-2"
            style={{ backgroundColor: "#00AFEF", color: "white" }}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          </div>

        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <LeadsTable
            leads={filteredLeads}
            onLeadClick={(lead) => {
              fetchLeadDetails(lead.id);
            }}
          />
        )}

      </main>

      {loadingLead && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading lead details…</p>
          </div>
        </div>
      )}

      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Logging you out…
          </p>
        </div>
      )}

      <LeadDetailModal
        lead={selectedLead}
        interactions={leadInteractions}
        firstCall={leadFirstCall}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleLeadUpdate}
        onRefreshInteractions={refreshInteractions}
      />

      <LeadInsertModal
        open={openInsertLead}
        onClose={() => setOpenInsertLead(false)}
      />

    </div>
  );
};

export default Index;
