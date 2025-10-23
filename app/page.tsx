import Hero from "@/components/sections/hero";
import SkillsTabs from "@/components/sections/skills-tabs";
import SkillsNavigation from "@/components/sections/skills-navigation";
import FloatingCTA from "@/components/site/floating-cta";
import StickyThemeToggle from "@/components/site/sticky-theme-toggle";
import Footer from "@/components/site/footer";

export default function Page() {
  return (
    <main className="min-h-dvh bg-background text-foreground snap-y snap-mandatory">
      <StickyThemeToggle />
      <Hero />
      <SkillsTabs />
      <SkillsNavigation />
      <FloatingCTA />
      <Footer />
    </main>
  );
}
