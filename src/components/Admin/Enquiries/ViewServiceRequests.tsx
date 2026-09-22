"use client"

import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type ServiceRequest = {
    id: string
    serviceType: string
    status: string
}

type ViewServiceRequestsProps = {
    open: boolean
    enquiry: {
        enquiryNo: string
        subject: string
        source: string
        status: string
        serviceRequests?: ServiceRequest[]
    } | null
    onClose: () => void
}
const serviceRequestStatusStyles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700",
    "Follow Up": "bg-amber-100 text-amber-700",

    Assigned: "bg-green-100 text-green-700",
    "In Progress": "bg-green-100 text-green-700",
    Completed: "bg-green-100 text-green-700",

    Closed: "bg-red-100 text-red-700",
    Rejected: "bg-red-100 text-red-700",
}
export function ViewServiceRequests({
    open,
    enquiry,
    onClose,
}: ViewServiceRequestsProps) {
    if (!enquiry) return null

    const serviceRequests = enquiry.serviceRequests ?? []

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose()
                }
            }}
        >
            <DialogContent className="w-[95vw] max-w-3xl bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#1746C7]">
                        <ClipboardList size={20} />
                        Service Requests
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">

                    {/* Enquiry Information */}
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">

                            <div>
                                <p className="text-xs text-slate-500">
                                    Enquiry No
                                </p>
                                <p className="font-semibold text-slate-700">
                                    {enquiry.enquiryNo}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Source
                                </p>
                                <p className="font-semibold text-slate-700">
                                    {enquiry.source}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Status
                                </p>
                                <p className="font-semibold text-slate-700">
                                    {enquiry.status}
                                </p>

                            </div>

                            <div className="col-span-3">
                                <p className="text-xs text-slate-500">
                                    Subject
                                </p>
                                <p className="font-semibold text-slate-700">
                                    {enquiry.subject}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Service Requests */}
                    <div>
                        <p className="mb-3 text-sm font-semibold text-slate-700">
                            Service Requests ({serviceRequests.length})
                        </p>

                        <div className="overflow-hidden rounded-md border border-slate-200">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-4 py-3 text-left font-medium text-slate-500">
                                            #
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-slate-500">
                                            Service Request No
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-slate-500">
                                            Service Type
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-slate-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {serviceRequests.map(
                                        (serviceRequest, index) => (
                                            <tr
                                                key={serviceRequest.id}
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <td className="px-4 py-3 text-slate-500">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                                                    {serviceRequest.id}
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {serviceRequest.serviceType}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span
    className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${serviceRequestStatusStyles[serviceRequest.status] ??
        "bg-slate-100 text-slate-600"}
    `}
>
    {serviceRequest.status}
</span>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}