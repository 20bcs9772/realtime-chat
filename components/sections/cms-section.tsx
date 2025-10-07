"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import SkillModal from "@/components/skill-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Post = {
  id: string
  title: string
  tag: "engineering" | "product" | "devops"
}

const MOCK_POSTS: Post[] = [
  { id: "1", title: "Headless CMS with Payload", tag: "engineering" },
  { id: "2", title: "Modeling Collections & Relations", tag: "engineering" },
  { id: "3", title: "Preview Draft Content Safely", tag: "product" },
  { id: "4", title: "Webhooks & Cloud Deploys", tag: "devops" },
]

export default function CMSSection() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [tag, setTag] = useState<"all" | Post["tag"]>("all")

  const filtered = useMemo(() => {
    return MOCK_POSTS.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(q.toLowerCase())
      const matchesTag = tag === "all" ? true : p.tag === tag
      return matchesQuery && matchesTag
    })
  }, [q, tag])

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">CMS (Payload)</h2>
          <p className="mt-2 text-muted-foreground">Dynamic section populated from mock CMS data.</p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Learn more
        </Button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="p-4">
            <label className="text-sm font-medium">Search</label>
            <Input className="mt-2" placeholder="Search posts..." value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="mt-4">
              <label className="text-sm font-medium">Filter by tag</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["all", "engineering", "product", "devops"] as const).map((t) => (
                  <button
                    key={t}
                    className={`rounded-md border px-2 py-1 text-xs ${
                      tag === t ? "bg-muted" : "text-muted-foreground"
                    }`}
                    onClick={() => setTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 grid gap-3">
          {filtered.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">No results.</Card>
          ) : (
            filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">tag: {p.tag}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <SkillModal
        open={open}
        onClose={() => setOpen(false)}
        title="Payload CMS"
        description="Experience with custom schemas, access control, relation-rich content models, preview flows, and REST/GraphQL integrations. This demo simulates basic filtering and population from a CMS."
        github="#"
        demo="#"
      />
    </div>
  )
}
