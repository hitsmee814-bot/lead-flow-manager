"use client";

import ItineraryBuilder from "@/components/itineraries/ItineraryBuilder";
import ItineraryList from "@/components/itineraries/ItineraryList";
import { useState } from "react";

export default function Itineraries() {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Itineraries</h1>
          <p className="text-sm text-gray-500">
            Manage and create tour packages
          </p>
        </div>

        {mode === "list" && (
          <button
            onClick={() => setMode("create")}
            className="px-4 py-2 bg-[#00AFEF] text-white rounded-md"
          >
            + Create Itinerary
          </button>
        )}
      </div>

      {mode === "list" && (
        <ItineraryList
          onEdit={(item:any) => {
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
        />
      )}
    </div>
  );
}