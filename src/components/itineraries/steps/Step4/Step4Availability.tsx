"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { DateTimePicker } from "@/components/custom/DateTimePicker";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Availability = {
  id: string;
  start_date: string;
  end_date: string;
  price: number;
  total_slots: number;
  available_slots: number;
  status: "available" | "closed" | "sold_out";
};

const Label = ({ children }: any) => (
  <label className="text-sm font-medium text-gray-700">
    {children}
  </label>
);

export default function Step4Availability({
  data,
  setData,
}: {
  data: Availability[];
  setData: (v: Availability[]) => void;
}) {
  /* ---------------- ADD ---------------- */
  const addSlot = () => {
    setData([
      ...data,
      {
        id: crypto.randomUUID(),
        start_date: "",
        end_date: "",
        price: 0,
        total_slots: 0,
        available_slots: 0,
        status: "available",
      },
    ]);
  };

  /* ---------------- UPDATE ---------------- */
  const update = (id: string, key: string, value: any) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  };

  /* ---------------- REMOVE ---------------- */
  const remove = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Availability</h2>
          <p className="text-sm text-muted-foreground">
            Define booking slots & pricing windows
          </p>
        </div>

        <Button
          onClick={addSlot}
          className="bg-[#00AFEF] hover:bg-[#0095cc] text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Slot
        </Button>
      </div>

      {/* EMPTY */}
      {data.length === 0 && (
        <div className="border rounded-xl p-10 text-center text-muted-foreground">
          No availability slots added yet
        </div>
      )}

      {/* LIST */}
      {data.map((item, index) => (
        <Card key={item.id} className="p-5 space-y-5">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <p className="font-medium">
              Slot {index + 1}
            </p>

            <Button
              size="icon"
              variant="destructive"
              onClick={() => remove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-4">

            {/* START DATE */}
            <div className="space-y-1">
              <Label>Start Date</Label>
              <DateTimePicker
                value={item.start_date}
                showTime={false}
                onChange={(val) =>
                  update(item.id, "start_date", val)
                }
                className="w-full"
              />
            </div>

            {/* END DATE */}
            <div className="space-y-1">
              <Label>End Date</Label>
              <DateTimePicker
              showTime={false}
                value={item.end_date}
                onChange={(val) =>
                  update(item.id, "end_date", val)
                }
                className="w-full"
              />
            </div>

            {/* PRICE */}
            <div className="space-y-1">
              <Label>Price (INR)</Label>
              <Input
                type="number"
                value={item.price}
                onChange={(e) =>
                  update(item.id, "price", Number(e.target.value))
                }
              />
            </div>

            {/* TOTAL SLOTS */}
            <div className="space-y-1">
              <Label>Total Slots</Label>
              <Input
                type="number"
                value={item.total_slots}
                onChange={(e) =>
                  update(
                    item.id,
                    "total_slots",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            {/* AVAILABLE SLOTS */}
            <div className="space-y-1">
              <Label>Available Slots</Label>
              <Input
                type="number"
                value={item.available_slots}
                onChange={(e) =>
                  update(
                    item.id,
                    "available_slots",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <Label>Status</Label>

              <Select
                value={item.status}
                onValueChange={(val) =>
                  update(item.id, "status", val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
}