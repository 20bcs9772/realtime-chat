import Navbar from "@/components/site/navbar"
import Hero from "@/components/sections/hero"
import SkillsTabs from "@/components/sections/skills-tabs"

export default function Page() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <Hero />
      <SkillsTabs />
      <footer id="contact" className="border-t">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Madhav Bansal. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <a href="mailto:bansalmadhav787@gmail.com" className="underline underline-offset-4 hover:no-underline">
                bansalmadhav787@gmail.com
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="#top" className="text-sm text-muted-foreground hover:text-foreground">
                Back to top
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
