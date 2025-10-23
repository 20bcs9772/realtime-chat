"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickyThemeToggle from "@/components/site/sticky-theme-toggle";
import Footer from "@/components/site/footer";

const productionApps = [
  {
    name: "Skuchain",
    description:
      "Supply chain management platform for buyers and sellers leveraging blockchain technology",
    technologies: ["React", "Node.js", "AWS", "MongoDB"],
    link: "https://skuchain.com",
  },
  {
    name: "Oceaniek Stream",
    description:
      "Subscription-based streaming service for movies, shows, music, and live streams",
    technologies: ["Next.js", "AWS", "Razorpay"],
    link: "https://oceaniekstream.com",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground flex flex-col">
      <StickyThemeToggle />

      <section className="container mx-auto px-4 py-12 md:py-20 flex-1">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <header className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Know Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-3 text-muted-foreground"
          >
            A glimpse into my professional journey and background.
          </motion.p>
        </header>

        <div className="mt-12 space-y-10">
          {/* Timeline Section */}
          <section aria-labelledby="summary-heading" className="relative pl-6">
            <div
              className="absolute left-0 top-0 h-full w-px bg-muted/50"
              aria-hidden
            />
            <div
              className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
              aria-hidden
            />
            <h2
              id="summary-heading"
              className="text-xl md:text-2xl font-semibold"
            >
              Professional Summary
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              I'm <span className="font-medium">Madhav Bansal</span>, a Full
              Stack Developer focused on creating innovative, efficient web
              solutions. I translate complex requirements into user‑friendly
              apps across frontend, backend, and cloud—leveraging React/Next.js,
              Node.js, real‑time systems, Payload CMS, AWS, integrations
              (Razorpay/Stripe/Maps), and robust data modeling.
            </p>
          </section>

          <section aria-labelledby="work-heading" className="relative pl-6">
            <div
              className="absolute left-0 top-0 h-full w-px bg-muted/50"
              aria-hidden
            />
            <div
              className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
              aria-hidden
            />
            <h2 id="work-heading" className="text-xl md:text-2xl font-semibold">
              Work Experience
            </h2>
            <div className="mt-4 space-y-6">
              <div>
                <div className="font-medium">
                  Oceaniek Technologies — Full Stack Developer
                </div>
                <div className="text-xs text-muted-foreground">
                  Feb 2025 – Present
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Building production‑grade UIs with Next.js and integrating
                  secure payments, real‑time features, and CI/CD to AWS.
                </p>
              </div>
              <div>
                <div className="font-medium">
                  Cybernext — Software Development Engineer
                </div>
                <div className="text-xs text-muted-foreground">
                  Jul 2024 – Feb 2025
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Delivered backend APIs, query optimizations, and dashboards
                  with a11y‑first, responsive design.
                </p>
              </div>
              <div>
                <div className="font-medium">Complykart — Intern</div>
                <div className="text-xs text-muted-foreground">
                  Jun – Jul 2022
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contributed to UI components and API wiring; learned code
                  reviews and team workflows.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="edu-heading" className="relative pl-6">
            <div
              className="absolute left-0 top-0 h-full w-px bg-muted/50"
              aria-hidden
            />
            <div
              className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
              aria-hidden
            />
            <h2 id="edu-heading" className="text-xl md:text-2xl font-semibold">
              Education
            </h2>
            <div className="mt-4">
              <div className="font-medium">
                BE in Computer Science — Chandigarh University
              </div>
              <div className="text-xs text-muted-foreground">
                2020 – 2024 • CGPA 8.49
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Coursework in data structures, DBMS, OS, networking, with
                projects in full‑stack web and mobile.
              </p>
            </div>
          </section>

          <section aria-labelledby="skills-heading" className="relative pl-6">
            <div
              className="absolute left-0 top-0 h-full w-px bg-muted/50"
              aria-hidden
            />
            <div
              className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
              aria-hidden
            />
            <h2
              id="skills-heading"
              className="text-xl md:text-2xl font-semibold"
            >
              Skills Snapshot
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <div className="font-medium">Frontend</div>
                <p className="text-muted-foreground">
                  React, Next.js, Tailwind, shadcn/ui, Framer Motion,
                  performance & a11y
                </p>
              </div>
              <div>
                <div className="font-medium">Backend</div>
                <p className="text-muted-foreground">
                  Node.js, Express, REST, WebSockets, auth, queries
                </p>
              </div>
              <div>
                <div className="font-medium">CMS</div>
                <p className="text-muted-foreground">
                  Payload CMS (schemas, previews, access)
                </p>
              </div>
              <div>
                <div className="font-medium">Cloud & DevOps</div>
                <p className="text-muted-foreground">
                  AWS (S3, EC2, Route 53, Amplify, ALB, EFS), CI/CD
                </p>
              </div>
              <div>
                <div className="font-medium">Integrations</div>
                <p className="text-muted-foreground">
                  Razorpay, Stripe, Maps, various third‑party APIs
                </p>
              </div>
              <div>
                <div className="font-medium">Tools</div>
                <p className="text-muted-foreground">
                  TypeScript, Git, Linux, Postman
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/#skills"
                className="text-sm underline underline-offset-4 hover:no-underline"
              >
                Explore my interactive skills
              </Link>
            </div>
          </section>

          <section aria-labelledby="apps-heading" className="relative pl-6">
            <div
              className="absolute left-0 top-0 h-full w-px bg-muted/50"
              aria-hidden
            />
            <div
              className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"
              aria-hidden
            />
            <h2 id="apps-heading" className="text-xl md:text-2xl font-semibold">
              Production Apps
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-world applications I've built and deployed at scale
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {productionApps.map((app) => (
                <motion.div
                  key={app.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg md:text-xl font-semibold">
                        {app.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {app.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
