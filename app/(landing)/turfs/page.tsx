"use client";

import { useState } from "react";
import SectorReconSearch from "@/app/(landing)/turfs/(components)/SectorReconSearch";
import TurfResultsGrid from "@/app/(landing)/turfs/(components)/TurfResultsGrid";
import { Turf } from "@/types/types";

const ALL_TURFS: Turf[] = [
  {
    id: "1",
    name: "Wembley Elite Hub",
    area: "Westlands",
    city: "Nairobi",
    rating: 4.9,
    amenities: ["Floodlights", "Changing Rooms", "Cafe"],
    mapsQuery: "Wembley Elite Hub Westlands Nairobi",
  },
  {
    id: "2",
    name: "Central Sector 7",
    area: "Kilimani",
    city: "Nairobi",
    rating: 4.7,
    amenities: ["Parking", "Water Stations", "Tactical Boards"],
    mapsQuery: "Central Sector 7 Kilimani Nairobi",
  },
  {
    id: "3",
    name: "Dome Complex",
    area: "Langata",
    city: "Nairobi",
    rating: 4.8,
    amenities: ["Indoor Pitch", "Gym", "Recovery Zone"],
    mapsQuery: "Dome Complex Langata Nairobi",
  },
  {
    id: "4",
    name: "Eastlands Arena",
    area: "Eastlands",
    city: "Nairobi",
    rating: 4.5,
    amenities: ["Floodlights", "Parking", "Cafe"],
    mapsQuery: "Eastlands Arena Nairobi",
  },
  {
    id: "5",
    name: "Karen Sports Ground",
    area: "Karen",
    city: "Nairobi",
    rating: 4.6,
    amenities: ["Changing Rooms", "Gym", "Water Stations"],
    mapsQuery: "Karen Sports Ground Nairobi",
  },
  {
    id: "6",
    name: "Kasarani Tactical Hub",
    area: "Kasarani",
    city: "Nairobi",
    rating: 4.4,
    amenities: ["Indoor Pitch", "Tactical Boards", "Recovery Zone"],
    mapsQuery: "Kasarani Tactical Hub Nairobi",
  },
];

export default function TurfsPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Turf[]>([]);

  const handleScan = () => {
    setSearched(true);
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults(ALL_TURFS);
      return;
    }
    setResults(
      ALL_TURFS.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.area.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.amenities.some((a) => a.toLowerCase().includes(q)),
      ),
    );
  };

  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100 pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
          Available Turfs
        </h1>
        <p className="text-xs font-black tracking-widest text-slate-500 mb-10">
          Real-time grounded search on Kenyan pitches and training
          facilities.
        </p>

        <SectorReconSearch
          value={query}
          onChange={setQuery}
          onScan={handleScan}
        />

        <div className="mt-8">
          <TurfResultsGrid turfs={results} searched={searched} />
        </div>
      </div>
    </div>
  );
}
