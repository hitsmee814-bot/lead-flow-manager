"use client";

import { useState } from "react";
import {
  format,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from "date-fns";

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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Clock, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function DateTimePicker({
  value,
  onChange,
  className,
  min,
  max,
  showTime = true,
}: {
  value: any;
  onChange: any;
  className?: string;
  min?: string | Date;
  max?: string | Date;
  showTime?: boolean;
}) {
  const parsedValue = value ? new Date(value) : null;
  const minDate = min ? new Date(min) : null;
  const maxDate = max ? new Date(max) : null;

  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(parsedValue);

  const displayDate = parsedValue;

  // Generate year range (adjust if needed)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i);

  const isDateDisabled = (day: Date) => {
    if (minDate && isBefore(day, startOfDay(minDate))) return true;
    if (maxDate && isAfter(day, endOfDay(maxDate))) return true;
    return false;
  };

  const handleConfirm = () => {
    if (!tempDate) return;

    if (minDate && tempDate < minDate) return;
    if (maxDate && tempDate > maxDate) return;

    if (showTime) {
      onChange(tempDate.toISOString());
    } else {
      const d = new Date(tempDate);
      d.setHours(0, 0, 0, 0);
      onChange(format(d, "yyyy-MM-dd"));
    }

    setOpen(false);
  };

  const handleClear = () => {
    setTempDate(null);
    onChange(null);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tempDate) return;

    const [h, m] = e.target.value.split(":").map(Number);
    const updated = new Date(tempDate);
    updated.setHours(h, m);

    if (minDate && updated < minDate) return;
    if (maxDate && updated > maxDate) return;

    setTempDate(updated);
  };

  const handleMonthChange = (monthIndex: number) => {
    if (!tempDate) return;

    const updated = new Date(tempDate);
    updated.setMonth(monthIndex);
    setTempDate(updated);
  };

  const handleYearChange = (year: number) => {
    if (!tempDate) return;

    const updated = new Date(tempDate);
    updated.setFullYear(year);
    setTempDate(updated);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />

          <Input
            readOnly
            className={cn("pl-9 cursor-pointer", className)}
            value={
              displayDate
                ? showTime
                  ? format(displayDate, "PPP • HH:mm")
                  : format(displayDate, "PPP")
                : ""
            }
            placeholder={showTime ? "Pick date & time" : "Pick date"}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-4 w-80 space-y-4" align="start">
        {/* 🔥 Month + Year Selectors */}
        <div className="flex gap-2">
          <Select
            value={
              tempDate ? String(tempDate.getMonth()) : undefined
            }
            onValueChange={(val) => handleMonthChange(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
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
            value={
              tempDate ? String(tempDate.getFullYear()) : undefined
            }
            onValueChange={(val) => handleYearChange(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 📅 Calendar */}
        <Calendar
          mode="single"
          selected={tempDate ?? undefined}
          onSelect={(d) => {
            if (!d || isDateDisabled(d)) return;

            const updated = tempDate ? new Date(tempDate) : new Date();
            updated.setFullYear(
              d.getFullYear(),
              d.getMonth(),
              d.getDate()
            );

            setTempDate(updated);
          }}
          month={tempDate ?? new Date()}
          onMonthChange={(m) => {
            if (!tempDate) {
              setTempDate(m);
            } else {
              const updated = new Date(tempDate);
              updated.setMonth(m.getMonth());
              updated.setFullYear(m.getFullYear());
              setTempDate(updated);
            }
          }}
          disabled={isDateDisabled}
          classNames={{
            day_today: "bg-transparent text-foreground",
          }}
        />

        {/* ⏰ Time */}
        {showTime && (
          <div className="relative w-full">
            <Input
              type="time"
              className="w-full pr-10"
              value={
                tempDate
                  ? `${String(tempDate.getHours()).padStart(2, "0")}:${String(
                      tempDate.getMinutes()
                    ).padStart(2, "0")}`
                  : ""
              }
              onChange={handleTimeChange}
            />
            <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={handleClear}
          >
            Clear
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            disabled={!tempDate}
            onClick={handleConfirm}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}