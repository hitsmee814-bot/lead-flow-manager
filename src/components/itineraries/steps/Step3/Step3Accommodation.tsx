"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Accommodation = {
  id: string; // UI only
  hotel_name: string;
  location: string;
  nights: number | "";
  meal_plan: string;
};

export default function Step3Accommodation({
  data,
  setData,
}: {
  data: Accommodation[];
  setData: (v: Accommodation[]) => void;
}) {
  const addHotel = () => {
    setData([
      ...data,
      {
        id: crypto.randomUUID(),
        hotel_name: "",
        location: "",
        nights: "",
        meal_plan: "CP",
      },
    ]);
  };

  const update = (id: string, key: keyof Accommodation, value: any) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  };

  const remove = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Accommodation</h2>
          <p className="text-sm text-muted-foreground">
            Add hotels for your itinerary
          </p>
        </div>

        <Button
          onClick={addHotel}
          className="bg-[#00AFEF] hover:bg-[#0095cc] text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {/* EMPTY */}
      {data.length === 0 && (
        <div className="border rounded-xl p-10 text-center text-muted-foreground">
          No accommodations added yet
        </div>
      )}

      {/* LIST */}
      {data.map((item, index) => (
        <Card key={item.id} className="p-5 space-y-5">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <p className="font-medium">
              {item.hotel_name || `Hotel ${index + 1}`}
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

            {/* HOTEL NAME */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Hotel Name
              </label>
              <Input
                placeholder="Greenwood Resort"
                value={item.hotel_name}
                onChange={(e) =>
                  update(item.id, "hotel_name", e.target.value)
                }
              />
            </div>

            {/* LOCATION */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Location
              </label>
              <Input
                placeholder="Tezpur"
                value={item.location}
                onChange={(e) =>
                  update(item.id, "location", e.target.value)
                }
              />
            </div>

            {/* NIGHTS */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Nights
              </label>
              <Input
                type="number"
                min={1}
                value={item.nights ?? ""}
                onChange={(e) =>
                  update(
                    item.id,
                    "nights",
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                  )
                }
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>

            {/* MEAL PLAN */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Meal Plan
              </label>

              <Select
                value={item.meal_plan}
                onValueChange={(val) =>
                  update(item.id, "meal_plan", val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal plan" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="EP">EP (Room Only)</SelectItem>
                  <SelectItem value="CP">CP (Breakfast)</SelectItem>
                  <SelectItem value="MAP">MAP (Breakfast + Dinner)</SelectItem>
                  <SelectItem value="AP">AP (All Meals)</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
}