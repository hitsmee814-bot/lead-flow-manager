"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type FollowUp = {
    id: number
    message: string
    createdOn: string
    createdBy?: string
}

type EnquiryDetailsProps = {
    enquiry: {
        id: number
        enquiryNo: string
        source: string
        subject: string
        status: string
        createdOn: string
        serviceType?: string
        nextFollowup?: string
        details?: {
            destination?: string
            travelDate?: string
            passengers?: string
            pickupLocation?: string
            duration?: string
            requirement?: string
            supplier?: string
            message?: string
        }
        followups?: FollowUp[]
    } | null

    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EnquiryDetails({
    enquiry,
    open,
    onOpenChange,
}: EnquiryDetailsProps) {
    if (!enquiry) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    w-[99vw]
                    max-w-[1000px]
                    h-[82vh]
                    max-h-[82vh]
                    p-0
                    overflow-hidden
                    flex flex-col
                    bg-white
                    rounded-[4px]
                    [&>button]:hidden
                "
            >
                {/* HEADER */}
                <div className="border-b px-6 py-4">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-xl font-semibold text-gray-900">
                                    Enquiry Details
                                </DialogTitle>

                                <div className="mt-1 flex items-center gap-3">
                                    <span className="font-mono text-sm font-semibold text-primary">
                                        {enquiry.enquiryNo}
                                    </span>

                                    <span
                                        className={`
                                            rounded-full
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            ${
                                                enquiry.status === "New"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : enquiry.status ===
                                                      "In Progress"
                                                    ? "bg-green-100 text-green-700"
                                                    : enquiry.status ===
                                                      "Follow Up"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-purple-100 text-purple-700"
                                            }
                                        `}
                                    >
                                        {enquiry.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* SCROLLABLE BODY */}
                <div
                    className="
                        flex-1
                        min-h-0
                        overflow-y-auto
                        px-6
                        py-6
                    "
                >
                    {/* BASIC INFORMATION */}
                    <div className="mb-5">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 rounded-md border bg-gray-50 p-4 md:grid-cols-3">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Source
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {enquiry.source}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Subject
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {enquiry.subject}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Created On
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {enquiry.createdOn}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Service Type
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {enquiry.serviceType || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Next Follow Up
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {enquiry.nextFollowup || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ENQUIRY DETAILS */}
                    <div className="mb-5">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Enquiry Information
                        </h3>

                        <div className="rounded-md border">
                            {Object.entries(enquiry.details ?? {}).map(
                                ([key, value]) => {
                                    if (
                                        value === undefined ||
                                        value === null ||
                                        value === ""
                                    ) {
                                        return null
                                    }

                                    const label = key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                            str.toUpperCase()
                                        )

                                    return (
                                        <div
                                            key={key}
                                            className="grid grid-cols-1 border-b px-4 py-3 last:border-b-0 md:grid-cols-[180px_1fr]"
                                        >
                                            <div className="text-xs font-medium text-gray-500">
                                                {label}
                                            </div>

                                            <div className="mt-1 text-sm text-gray-900 md:mt-0">
                                                {String(value)}
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                        </div>
                    </div>

                    {/* FOLLOW UPS */}
                    <div className="mb-5">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Follow Ups
                        </h3>

                        {enquiry.followups &&
                        enquiry.followups.length > 0 ? (
                            <div className="space-y-3">
                                {enquiry.followups.map((followup) => (
                                    <div
                                        key={followup.id}
                                        className="rounded-md border bg-gray-50 p-4"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-500">
                                                {followup.createdBy ||
                                                    "Admin"}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                {followup.createdOn}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-800">
                                            {followup.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-md border bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                                No follow ups available.
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-end border-t px-6 py-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}