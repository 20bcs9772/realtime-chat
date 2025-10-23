"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const skillCategories = [
  {
    name: "Frontend",
    description: "React, Next.js, Tailwind, Animations",
    href: "#skills-frontend",
  },
  {
    name: "Backend",
    description: "Node.js, Express, APIs, Databases",
    href: "#skills-backend",
  },
  {
    name: "DevOps",
    description: "AWS, CI/CD, Infrastructure",
    href: "#skills-devops",
  },
  {
    name: "Others",
    description: "Maps, Payments, Integrations",
    href: "#skills-others",
  },
];

export default function SkillsNavigation() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 snap-start">
      <div className="mb-8">
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-semibold text-pretty"
        >
          Explore Skills by Category
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-sm text-muted-foreground mt-2"
        >
          Jump to any skill category to see interactive demos
        </motion.p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((category, idx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              variant="outline"
              className="w-full h-auto flex flex-col items-start justify-start p-4 hover:bg-muted bg-transparent"
            >
              <a href={category.href}>
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-semibold text-base">
                    {category.name}
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  {category.description}
                </p>
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
