"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const STEPS = ["S3", "EC2", "R53"] as const

const TILES = [
  { id: "s3", label: "S3 Bucket", desc: "Static file hosting and object storage." },
  { id: "ec2", label: "EC2 Instance", desc: "Compute for services and apps." },
  { id: "alb", label: "Load Balancer", desc: "Distribute traffic across instances." },
]

export default function AwsCloudSection() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => ((s + 1) % 3) as any), 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">AWS & Cloud</h2>
      <div className="mt-6 grid gap-6">
        <Card className="p-5">
          <div className="text-lg font-semibold">Simplified Deployment Flow Visualizer</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Click through the steps to see a simulated CI/CD deployment to AWS.
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`grid place-items-center size-16 rounded-full border text-sm ${
                    i === step ? "bg-primary/10 ring-2 ring-primary" : "bg-card"
                  }`}
                >
                  {s}
                </div>
                {i < STEPS.length - 1 && <div className="w-20 h-0.5 bg-border" />}
              </div>
            ))}
            <Button className="shrink-0" onClick={() => setStep(((step + 1) % 3) as any)}>
              Next Step
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-lg font-semibold">Interactive AWS Service Diagram</div>
          <p className="mt-1 text-sm text-muted-foreground">Hover or click a service to learn more.</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TILES.map((t) => (
              <button
                key={t.id}
                className={`rounded-lg border bg-card p-4 text-left transition-all ${
                  active === t.id ? "ring-2 ring-primary scale-[1.01]" : "hover:bg-muted/40"
                }`}
                onClick={() => setActive(t.id)}
              >
                <div className="text-sm font-medium">{t.label}</div>
                <div className="mt-2 text-xs text-muted-foreground">{t.desc}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
