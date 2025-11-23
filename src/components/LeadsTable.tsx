import { useState, useMemo } from "react";
import { Lead } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/Badge";

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

type SortField = keyof Lead;
type SortOrder = "asc" | "desc";

export const LeadsTable = ({ leads, onLeadClick }: LeadsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter((lead) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        lead.first_name.toLowerCase().includes(searchLower) ||
        lead.last_name.toLowerCase().includes(searchLower) ||
        lead.phone_number.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.city.toLowerCase().includes(searchLower) ||
        lead.country.toLowerCase().includes(searchLower) ||
        lead.platform.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [leads, searchTerm, sortField, sortOrder]);

  const getCategoryVariant = (category?: string) => {
    if (!category) return "secondary";
    if (category.includes("Hot")) return "success";
    if (category.includes("Warm")) return "warning";
    return "info";
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, city, country, platform..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("id")}>
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("platform")}>
                    Platform
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("country")}>
                    Country
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("when")}>
                    When
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onLeadClick(lead)}
                >
                  <TableCell className="font-medium max-w-[80px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.id}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.platform}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.platform}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.country}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.country}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.when}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.when}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[100px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.duration}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.duration}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">
                          {lead.first_name} {lead.last_name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.first_name} {lead.last_name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[130px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.phone_number}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.phone_number}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[180px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.email}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{lead.city}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{lead.city}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {lead.category && (
                      <Badge variant={getCategoryVariant(lead.category)}>
                        {lead.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {lead.assigned_group && (
                      <Badge variant="secondary">{lead.assigned_group}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedLeads.length} of {leads.length} leads
        </div>
      </div>
    </TooltipProvider>
  );
};
