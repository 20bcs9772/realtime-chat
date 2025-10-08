"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { UnderTheHood } from "@/components/under-the-hood";

type CT = "Post" | "Product" | "Doc";

const PREVIEWS: Record<CT, { title: string; body: string; fields: string[] }> =
  {
    Post: {
      title: "Introducing Payload CMS",
      body: "Model content, manage access, and ship fast with a headless CMS.",
      fields: [
        "title:string",
        "slug:string",
        "author:relation",
        "content:richtext",
        "tags:array",
      ],
    },
    Product: {
      title: "Pro Plan",
      body: "Best for teams building production apps. Includes premium SLAs.",
      fields: [
        "name:string",
        "price:number",
        "features:array",
        "images:media",
        "inventory:number",
      ],
    },
    Doc: {
      title: "API Reference",
      body: "Endpoints, parameters, and example responses to integrate quickly.",
      fields: [
        "title:string",
        "sections:array",
        "version:string",
        "changelog:array",
      ],
    },
  };

export default function CMSAdvancedSection() {
  const [ct, setCt] = useState<CT>("Post");
  const [showSchema, setShowSchema] = useState(true);

  const content = useMemo(() => PREVIEWS[ct], [ct]);

  return (
    <FullViewportSection
      id="cms-advanced"
      ariaLabel="Payload CMS dynamic preview"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Payload CMS — Dynamic Preview
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select a content type and toggle schema visualization.
          </p>
        </div>
        <UnderTheHood text="Controlled selects/switches drive preview and schema panels; motion-based reveal on scroll." />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <div className="grid gap-3">
            <label className="text-sm font-medium">Content Type</label>
            <Select value={ct} onValueChange={(v) => setCt(v as CT)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Post">Post</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Doc">Doc</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 flex items-center gap-2">
              <Switch checked={showSchema} onCheckedChange={setShowSchema} />
              <span className="text-sm">Schema Visualization</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">{content.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{content.body}</p>
          <motion.div
            className="mt-4 h-28 rounded-md border bg-muted/30 grid place-items-center"
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-muted-foreground">
              Simulated live content preview
            </span>
          </motion.div>
        </Card>

        <Card className="p-4 md:col-span-2">
          <h3 className="font-semibold">Schema</h3>
          {showSchema ? (
            <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {content.fields.map((f) => (
                <div key={f} className="rounded-md border bg-card p-3 text-xs">
                  <span className="font-mono">{f}</span>
                  <p className="mt-1 text-muted-foreground">
                    Field <span className="font-mono">{f.split(":")[0]}</span>{" "}
                    defines content structure and validation.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Schema hidden.</p>
          )}
        </Card>
      </div>
    </FullViewportSection>
  );
}
