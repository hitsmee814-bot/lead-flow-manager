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

type EnquiryFollowupProps = {
    open: boolean
    enquiryNo: string | null
    onClose: () => void
    onSuccess?: () => void
}

export function EnquiryFollowup({
    open,
    enquiryNo,
    onClose,
    onSuccess,
}: EnquiryFollowupProps) {
    const [remarks, setRemarks] = useState("")
    const [selectedDate, setSelectedDate] =
        useState<Date | undefined>()

    const [remarksError, setRemarksError] = useState("")
    const [dateError, setDateError] = useState("")
    const [saving, setSaving] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)

    useEffect(() => {
        if (open) {
            setRemarks("")
            setSelectedDate(undefined)
            setRemarksError("")
            setDateError("")
            setCalendarOpen(false)
        }
    }, [open, enquiryNo])

    const handleSaveFollowup = async () => {
        setRemarksError("")
        setDateError("")

        // Remarks validation
        if (!remarks.trim()) {
            setRemarksError("Please enter follow-up remarks")
            return
        }

        if (remarks.trim().length < 5) {
            setRemarksError(
                "Please enter more details for the follow-up"
            )
            return
        }

        // Date validation
        if (!selectedDate) {
            setDateError(
                "Please select the next follow-up date"
            )
            return
        }

        try {
            setSaving(true)

            /*
             * API call will be added here later.
             *
             * Example:
             *
             * await AdminEnquiryFollowup.addFollowup(...)
             */

            console.log("Follow-up data:", {
                enquiryNo,
                remarks: remarks.trim(),
                next_followup_date: selectedDate,
            })

            onSuccess?.()

            setRemarks("")
            setSelectedDate(undefined)

            onClose()
        } catch (error) {
            console.error(
                "Failed to save follow-up:",
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
                    max-w-xl
                    rounded-md
                    [&>button]:hidden
                "
            >
                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-slate-900">
                        Follow Up
                    </DialogTitle>

                    {enquiryNo && (
                        <p className="pt-1 text-sm text-slate-500">
                            Enquiry No.:{" "}
                            <span className="font-semibold text-slate-800">
                                {enquiryNo}
                            </span>
                        </p>
                    )}
                </DialogHeader>

                {/* FORM */}
                <div className="space-y-5 py-4">

                    {/* Remarks */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Remarks{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <textarea
                            value={remarks}
                            onChange={(e) => {
                                setRemarks(e.target.value)
                                setRemarksError("")
                            }}
                            placeholder="Enter follow-up remarks"
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

                        {remarksError && (
                            <p className="mt-1 text-sm text-red-500">
                                {remarksError}
                            </p>
                        )}
                    </div>

                    {/* Next Follow-up Date */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Next Follow-up Date{" "}
                            <span className="text-red-500">
                                *
                            </span>
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

                                    {selectedDate ? (
                                        format(
                                            selectedDate,
                                            "dd MMM yyyy"
                                        )
                                    ) : (
                                        <span className="text-slate-400">
                                            Select follow-up date
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
                                    selected={selectedDate}
                                    disabled={{
                                        before: new Date(),
                                    }}
                                    onSelect={(date) => {
                                        setSelectedDate(date)
                                        setDateError("")
                                        setCalendarOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        {dateError && (
                            <p className="mt-1 text-sm text-red-500">
                                {dateError}
                            </p>
                        )}
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
                        onClick={handleSaveFollowup}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Follow Up"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}