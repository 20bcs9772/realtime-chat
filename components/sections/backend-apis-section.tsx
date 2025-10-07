"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BackendApisSection() {
  const [endpoint, setEndpoint] = useState("/api/orders")
  const [method, setMethod] = useState<"GET" | "POST">("GET")
  const [body, setBody] = useState('{"status":"paid"}')
  const [response, setResponse] = useState<string>("{}")

  function simulate() {
    const now = new Date().toISOString()
    const res =
      method === "GET"
        ? { ok: true, endpoint, method, data: [{ id: 1, status: "paid" }], at: now }
        : { ok: true, endpoint, method, received: JSON.parse(body || "{}"), at: now }
    setResponse(JSON.stringify(res, null, 2))
  }

  return (
    <Card className="p-5">
      <div className="text-lg font-semibold">Backend APIs (Simulator)</div>
      <p className="mt-1 text-sm text-muted-foreground">
        Build/inspect mock requests and see simulated JSON responses.
      </p>
      <div className="mt-4 grid gap-3">
        <div className="grid gap-1">
          <label className="text-sm">Endpoint</label>
          <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Method</label>
          <div className="flex gap-2">
            <Button variant={method === "GET" ? "default" : "outline"} onClick={() => setMethod("GET")}>
              GET
            </Button>
            <Button variant={method === "POST" ? "default" : "outline"} onClick={() => setMethod("POST")}>
              POST
            </Button>
          </div>
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Body (JSON)</label>
          <textarea
            className="rounded-md border bg-card p-3 text-sm font-mono leading-6"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <Button onClick={simulate}>Send</Button>
        <pre className="rounded-md border bg-muted/40 p-3 text-xs leading-relaxed overflow-x-auto">{response}</pre>
      </div>
    </Card>
  )
}
