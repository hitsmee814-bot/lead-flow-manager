"use client";

import ItineraryBuilder from "@/components/itineraries/ItineraryBuilder";
import ItineraryList from "@/components/itineraries/ItineraryList";
import { useState } from "react";

export default function Itineraries() {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);

  // ✅ used to force re-fetch of list
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshList = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
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

      {/* LIST VIEW */}
      {mode === "list" && (
        <ItineraryList
          key={refreshKey}   // ✅ forces remount → refetch
          onEdit={(item: any) => {
            setSelectedItinerary(item);
            setMode("edit");
          }}
          onPreview={(item) => console.log(item)}
        />
      )}

      {/* CREATE / EDIT VIEW */}
      {(mode === "create" || mode === "edit") && (
        <ItineraryBuilder
          itineraryData={selectedItinerary}
          onCancel={() => {
            setMode("list");
            setSelectedItinerary(null);
          }}
          onSuccess={refreshList} // ✅ triggers list refresh
        />
      )}
    </div>
  );
}