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
                <TableCell className="font-medium">{lead.id}</TableCell>
                <TableCell>{lead.platform}</TableCell>
                <TableCell>{lead.country}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.when}</TableCell>
                <TableCell>{lead.duration}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {lead.first_name} {lead.last_name}
                </TableCell>
                <TableCell>{lead.phone_number}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.city}</TableCell>
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
  );
};
