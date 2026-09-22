"use client"

import { useState } from "react"
import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type Service = {
    id: string
    serviceType: string
    description?: string
}

type CreateServiceRequestsProps = {
    open: boolean
    enquiry: {
        enquiryNo: string
        subject: string
        source: string
        services?: Service[]
        serviceRequests?: {
            id: string
            serviceType: string
            status: string
        }[]
    } | null
    onClose: () => void
    onSuccess?: () => void
}

export function CreateServiceRequests({
    open,
    enquiry,
    onClose,
    onSuccess,
}: CreateServiceRequestsProps) {
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [saving, setSaving] = useState(false)

    if (!enquiry) return null

    const existingServices =
        enquiry.serviceRequests?.map(
            (serviceRequest) => serviceRequest.serviceType
        ) ?? []

    /*
     * Dummy services for the demo.
     * Later this will come from the backend based on the enquiry.
     */
    const services =
        enquiry.services ?? [
            {
                id: "SERVICE-001",
                serviceType: "Hotel",
                description: "Hotel accommodation",
            },
            {
                id: "SERVICE-002",
                serviceType: "Airport Transfer",
                description: "Airport pickup and drop",
            },
            {
                id: "SERVICE-003",
                serviceType: "Sightseeing",
                description: "Local sightseeing",
            },
            {
                id: "SERVICE-004",
                serviceType: "Visa Assistance",
                description: "Visa assistance service",
            },
        ]

    const availableServices = services.filter(
        (service) =>
            !existingServices.includes(service.serviceType)
    )

    const toggleService = (serviceId: string) => {
        setSelectedServices((current) =>
            current.includes(serviceId)
                ? current.filter((id) => id !== serviceId)
                : [...current, serviceId]
        )
    }

    const handleSave = async () => {
        if (selectedServices.length === 0) return

        setSaving(true)

        try {
            /*
             * API will be added later.
             *
             * The selectedServices array represents
             * all SRs to be created in one transaction.
             */
            console.log("Create Service Requests", {
                enquiryNo: enquiry.enquiryNo,
                serviceIds: selectedServices,
            })

            onSuccess?.()
            setSelectedServices([])
            onClose()
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    setSelectedServices([])
                    onClose()
                }
            }}
        >
            <DialogContent className="w-[95vw] max-w-2xl bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#1746C7]">
                        <ClipboardList size={20} />
                        Create Service Requests
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">

                    {/* Enquiry information */}
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
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

                            <div className="col-span-2">
                                <p className="text-xs text-slate-500">
                                    Subject
                                </p>
                                <p className="font-semibold text-slate-700">
                                    {enquiry.subject}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Existing SRs */}
                    {existingServices.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-slate-700">
                                Already Created
                            </p>

                            <div className="space-y-2">
                                {enquiry.serviceRequests?.map(
                                    (serviceRequest) => (
                                        <div
                                            key={serviceRequest.id}
                                            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                                        >
                                            <span className="text-sm text-slate-600">
                                                {serviceRequest.serviceType}
                                            </span>

                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                                {serviceRequest.status}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Services */}
                    <div>
                        <p className="mb-2 text-sm font-semibold text-slate-700">
                            Select Services
                        </p>

                        {availableServices.length === 0 ? (
                            <div className="rounded-md border border-slate-200 p-4 text-sm text-slate-500">
                                All services for this enquiry already have
                                Service Requests.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {availableServices.map((service) => {
                                    const selected =
                                        selectedServices.includes(service.id)

                                    return (
                                        <label
                                            key={service.id}
                                            className={`
                                                flex cursor-pointer items-center
                                                gap-3 rounded-md border p-3
                                                transition
                                                ${
                                                    selected
                                                        ? "border-[#3FB8FF] bg-blue-50"
                                                        : "border-slate-200 hover:bg-slate-50"
                                                }
                                            `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() =>
                                                    toggleService(service.id)
                                                }
                                                className="h-4 w-4"
                                            />

                                            <div>
                                                <p className="text-sm font-medium text-slate-700">
                                                    {service.serviceType}
                                                </p>

                                                {service.description && (
                                                    <p className="text-xs text-slate-500">
                                                        {service.description}
                                                    </p>
                                                )}
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSelectedServices([])
                                onClose()
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            disabled={
                                selectedServices.length === 0 || saving
                            }
                            onClick={handleSave}
                        >
                            {saving
                                ? "Creating..."
                                : "Create Service Requests"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}