"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DayCard from "./DayCard";

export default function Step2ItineraryDays({
  data,
  setData,
}: {
  data: any[];
  setData: (d: any[]) => void;
}) {
  const addDay = () => {
    setData([
      ...data,
      {
        id: crypto.randomUUID(),
        day_number: data.length + 1,
        title: "",
        description: "",
        activities: [],
        images: [],
        open: true,
      },
    ]);
  };

  const updateDay = (id: string, key: string, value: any) => {
    setData(
      data.map((d) =>
        d.id === id ? { ...d, [key]: value } : d
      )
    );
  };

  const deleteDay = (id: string) => {
    const updated = data
      .filter((d) => d.id !== id)
      .map((d, i) => ({
        ...d,
        day_number: i + 1, // 🔥 re-order days
      }));

    setData(updated);
  };

  const copyDay = (id: string) => {
    const day = data.find((d) => d.id === id);
    if (!day) return;

    setData([
      ...data,
      {
        ...day,
        id: crypto.randomUUID(),
        day_number: data.length + 1,
      },
    ]);
  };

  const addActivity = (dayId: string) => {
    setData(
      data.map((d) =>
        d.id === dayId
          ? {
              ...d,
              activities: [
                ...d.activities,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  type: "included",
                  description: "",
                  latitude: "",
                  longitude: "",
                },
              ],
            }
          : d
      )
    );
  };

  const updateActivity = (
    dayId: string,
    actId: string,
    key: string,
    value: any
  ) => {
    setData(
      data.map((d) =>
        d.id === dayId
          ? {
              ...d,
              activities: d.activities.map((a: any) =>
                a.id === actId ? { ...a, [key]: value } : a
              ),
            }
          : d
      )
    );
  };

  const deleteActivity = (dayId: string, actId: string) => {
    setData(
      data.map((d) =>
        d.id === dayId
          ? {
              ...d,
              activities: d.activities.filter(
                (a: any) => a.id !== actId
              ),
            }
          : d
      )
    );
  };

  const addImage = (dayId: string) => {
    setData(
      data.map((d) =>
        d.id === dayId
          ? {
              ...d,
              images: [
                ...d.images,
                {
                  id: crypto.randomUUID(),
                  image_url: "",
                  caption: "",
                },
              ],
            }
          : d
      )
    );
  };

  const updateImage = (
    dayId: string,
    imgId: string,
    key: string,
    value: any
  ) => {
    setData(
      data.map((d) =>
        d.id === dayId
          ? {
              ...d,
              images: d.images.map((img: any) =>
                img.id === imgId
                  ? { ...img, [key]: value }
                  : img
              ),
            }
          : d
      )
    );
  };

  const deleteImage = (dayId: string, imgId: string) => {
    setData(
      data.map((d) =>
        d.id === dayId
          ? {
              ...d,
              images: d.images.filter(
                (img: any) => img.id !== imgId
              ),
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Itinerary Days
        </h2>

        <Button
          onClick={addDay}
          className="bg-[#00AFEF] text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Day
        </Button>
      </div>

      {data.length === 0 && (
        <div className="border rounded-xl p-10 text-center text-muted-foreground">
          No days added yet
          <div className="mt-3">
            <Button
              onClick={addDay}
              className="bg-[#00AFEF] text-white"
            >
              Add First Day
            </Button>
          </div>
        </div>
      )}

      {data.map((day, i) => (
        <DayCard
          key={day.id}
          day={day}
          index={i}
          updateDay={updateDay}
          copyDay={copyDay}
          deleteDay={deleteDay}
          addActivity={addActivity}
          updateActivity={updateActivity}
          deleteActivity={deleteActivity}
          addImage={addImage}
          updateImage={updateImage}
          deleteImage={deleteImage}
        />
      ))}
    </div>
  );
}