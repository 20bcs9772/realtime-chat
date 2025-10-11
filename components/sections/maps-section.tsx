"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { UnderTheHood } from "@/components/under-the-hood";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "../ui/button";
import SkillModal from "../skill-modal";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Marker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  info: string;
};

const INITIAL_MARKERS: Marker[] = [
  {
    id: "delhi",
    name: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    info: "Capital region",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    info: "Financial hub",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    info: "Tech capital",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    info: "Cultural center",
  },
];

export default function MapsSection() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Marker | null>(null);
  const [markers, setMarkers] = useState<Marker[]>(INITIAL_MARKERS);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const byName = q.trim().toLowerCase();
    if (!byName) return markers;
    return markers.filter((m) => m.name.toLowerCase().includes(byName));
  }, [q, markers]);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [77.209, 28.6139],
        zoom: 4,
        interactive: true,
      });

      const resizeObserver = new ResizeObserver(() => {
        mapRef.current?.resize();
      });
      resizeObserver.observe(mapContainer.current);

      return () => {
        resizeObserver.disconnect();
        mapRef.current?.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Wait for map to load
    if (!map.loaded()) {
      map.on("load", () => {
        addMarkers();
      });
    } else {
      addMarkers();
    }

    function addMarkers() {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      markers.forEach((m) => {
        const el = document.createElement("div");
        el.className =
          "w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full cursor-pointer border-2 border-white shadow-lg hover:scale-125 transition-transform";
        el.addEventListener("click", () => setActive(m));

        const marker = new mapboxgl.Marker(el)
          .setLngLat([m.lng, m.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [markers]);

  const handleSearch = async (query: string) => {
    setQ(query);
    if (!query) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const newMarker: Marker = {
          id: feature.id,
          name: feature.text,
          lat: feature.center[1],
          lng: feature.center[0],
          info: feature.place_name,
        };
        setMarkers((prev) => [
          ...prev.filter((m) => m.id !== newMarker.id),
          newMarker,
        ]);
        mapRef.current?.flyTo({
          center: [newMarker.lng, newMarker.lat],
          zoom: 10,
        });
        setActive(newMarker);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <FullViewportSection id="maps-geo" ariaLabel="Maps & Geo">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Maps & Geo Features
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
                Click markers for details or type a location to highlight. Now
                using Mapbox.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <UnderTheHood text="Markers animate with Framer Motion; Mapbox provides real map and search." />
              <Button variant="outline" onClick={() => setOpen(true)}>
                Learn more
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 h-full">
              <div
                ref={mapContainer}
                className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-lg border"
              />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 h-full flex flex-col">
              <div className="mb-4 sm:mb-6">
                <label className="text-sm font-medium block mb-2">
                  Find a location
                </label>
                <Input
                  placeholder="Try 'Delhi' or 'Mumbai'..."
                  value={q}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="mb-4 sm:mb-6 flex-1">
                <div className="text-xs font-medium text-muted-foreground mb-3">
                  Matches ({filtered.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {filtered.length > 0 ? (
                    filtered.map((m) => (
                      <Badge
                        key={m.id}
                        variant={active?.id === m.id ? "default" : "secondary"}
                        className="cursor-pointer hover:opacity-80 transition-opacity text-xs sm:text-sm"
                        onClick={() => {
                          setActive(m);
                          mapRef.current?.flyTo({
                            center: [m.lng, m.lat],
                            zoom: 10,
                            duration: 1000,
                          });
                        }}
                      >
                        {m.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No matches found
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Selected Location
                </div>
                {active ? (
                  <div className="space-y-1">
                    <div className="font-semibold text-base sm:text-lg">
                      {active.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {active.info}
                    </div>
                    <div className="text-xs text-muted-foreground pt-2">
                      Lat: {active.lat.toFixed(4)}, Lng: {active.lng.toFixed(4)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    Click a marker on the map to view details
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <SkillModal
        open={open}
        onClose={() => setOpen(false)}
        title="Maps & Geolocation"
        description="Interactive mapping with Mapbox GL JS, featuring custom markers, real-time geocoding search, and smooth fly-to animations. Integrates Mapbox Geocoding API for location lookup and implements responsive map controls with user-friendly marker interactions."
        github="https://github.com/20bcs9772/YelpCamp"
        demo="https://yelpcamp-shw7.onrender.com/"
      />
    </FullViewportSection>
  );
}
