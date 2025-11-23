import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, ArrowUpDown } from "lucide-react";

interface LeadsTableProps {
  leads: any[];
  onLeadClick: (lead: any) => void;
}

type SortField = keyof any;
type SortOrder = "asc" | "desc";

export const LeadsTable = ({ leads, onLeadClick }: LeadsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedLeads = useMemo(() => {
    const s = searchTerm.toLowerCase();

    let filtered = leads.filter((lead) => {
      return (
        lead.first_name?.toLowerCase().includes(s) ||
        lead.last_name?.toLowerCase().includes(s) ||
        lead.phone_number?.toLowerCase().includes(s) ||
        lead.email?.toLowerCase().includes(s) ||
        lead.city?.toLowerCase().includes(s) ||
        lead.destination_country?.toLowerCase().includes(s) ||
        lead.platform?.toLowerCase().includes(s)
      );
    });

    filtered.sort((a, b) => {
      const av = (a[sortField] || "").toString();
      const bv = (b[sortField] || "").toString();
      return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return filtered;
  }, [leads, searchTerm, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedLeads.length / PAGE_SIZE);
  const paginatedLeads = filteredAndSortedLeads.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, city, email, platform..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" size="sm" onClick={() => handleSort("id")}>ID <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                <TableHead><Button variant="ghost" size="sm" onClick={() => handleSort("platform")}>Platform <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                <TableHead><Button variant="ghost" size="sm" onClick={() => handleSort("destination_country")}>Country <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                <TableHead>When</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onLeadClick(lead)}
                >
                  {[
                    lead.id,
                    lead.platform,
                    lead.destination_country,
                    lead.intended_travel_date,
                    lead.duration_of_travel,
                    `${lead.first_name} ${lead.last_name}`,
                    lead.phone_number,
                    lead.email,
                    lead.city
                  ].map((value, index) => (
                    <TableCell
                      key={index}
                      className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                              {value}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs break-words">{value}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
          <div>
            Showing {paginatedLeads.length} of {filteredAndSortedLeads.length} leads
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <span>
              Page {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
