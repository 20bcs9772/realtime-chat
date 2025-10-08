"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { UnderTheHood } from "@/components/under-the-hood";

type Marker = { id: string; name: string; x: number; y: number; info: string };

const MARKERS: Marker[] = [
  { id: "delhi", name: "Delhi", x: 65, y: 30, info: "Capital region" },
  { id: "mumbai", name: "Mumbai", x: 45, y: 65, info: "Financial hub" },
  { id: "bengaluru", name: "Bengaluru", x: 55, y: 75, info: "Tech capital" },
  { id: "kolkata", name: "Kolkata", x: 85, y: 55, info: "Cultural center" },
];

export default function MapsSection() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Marker | null>(null);

  const filtered = useMemo(() => {
    const byName = q.trim().toLowerCase();
    if (!byName) return MARKERS;
    return MARKERS.filter((m) => m.name.toLowerCase().includes(byName));
  }, [q]);

  return (
    <FullViewportSection id="maps-geo" ariaLabel="Maps & Geo">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Maps & Geo Features
          </h2>
          <p className="mt-2 text-muted-foreground">
            Click markers for details or type a location to highlight. Pure
            front-end simulation (no map SDK).
          </p>
        </div>
        <UnderTheHood text="Framer Motion animates markers; simple hit testing and filtering. All coordinates are normalized percentages." />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="p-4 md:col-span-2">
          <div className="relative aspect-[16/10] rounded-md border bg-muted/20">
            {MARKERS.map((m) => {
              const isDimmed = q && !filtered.some((f) => f.id === m.id);
              const isSelected = active?.id === m.id;
              return (
                <motion.button
                  key={m.id}
                  className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: isDimmed ? 0.35 : 1 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActive(m)}
                  aria-label={`Marker ${m.name}`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full ring-2 ${
                      isSelected
                        ? "bg-primary ring-primary"
                        : "bg-foreground ring-background"
                    }`}
                  />
                </motion.button>
              );
            })}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="text-xs text-muted-foreground">
                Stylized map placeholder
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <label className="text-sm font-medium">Find a location</label>
          <Input
            className="mt-2"
            placeholder="Try 'Delhi' or 'Mumbai'..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground">Matches</div>
            <div className="flex flex-wrap gap-2">
              {filtered.map((m) => (
                <Badge
                  key={m.id}
                  variant={active?.id === m.id ? "default" : "secondary"}
                  onClick={() => setActive(m)}
                >
                  {m.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4">
            {active ? (
              <div className="text-sm">
                <div className="font-medium">{active.name}</div>
                <div className="text-muted-foreground">{active.info}</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Select a marker to view details.
              </div>
            )}
          </div>
        </Card>
      </div>
    </FullViewportSection>
  );
}
