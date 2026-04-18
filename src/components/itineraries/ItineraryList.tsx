"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { Search, ArrowUpDown } from "lucide-react";

type Props = {
    onEdit: (id: string) => void;
    onPreview: (id: string) => void;
};

type SortField = "title" | "duration" | "price" | "status";
type SortOrder = "asc" | "desc";

type Itinerary = {
    id: string;
    title: string;
    duration: string;
    price: number;
    status: string;
};

export default function ItineraryList({ onEdit, onPreview }: Props) {
    const [data, setData] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("title");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [page, setPage] = useState(1);

    const PAGE_SIZE = 8;
    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    "http://150.241.244.100:8000/itinerary/search",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                    }
                );

                const json = await res.json();

                const parsed = json.map((item: string) => JSON.parse(item));

                const mapped = parsed.map((item: any) => ({
                    id: item.tour.id,
                    title: item.tour.title,
                    duration: `${item.tour.duration_days}D / ${item.tour.duration_nights}N`,
                    price: item.tour.base_price,
                    status: item.tour.status ?? "active",
                    raw: item,
                }));

                setData(mapped);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const filteredData = useMemo(() => {
        const s = searchTerm.toLowerCase();

        let filtered = data.filter((item) =>
            item.title.toLowerCase().includes(s)
        );

        filtered.sort((a, b) => {
            const av = a[sortField].toString();
            const bv = b[sortField].toString();

            return sortOrder === "asc"
                ? av.localeCompare(bv)
                : bv.localeCompare(av);
        });

        return filtered;
    }, [data, searchTerm, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

    const paginated = filteredData.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );
    console.log(paginated)

    return (
        <TooltipProvider>
            <div className="space-y-4">

                {/* SEARCH */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search itineraries..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="pl-9"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                {loading && (
                    <div className="text-sm text-muted-foreground">
                        Loading itineraries...
                    </div>
                )}

                {!loading && (
                    <div className="rounded-xl border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>

                                    <TableHead>
                                        <Button variant="ghost" size="sm" onClick={() => handleSort("title")}>
                                            Title <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button variant="ghost" size="sm" onClick={() => handleSort("duration")}>
                                            Duration <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button variant="ghost" size="sm" onClick={() => handleSort("price")}>
                                            Price <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button variant="ghost" size="sm" onClick={() => handleSort("status")}>
                                            Status <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>

                                    <TableHead className="text-right">Actions</TableHead>

                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginated.map((item:any) => (
                                    <TableRow key={item.id} className="hover:bg-muted/50">

                                        {[item.title, item.duration, `₹ ${item.price}`, item.status].map((value, i) => (
                                            <TableCell
                                                key={i}
                                                className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap"
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="block truncate">{value}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs break-words">{value}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                        ))}

                                        <TableCell className="text-right space-x-2">

                                            {/* <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onPreview(item.id)}
                                            >
                                                Preview
                                            </Button> */}

                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onEdit(item.raw)}
                                            >
                                                Edit
                                            </Button>

                                            {/* <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => console.log("delete", item.id)}
                                            >
                                                Delete
                                            </Button> */}

                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">

                    <div>
                        Showing {paginated.length} of {filteredData.length} itineraries
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
                            Page {page} / {totalPages || 1}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>

                </div>

            </div>
        </TooltipProvider>
    );
}