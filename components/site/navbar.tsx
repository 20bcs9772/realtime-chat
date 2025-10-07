"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const links = [
  { href: "#frontend", label: "Frontend & Animation" },
  { href: "#backend", label: "Backend APIs" },
  { href: "#cms", label: "CMS (Payload)" },
  { href: "#realtime", label: "Real-Time Apps" },
  { href: "#apis", label: "3rd-Party APIs" },
  { href: "#payload-advanced", label: "Payload Advanced" },
  { href: "#maps", label: "Maps & Geo" },
  { href: "#aws", label: "AWS & Cloud" },
  { href: "#payments", label: "Payments" },
  { href: "#advanced-queries", label: "Advanced Queries" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const SkillItems = () => (
    <>
      <DropdownMenuItem asChild>
        <a href="#skills-frontend">Frontend</a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href="#skills-backend">Backend</a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href="#skills-devops">DevOps</a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href="#skills-others">Others</a>
      </DropdownMenuItem>
    </>
  )

  return (
    <header
      id="top"
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b" : ""
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          <span className="sr-only">Madhav Bansal</span>
          <div aria-hidden className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary" />
            <span className="text-sm md:text-base">Madhav Bansal</span>
          </div>
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Skills
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <SkillItems />
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" variant="secondary" className="hidden md:inline-flex">
            <a href="mailto:bansalmadhav787@gmail.com">Contact</a>
          </Button>
        </div>
      </nav>

      {/* mobile */}
      <div className="md:hidden border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Skills
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <SkillItems />
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Button asChild size="sm" variant="secondary">
              <a href="mailto:bansalmadhav787@gmail.com">Contact</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
