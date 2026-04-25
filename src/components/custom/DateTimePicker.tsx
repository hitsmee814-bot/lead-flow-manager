"use client";

import { useState } from "react";
import { format, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function DateTimePicker({
    value,
    onChange,
    className,
    min,
    max,
    showTime = true,
}: any) {
    const [open, setOpen] = useState(false);

    const parsed = value ? new Date(value) : null;
    const today = new Date();

    // ✅ IMPORTANT: single source of truth for calendar navigation
    const [month, setMonth] = useState<Date>(
        parsed ?? new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const minDate = min ? new Date(min) : null;
    const maxDate = max ? new Date(max) : null;

    const years = Array.from(
        { length: 30 },
        (_, i) => today.getFullYear() - 15 + i
    );

    const isDisabled = (d: Date) => {
        if (minDate && isBefore(d, startOfDay(minDate))) return true;
        if (maxDate && isAfter(d, endOfDay(maxDate))) return true;
        return false;
    };

    const commit = (d: Date) => {
        if (minDate && d < minDate) return;
        if (maxDate && d > maxDate) return;

        if (showTime) onChange(d.toISOString());
        else {
            const clean = new Date(d);
            clean.setHours(0, 0, 0, 0);
            onChange(format(clean, "yyyy-MM-dd"));
        }
    };

    const handleSelectDate = (d: Date | undefined) => {
        if (!d) return;

        const base = parsed ? new Date(parsed) : new Date();
        base.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());

        commit(base);
        setOpen(false);
    };

    const handleMonthYearNav = (newMonth: Date) => {
        setMonth(newMonth); // 🔥 THIS fixes prev/next arrows
    };

    const handleMonthChange = (m: number) => {
        const updated = new Date(month);
        updated.setMonth(m);
        setMonth(updated);
    };

    const handleYearChange = (y: number) => {
        const updated = new Date(month);
        updated.setFullYear(y);
        setMonth(updated);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!parsed) return;

        const [h, m] = e.target.value.split(":").map(Number);
        const updated = new Date(parsed);
        updated.setHours(h, m);

        commit(updated);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full">
                    <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />

                    <Input
                        readOnly
                        className={cn("pl-8 cursor-pointer h-9 text-sm", className)}
                        value={
                            parsed
                                ? showTime
                                    ? format(parsed, "PP • HH:mm")
                                    : format(parsed, "PP")
                                : ""
                        }
                        placeholder="Select date"
                    />
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-72 p-3 space-y-3">

                {/* Month / Year */}
                <div className="flex gap-2">
                    <Select
                        value={String(month.getMonth())}
                        onValueChange={(v) => handleMonthChange(Number(v))}
                    >
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Mon" />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((m, i) => (
                                <SelectItem key={i} value={String(i)}>
                                    {m}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={String(month.getFullYear())}
                        onValueChange={(v) => handleYearChange(Number(v))}
                    >
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="h-[320px]">
                    <Calendar
                        mode="single"
                        selected={parsed ?? undefined}
                        onSelect={handleSelectDate}
                        disabled={isDisabled}
                        month={month}
                        onMonthChange={handleMonthYearNav}
                        classNames={{
                            day_today: "bg-transparent text-inherit",
                            today: "bg-transparent text-inherit",
                        }}
                    />
                </div>

                {/* Time */}
                {showTime && (
                    <div className="relative">
                        <Input
                            type="time"
                            className="h-9 text-sm pr-8"
                            value={
                                parsed
                                    ? `${String(parsed.getHours()).padStart(2, "0")}:${String(
                                        parsed.getMinutes()
                                    ).padStart(2, "0")}`
                                    : ""
                            }
                            onChange={handleTimeChange}
                        />
                        <Clock className="absolute right-2 top-2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                )}

                {/* Clear */}
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => onChange(null)}
                    >
                        Clear
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}