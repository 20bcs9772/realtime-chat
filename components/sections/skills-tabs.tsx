"use client";

import FrontendSection from "@/components/sections/frontend-section";
import BackendSection from "@/components/sections/backend-section";
import MapsSection from "@/components/sections/maps-section";
import ApiIntegrationsSection from "@/components/sections/api-integrations-section";
import AdvancedQueriesSection from "@/components/sections/advanced-queries-section";
import RealtimeSection from "@/components/sections/realtime-section";
import CMSAdvancedSection from "@/components/sections/cms-advanced-section";
import PaymentsSection from "@/components/sections/payments-section";
import DevOpsPipelineSection from "@/components/sections/devops-pipeline-section";

export default function SkillsTabs() {
  return (
    <section
      id="skills"
      className="container mx-auto px-4 py-16 md:py-24 snap-start"
    >
      <div className="space-y-16">
        {/* FRONTEND */}
        <div id="skills-frontend">
          <div className="space-y-8">
            <FrontendSection />
            <RealtimeSection />
          </div>
        </div>

        {/* BACKEND */}
        {/* <div id="skills-backend">
          <div className="space-y-8">
            <AdvancedQueriesSection />
            <BackendSection />
            <CMSAdvancedSection />
          </div>
        </div> */}

        {/* DEVOPS */}
        <div id="skills-devops">
          <div className="space-y-8">
            <DevOpsPipelineSection />
          </div>
        </div>

        {/* OTHERS */}
        <div id="skills-others">
          <div className="space-y-8">
            <MapsSection />
            {/* <ApiIntegrationsSection />
            <PaymentsSection /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
