import StickyThemeToggle from "@/components/site/sticky-theme-toggle";
import RealtimeSection from "@/components/realtime-section";

export default function Page() {
  return (
    <main className="min-h-dvh bg-background text-foreground snap-y snap-mandatory">
      <StickyThemeToggle />
      <RealtimeSection />
    </main>
  );
}
