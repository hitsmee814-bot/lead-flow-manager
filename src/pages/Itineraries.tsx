"use client";

import { AppHeader } from "@/components/common/AppHeader";
import ItineraryBuilder from "@/components/itineraries/ItineraryBuilder";
import ItineraryList from "@/components/itineraries/ItineraryList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
export default function Itineraries() {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshList = () => setRefreshKey((p) => p + 1);

  return (
    <div className="space-y-6">

      {/* ✅ SAME HEADER */}
      <AppHeader
        title="Bonhomiee"
        subtitle="Itinerary Management"
        rightActions={
          mode === "list" && (
            <Button
              onClick={() => setMode("create")}
              className="bg-[#00AFEF] text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Itinerary
            </Button>
          )
        }
      />

      {/* BODY */}
      <div className="px-6">
        {mode === "list" && (
          <ItineraryList
            key={refreshKey}
            onEdit={(item: any) => {
              setSelectedItinerary(item);
              setMode("edit");
            }}
            onPreview={(item) => console.log(item)}
          />
        )}

        {(mode === "create" || mode === "edit") && (
          <ItineraryBuilder
            itineraryData={selectedItinerary}
            onCancel={() => {
              setMode("list");
              setSelectedItinerary(null);
            }}
            onSuccess={refreshList}
          />
        )}
      </div>
    </div>
  );
}