"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type RaiseEnquiryProps = {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}
type Recipient = {
    id: number
    name: string
}

const customers: Recipient[] = [
    { id: 1, name: "John Bose" },
    { id: 2, name: "Rahul Sen" },
    { id: 3, name: "Anita Das" },
]

const suppliers: Recipient[] = [
    { id: 1, name: "ABC Travel Services" },
    { id: 2, name: "Sunrise Hotels" },
    { id: 3, name: "Global Transport" },
]

const agents: Recipient[] = [
    { id: 1, name: "XYZ Travels" },
    { id: 2, name: "Dream Holidays" },
    { id: 3, name: "Eastern Tours" },
]
export function RaiseEnquiry({
    open,
    onClose,
    onSuccess,
}: RaiseEnquiryProps) {
    const [enquiryTo, setEnquiryTo] = useState("")
    const [recipient, setRecipient] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [serviceType, setServiceType] = useState("")
    const [destination, setDestination] = useState("")
    const [travelDate, setTravelDate] =
        useState<Date | undefined>()
    const [passengers, setPassengers] = useState("")
    const [message, setMessage] = useState("")

    const [enquiryToError, setEnquiryToError] = useState("")
    const [recipientError, setRecipientError] = useState("")
    const [subjectError, setSubjectError] = useState("")
    const [messageError, setMessageError] = useState("")

    const [saving, setSaving] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const recipientList =
    enquiryTo === "Customer"
        ? customers
        : enquiryTo === "Supplier"
        ? suppliers
        : enquiryTo === "Agent"
        ? agents
        : []
    useEffect(() => {
        if (open) {
            setEnquiryTo("")
            setRecipient("")
            setEmail("")
            setSubject("")
            setServiceType("")
            setDestination("")
            setTravelDate(undefined)
            setPassengers("")
            setMessage("")

            setEnquiryToError("")
            setRecipientError("")
            setSubjectError("")
            setMessageError("")

            setCalendarOpen(false)
        }
    }, [open])

    const handleRaiseEnquiry = async () => {
        setEnquiryToError("")
        setRecipientError("")
        setSubjectError("")
        setMessageError("")

        let hasError = false

        // Enquiry To validation
        if (!enquiryTo) {
            setEnquiryToError(
                "Please select who you want to raise the enquiry to"
            )
            hasError = true
        }

        // Recipient validation
        if (!recipient.trim()) {
            setRecipientError(
                "Please select a recipient"
            )
            hasError = true
        }

        // Subject validation
        if (!subject.trim()) {
            setSubjectError(
                "Please enter the enquiry subject"
            )
            hasError = true
        } else if (subject.trim().length < 5) {
            setSubjectError(
                "Please enter more details for the subject"
            )
            hasError = true
        }

        // Message validation
        if (!message.trim()) {
            setMessageError(
                "Please enter the enquiry details"
            )
            hasError = true
        } else if (message.trim().length < 5) {
            setMessageError(
                "Please enter more details for the enquiry"
            )
            hasError = true
        }

        if (hasError) {
            return
        }

        try {
            setSaving(true)

            /*
             * API call will be added later.
             *
             * Example payload:
             *
             * {
             *     enquiry_to: enquiryTo,
             *     recipient: recipient,
             *     email: email,
             *     subject: subject.trim(),
             *     service_type: serviceType,
             *     destination: destination.trim(),
             *     travel_date: travelDate,
             *     passengers: passengers.trim(),
             *     message: message.trim()
             * }
             */

            console.log("Raise enquiry data:", {
                enquiryTo,
                recipient,
                email,
                subject: subject.trim(),
                serviceType,
                destination: destination.trim(),
                travelDate,
                passengers: passengers.trim(),
                message: message.trim(),
            })

            onSuccess?.()

            onClose()
        } catch (error) {
            console.error(
                "Failed to raise enquiry:",
                error
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose()
                }
            }}
        >
            <DialogContent
                className="
                    w-[99vw]
                    max-w-[700px]
                    max-h-[85vh]
                    overflow-hidden
                    flex
                    flex-col
                    rounded-md
                    bg-white
                    [&>button]:hidden
                "
            >
                {/* HEADER */}
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-lg font-semibold text-slate-900">
                        Raise Enquiry
                    </DialogTitle>

                    <p className="pt-1 text-sm text-slate-500">
                        Create a new enquiry for a customer,
                        supplier or agent.
                    </p>
                </DialogHeader>

                {/* FORM BODY */}
                <div className="flex-1 min-h-0 overflow-y-auto py-4 pr-1">
                    <div className="space-y-5">

                        {/* Enquiry To */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Enquiry To{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                value={enquiryTo}
                               onChange={(e) => {
                                    setEnquiryTo(e.target.value)
                                    setRecipient("")
                                    setEnquiryToError("")
                                    setRecipientError("")
                                }}
                                className="
                                    h-12
                                    w-full
                                    rounded-md
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    focus:border-[#00AFEF]
                                    focus:ring-1
                                    focus:ring-[#00AFEF]
                                "
                            >
                                <option value="">
                                    Select recipient type
                                </option>

                                <option value="Customer">
                                    Customer
                                </option>

                                <option value="Supplier">
                                    Supplier
                                </option>

                                <option value="Agent">
                                    Agent
                                </option>
                            </select>

                            {enquiryToError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {enquiryToError}
                                </p>
                            )}
                        </div>

                        

                          {/* Recipient */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Recipient{" "}      
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                        value={recipient}
                        onChange={(e) => {
                            setRecipient(e.target.value)
                            setRecipientError("")
                        }}
                        disabled={!enquiryTo}
                        className="
                            h-12
                            w-full
                            rounded-md
                            border
                            border-slate-300
                            bg-white
                            px-3
                            text-sm
                            text-slate-900
                            outline-none
                            disabled:cursor-not-allowed
                            disabled:bg-slate-50
                            focus:border-[#00AFEF]
                            focus:ring-1
                            focus:ring-[#00AFEF]
                        "
                    >
                        <option value="">
                            {enquiryTo
                                ? `Select ${enquiryTo.toLowerCase()}`
                                : "Select enquiry type first"}
                        </option>

                        {recipientList.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>

                    {recipientError && (
                        <p className="mt-1 text-sm text-red-500">
                            {recipientError}
                        </p>
                    )}
                </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                readOnly
                                placeholder="Recipient email address"
                                className="
                                    h-12
                                    w-full
                                    rounded-md
                                    border
                                    border-slate-300
                                    bg-slate-50
                                    px-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                "
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Subject{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => {
                                    setSubject(e.target.value)
                                    setSubjectError("")
                                }}
                                placeholder="Enter enquiry subject"
                                className="
                                    h-12
                                    w-full
                                    rounded-md
                                    border
                                    border-slate-300
                                    px-3
                                    text-sm
                                    outline-none
                                    focus:border-[#00AFEF]
                                    focus:ring-1
                                    focus:ring-[#00AFEF]
                                "
                            />

                            {subjectError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {subjectError}
                                </p>
                            )}
                        </div>

                        {/* Service Type */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Service Type
                            </label>

                            <select
                                value={serviceType}
                                onChange={(e) =>
                                    setServiceType(e.target.value)
                                }
                                className="
                                    h-12
                                    w-full
                                    rounded-md
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    focus:border-[#00AFEF]
                                    focus:ring-1
                                    focus:ring-[#00AFEF]
                                "
                            >
                                <option value="">
                                    Select service type
                                </option>

                                <option value="Airport Transfer">
                                    Airport Transfer
                                </option>

                                <option value="Hotel">
                                    Hotel
                                </option>

                                <option value="Transport">
                                    Transport
                                </option>

                                <option value="Tour Package">
                                    Tour Package
                                </option>

                                <option value="Visa Assistance">
                                    Visa Assistance
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Destination + Passengers */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Destination */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Destination
                                </label>

                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) =>
                                        setDestination(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter destination"
                                    className="
                                        h-12
                                        w-full
                                        rounded-md
                                        border
                                        border-slate-300
                                        px-3
                                        text-sm
                                        outline-none
                                        focus:border-[#00AFEF]
                                        focus:ring-1
                                        focus:ring-[#00AFEF]
                                    "
                                />
                            </div>

                            {/* Passengers */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Passengers
                                </label>

                                <input
                                    type="text"
                                    value={passengers}
                                    onChange={(e) =>
                                        setPassengers(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. 2 Adults"
                                    className="
                                        h-12
                                        w-full
                                        rounded-md
                                        border
                                        border-slate-300
                                        px-3
                                        text-sm
                                        outline-none
                                        focus:border-[#00AFEF]
                                        focus:ring-1
                                        focus:ring-[#00AFEF]
                                    "
                                />
                            </div>
                        </div>

                        {/* Travel Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Travel Date
                            </label>

                            <Popover
                                open={calendarOpen}
                                onOpenChange={setCalendarOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="
                                            h-12
                                            w-full
                                            justify-start
                                            rounded-md
                                            border-slate-300
                                            bg-white
                                            px-3
                                            text-left
                                            font-normal
                                            text-slate-900
                                            hover:bg-white
                                            hover:text-slate-900
                                        "
                                    >
                                        <CalendarIcon
                                            className="
                                                mr-2
                                                h-4
                                                w-4
                                                shrink-0
                                                text-[#00AFEF]
                                            "
                                        />

                                        {travelDate ? (
                                            format(
                                                travelDate,
                                                "dd MMM yyyy"
                                            )
                                        ) : (
                                            <span className="text-slate-400">
                                                Select travel date
                                            </span>
                                        )}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={travelDate}
                                        disabled={{
                                            before: new Date(),
                                        }}
                                        onSelect={(date) => {
                                            setTravelDate(date)
                                            setCalendarOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Message / Requirement{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <textarea
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    setMessageError("")
                                }}
                                placeholder="Enter enquiry details"
                                rows={4}
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-slate-300
                                    px-3
                                    py-2
                                    text-sm
                                    outline-none
                                    focus:border-[#00AFEF]
                                    focus:ring-1
                                    focus:ring-[#00AFEF]
                                "
                            />

                            {messageError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {messageError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        className="
                            bg-[#00AFEF]
                            text-white
                            hover:bg-[#0099D1]
                        "
                        onClick={handleRaiseEnquiry}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Raise Enquiry"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}