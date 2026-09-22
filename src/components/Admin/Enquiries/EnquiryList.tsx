"use client"

import { useEffect, useState } from "react"
import {
    enquiryService,
    type Enquiry,
} from "@/services/AdminServices/enquiryService"
import {
    Search,
    Plus,
    MessageSquare,
    ClipboardPlus,
    Eye,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnquiryDetails } from "./EnquiryDetails"
import { EnquiryFollowup } from "./EnquiryFollowup"
import { RaiseEnquiry } from "./RaiseEnquiry"
import { CreateServiceRequests } from "./CreateServiceRequests"
import { ViewServiceRequests } from "./ViewServiceRequests"




const statusStyles: Record<string, string> = {
    New: "bg-blue-100 text-blue-700",
    "In Progress": "bg-green-100 text-green-700",
    "Follow Up": "bg-amber-100 text-amber-700",
    Quoted: "bg-purple-100 text-purple-700",
    Closed: "bg-purple-100 text-purple-700",
    Converted: "bg-purple-100 text-purple-700",
}

export function EnquiryList() {
   const [search, setSearch] = useState("")
const [source, setSource] = useState("Customer")
const [status, setStatus] = useState("All")

const [apiEnquiries, setApiEnquiries] = useState<Enquiry[]>([])
const [loading, setLoading] = useState(false)
const [totalCount, setTotalCount] = useState(0)
const pageSize = 20

const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null)
const [detailsOpen, setDetailsOpen] = useState(false)    
const [page, setPage] = useState(1)
const [followupOpen, setFollowupOpen] = useState(false)
const [createSROpen, setCreateSROpen] = useState(false)
const [createSREnquiry, setCreateSREnquiry] = useState<any | null>(null)
const [followupEnquiry, setFollowupEnquiry] = useState<any | null>(null)
const [raiseEnquiryOpen, setRaiseEnquiryOpen] = useState(false)
const [viewSROpen, setViewSROpen] = useState(false)
const [viewSREnquiry, setViewSREnquiry] = useState<any | null>(null)

const mappedEnquiries = apiEnquiries.map((enquiry) => ({
    ...enquiry,

    enquiryNo: enquiry.enquiry_no,

    source: enquiry.enquiry_type,

    subject: enquiry.subject ?? enquiry.description ?? "-",

    nextFollowup: enquiry.next_followup
        ? new Date(enquiry.next_followup).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : null,

    status:
    (enquiry.status === "OPEN" || enquiry.status === "NEW")
        ? "New"
        : enquiry.status === "IN_PROGRESS"
          ? "In Progress"
          : enquiry.status === "FOLLOWUP"
            ? "In Progress"
            : enquiry.status === "QUOTED"
              ? "Quoted"
              : enquiry.status === "CONVERTED"
                ? "Converted"
                : enquiry.status === "CLOSED"
                  ? "Closed"
                  : enquiry.status === "RESPONDED"
                    ? "In Progress"
                    : enquiry.status,

    createdOn: new Date(enquiry.created_at).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ),

  hasServiceRequests: enquiry.has_service_requests,
}))

const filteredEnquiries = mappedEnquiries.filter((enquiry) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
        enquiry.enquiryNo.toLowerCase().includes(searchText) ||
        enquiry.subject.toLowerCase().includes(searchText)

    const matchesSource = enquiry.source === source

    const matchesStatus =
        status === "All" || enquiry.status === status

    return matchesSearch && matchesSource && matchesStatus
})

const loadEnquiries = async () => {
    try {
        setLoading(true)

        const response = await enquiryService.getEnquiries(
            source.toUpperCase() as
                | "CUSTOMER"
                | "SUPPLIER"
                | "AGENT"
                | "ADMIN",
            status,
            page,
            pageSize
        )

        setApiEnquiries(response.items)
        setTotalCount(response.count)
    } catch (error) {
        console.error("Failed to load enquiries:", error)
    } finally {
        setLoading(false)
    }
}

useEffect(() => {
    loadEnquiries()
}, [source, status, page])  

    const canCreateServiceRequest = [
    "New",
    "In Progress",
]
    const canFollowUp = [
    "New",
    "In Progress",
    "Quoted",
    "Converted",
]
    return (
        <div className="w-full">

            {/* Page Header */}
            <div className="mb-5 flex items-center justify-between">

                <h1 className="text-2xl font-semibold text-[#1746C7]">
                    Enquiries
                </h1>

                <Button
                    onClick={() => setRaiseEnquiryOpen(true)}
                >
                    <Plus size={16} />
                    Raise Enquiry
                </Button>

            </div>

            {/* Search + Source + Status */}
       {/* Search + Status */}
<div className="mb-4 rounded-md border border-slate-200 bg-white">

    {/* First Row - Search + Status */}
    <div className="flex items-center gap-3 px-3 py-2">

        {/* Search */}
        {/* Search */}
<div className="relative flex-1">
    <Search
        size={16}
        className="
            absolute
            left-3 top-1/2
            -translate-y-1/2
            text-slate-400
        "
    />

    <input
        type="text"
        placeholder="Search enquiries"
        value={search}
        onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
        }}
        className="
            w-full
            rounded-md
            border border-slate-200
            py-2 pl-9 pr-9
            text-sm
            outline-none
            focus:border-[#3FB8FF]
        "
    />

    {search && (
        <button
            type="button"
            onClick={() => {
                setSearch("")
                setPage(1)
            }}
            className="
                absolute
                right-3 top-1/2
                -translate-y-1/2
                text-slate-400
                hover:text-slate-600
            "
            title="Clear search"
        >
            <X size={16} />
        </button>
    )}
</div>

        {/* Status */}
        <select
            value={status}
            onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
            }}
            className="
                w-32
                rounded-md
                border border-slate-200
                px-3 py-2
                text-sm
                text-slate-600
                outline-none
            "
        >
            <option value="All">Status: All</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Quoted">Quoted</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
        </select>

    </div>

    {/* Second Row - Enquiry Source Tabs */}
    <div className="border-t border-slate-200 px-3">
        <div className="flex items-center gap-1">
            {["Customer", "Supplier", "Agent", "Admin"].map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => {
                        setSource(tab)
                        setPage(1)
                    }}
                    className={`
                        px-4 py-2.5
                        text-sm font-medium
                        border-b-2
                        transition-colors
                        ${
                            source === tab
                                ? "border-[#FBAB18] text-[#FBAB18]"
                                : "border-transparent text-slate-500 hover:text-[#3FB8FF]"
                        }
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
    </div>

</div>

            {/* Enquiry Table */}
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">

                <div className="overflow-x-auto">

                   <table className="w-full min-w-[1200px] table-fixed text-sm">

                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">

                                <th className="w-[5%] px-3 py-3 text-left font-medium text-slate-500">
                                    #
                                </th>

                                <th className="w-[13%] px-3 py-3 text-left font-medium text-slate-500">
                                    Enquiry No
                                </th>
                                {source === "Supplier" && (
                                <th className="w-[15%] px-3 py-3 text-left font-medium text-slate-500">
                                    Supplier Name
                                </th>
                            )}

                                <th className="w-[11%] px-3 py-3 text-left font-medium text-slate-500">
                                    Source
                                </th>

                                <th className="w-[17%] px-3 py-3 text-left font-medium text-slate-500">
                                    Subject
                                </th>
                                

                                <th className="w-[12%] px-3 py-3 text-left font-medium text-slate-500">
                                    Next Follow Up
                                </th>
                                <th className="w-[11%] px-3 py-3 text-left font-medium text-slate-500">
                                    Status
                                </th>

                                <th className="w-[12%] px-3 py-3 text-left font-medium text-slate-500">
                                    Created On
                                </th>

                            <th className="w-[10%] px-3 py-3 text-left font-medium text-slate-500">
                                Follow Up
                            </th>

                            {(source === "Customer" || source === "Agent") && (
                            <th className="w-[21%] px-3 py-3 text-left font-medium text-slate-500">
                                Service Requests
                            </th>
                        )}

                            </tr>
                        </thead>

                        <tbody>

                            {filteredEnquiries.map((enquiry, index) => (

                                <tr
                                    key={enquiry.id}
                                    className="
                                        border-b
                                        border-slate-100
                                        hover:bg-slate-50
                                    "
                                >

                                    <td className="px-3 py-3 text-slate-500">
                                    {(page - 1) * pageSize + index + 1}
                                </td>

                                    {/* Enquiry No */}
                                    <td className="px-3 py-3">

                                    <button
                                        type="button"
                                        title="Click to view details"
                                        className="cursor-pointer font-mono text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                                        onClick={() => {
                                            setSelectedEnquiry(enquiry)
                                            setDetailsOpen(true)
                                        }}
                                    >
                                        {enquiry.enquiryNo}
                                    </button>

                                    </td>
                                       {source === "Supplier" && (
                                        <td className="px-3 py-3 text-slate-600">
                                            {enquiry.supplier_name ?? "-"}
                                        </td>
                                    )}     
                                    {/* Source */}
                                    <td className="px-3 py-3 text-slate-600">
                                        {enquiry.source}
                                    </td>

                                    {/* Subject */}
                                    <td className="px-3 py-3 text-slate-600">
                                        {enquiry.subject}
                                    </td>
                                        <td className="px-3 py-3 text-slate-500">
                                            {enquiry.nextFollowup ?? "-"}
                                        </td>     
                                    {/* Status */}
                                    <td className="px-3 py-3">

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                rounded-full
                                                px-2
                                                py-0.5
                                                text-[10px]
                                                font-semibold
                                                ${statusStyles[enquiry.status]}
                                            `}
                                        >
                                            {enquiry.status}
                                        </span>

                                    </td>

                                    {/* Created On */}
                                    <td className="px-3 py-3 text-slate-500">
                                        {enquiry.createdOn}
                                    </td>

          {/* Action */}
{/* Follow Up */}

<td className="px-3 py-3">
    <div className="flex items-center">
           <span
            title={
                canFollowUp.includes(enquiry.status)
                    ? "Follow Up"
                    : "Follow Up is not available for closed enquiries"
            }
        >
            <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                disabled={!canFollowUp.includes(enquiry.status)}
                onClick={() => {
                    if (!canFollowUp.includes(enquiry.status)) return

                    setFollowupEnquiry(enquiry)
                    setFollowupOpen(true)
                }}
            >
                <MessageSquare size={14} />
            </Button>
        </span>
        
    </div>
</td>

{/* Service Requests */}
{(source === "Customer" || source === "Agent") && (
<td className="px-3 py-3">
    <div className="flex items-center gap-4">

        {/* Create Service Request */}
        {(enquiry.source === "Customer" ||
    enquiry.source === "Agent") && (
    <span
        title={
            canCreateServiceRequest.includes(enquiry.status)
                ? "Create Service Request"
                : "Service Request cannot be created for this status"
        }
    >
        <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-lg border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
            disabled={
                !canCreateServiceRequest.includes(enquiry.status)
            }
            onClick={() => {
                if (
                    !canCreateServiceRequest.includes(
                        enquiry.status
                    )
                ) {
                    return
                }

                setCreateSREnquiry(enquiry)
                setCreateSROpen(true)
            }}
        >
            <ClipboardPlus className="h-4 w-4" />
        </Button>
    </span>
)}
        {/* View Service Requests */}
        {enquiry.hasServiceRequests && (
            <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-lg border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                title="View Service Requests"
                onClick={() => {
                    setViewSREnquiry(enquiry)
                    setViewSROpen(true)
                }}
            >
                <Eye className="h-4 w-4" />
            </Button>
        )}

    </div>
</td>
)}
                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* Pagination - same style as Supplier Enquiry */}
                <div className="flex items-center justify-end gap-2 border-t px-4 py-3">

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() =>
                            setPage((prev) => Math.max(prev - 1, 1))
                        }
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Page {page}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page * pageSize >= totalCount}
                        onClick={() =>
                            setPage((prev) => prev + 1)
                        }
                    >
                        Next
                    </Button>

                </div>

            </div>
            <EnquiryDetails
                enquiry={selectedEnquiry}
                open={detailsOpen}
                onOpenChange={(open) => {
                    setDetailsOpen(open)

                    if (!open) {
                        setSelectedEnquiry(null)
                    }
                }}
            />
            <EnquiryFollowup
                open={followupOpen}
                enquiryNo={followupEnquiry?.enquiryNo ?? null}
                onClose={() => {
                    setFollowupOpen(false)
                    setFollowupEnquiry(null)
                }}
                onSuccess={() => {
                    // API refresh will be added here later
                }}
            />

            <RaiseEnquiry
            open={raiseEnquiryOpen}
            onClose={() => setRaiseEnquiryOpen(false)}
            onSuccess={() => {
                // API refresh will be added later
            }}
        />

        <CreateServiceRequests
    open={createSROpen}
    enquiry={createSREnquiry}
    onClose={() => {
        setCreateSROpen(false)
        setCreateSREnquiry(null)
    }}
    onSuccess={() => {
        // API refresh will be added later
    }}
/>

<ViewServiceRequests
    open={viewSROpen}
    enquiry={viewSREnquiry}
    onClose={() => {
        setViewSROpen(false)
        setViewSREnquiry(null)
    }}
/>
        </div>
    )
}