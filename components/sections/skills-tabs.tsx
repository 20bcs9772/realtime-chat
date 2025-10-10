"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FrontendSection from "@/components/sections/frontend-section";
import BackendSection from "@/components/sections/backend-section";
import MapsSection from "@/components/sections/maps-section";
import ApiIntegrationsSection from "@/components/sections/api-integrations-section";
import AdvancedQueriesSection from "@/components/sections/advanced-queries-section";
import RealtimeSection from "@/components/sections/realtime-section";
import CMSAdvancedSection from "@/components/sections/cms-advanced-section";
import PaymentsSection from "@/components/sections/payments-section";
import DevOpsPipelineSection from "@/components/sections/devops-pipeline-section";

type TabKey = "frontend" | "backend" | "devops" | "others";

function readHash(): TabKey {
  const h = (
    typeof window !== "undefined" ? window.location.hash : ""
  ).toLowerCase();
  if (h.includes("skills-frontend")) return "frontend";
  if (h.includes("skills-backend")) return "backend";
  if (h.includes("skills-devops")) return "devops";
  if (h.includes("skills-others")) return "others";
  // tolerate legacy anchors
  if (h.includes("skills-realtime")) return "others";
  return "frontend";
}

export default function SkillsTabs() {
  const [tab, setTab] = useState<TabKey>("frontend");

  useEffect(() => {
    setTab(readHash());
    const handler = () => setTab(readHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    // keep URL in sync without pushing history entries
    const newHash = `#skills-${tab}`;
    if (window.location.hash !== newHash) {
      history.replaceState({}, "", newHash);
    }
  }, [tab]);

  const description = useMemo(
    () => ({
      frontend:
        "Micro‑interactions, Interactive 3D UI, and Dynamic Components — all full‑screen & responsive.",
      backend: "Advanced queries, backend APIs, and Payload CMS simulations.",
      devops:
        "AWS deployment flow, interactive service diagram, and GitHub CI/CD showcase.",
      others: "Maps & geo, third‑party integrations, and payment gateways.",
    }),
    []
  );

  return (
    <section id="skills" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-pretty">Skills</h2>
        <p className="text-muted-foreground mt-2">{description[tab]}</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="mb-6 md:mb-8">
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="devops">DevOps</TabsTrigger>
          <TabsTrigger value="others">Others</TabsTrigger>
        </TabsList>

        {/* FRONTEND */}
        <TabsContent value="frontend">
          <div id="skills-frontend" />
          <div className="space-y-8">
            <FrontendSection />
            <RealtimeSection />
          </div>
        </TabsContent>

        {/* BACKEND */}
        <TabsContent value="backend">
          <div id="skills-backend" />
          <div className="space-y-8">
            <AdvancedQueriesSection />
            <BackendSection />
            <CMSAdvancedSection />
          </div>
        </TabsContent>

        {/* DEVOPS */}
        <TabsContent value="devops">
          <div id="skills-devops" />
          <div className="space-y-8">
            <DevOpsPipelineSection />
          </div>
        </TabsContent>

        {/* OTHERS */}
        <TabsContent value="others">
          <div id="skills-others" />
          <div className="space-y-8">
            <MapsSection />
            <ApiIntegrationsSection />
            <PaymentsSection />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
