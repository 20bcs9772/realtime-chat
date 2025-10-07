"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Order = { id: string; country: string; status: "paid" | "pending" | "failed"; amount: number }

const ORDERS: Order[] = [
  { id: "1", country: "IN", status: "paid", amount: 1200 },
  { id: "2", country: "IN", status: "pending", amount: 800 },
  { id: "3", country: "US", status: "paid", amount: 2400 },
  { id: "4", country: "IN", status: "failed", amount: 500 },
  { id: "5", country: "US", status: "paid", amount: 3200 },
  { id: "6", country: "DE", status: "pending", amount: 1500 },
]

export default function AdvancedQueriesSection() {
  const [status, setStatus] = useState<"all" | Order["status"]>("all")
  const [country, setCountry] = useState<"all" | "IN" | "US" | "DE">("all")
  const [minAmount, setMinAmount] = useState<string>("0")

  const filtered = useMemo(() => {
    const min = Number(minAmount || 0)
    return ORDERS.filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => (country === "all" ? true : o.country === country))
      .filter((o) => o.amount >= min)
  }, [status, country, minAmount])

  const aggByCountry = useMemo(() => {
    const m = new Map<string, number>()
    for (const o of filtered) m.set(o.country, (m.get(o.country) || 0) + o.amount)
    return Array.from(m.entries()).map(([c, sum]) => ({ country: c, sum }))
  }, [filtered])

  const queryPreview = {
    filter: {
      ...(status !== "all" ? { status } : {}),
      ...(country !== "all" ? { country } : {}),
      minAmount: Number(minAmount || 0),
    },
    sort: { by: "amount", dir: "desc" },
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">Advanced Queries</h2>
      <p className="mt-2 text-muted-foreground">
        Simulate complex data queries and real-time transformations to mirror backend logic.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Left: Query Builder + JSON Preview */}
        <Card className="p-4">
          <div className="text-lg font-semibold">Query Builder Simulator</div>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <label className="text-sm">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm">Country</label>
              <Select value={country} onValueChange={(v) => setCountry(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="IN">IN</SelectItem>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="DE">DE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm">Min Amount</label>
              <Input inputMode="numeric" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
            </div>

            <pre className="mt-4 rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
              {JSON.stringify(queryPreview, null, 2)}
            </pre>
          </div>
        </Card>

        {/* Right: Data Transformation Visualizer */}
        <Card className="p-4">
          <div className="text-lg font-semibold">Data Transformation Visualizer</div>
          <p className="mt-1 text-sm text-muted-foreground">Bars update live as you change the query.</p>
          <div className="mt-4 grid gap-4">
            <div className="rounded-md border bg-card p-4">
              <div className="grid grid-cols-3 gap-3 items-end h-40">
                {aggByCountry.map((r) => {
                  const max = Math.max(...aggByCountry.map((a) => a.sum), 1)
                  const h = Math.max(8, Math.round((r.sum / max) * 140))
                  return (
                    <div key={r.country} className="grid gap-2 justify-items-center">
                      <div className="w-10 rounded-sm bg-primary" style={{ height: h }} />
                      <span className="text-xs text-muted-foreground">{r.country}</span>
                    </div>
                  )
                })}
                {aggByCountry.length === 0 && (
                  <div className="text-xs text-muted-foreground">No data for current filters.</div>
                )}
              </div>
            </div>

            <div className="text-sm font-medium">Simulated Result Set</div>
            <div className="space-y-2">
              {filtered.map((o) => (
                <div key={o.id} className="rounded-md border bg-card p-3 text-xs">
                  ID: {o.id} — <span className="text-muted-foreground">Country: {o.country}</span> —{" "}
                  <span className="text-muted-foreground">Status: {o.status}</span> —{" "}
                  <span className="font-mono">{o.amount}</span>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-xs text-muted-foreground">No results.</div>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
