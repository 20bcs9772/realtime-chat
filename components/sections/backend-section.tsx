"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import SkillModal from "@/components/skill-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Panel = "request" | "response"

export default function BackendSection() {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState<Panel>("request")

  const request = {
    method: "POST",
    url: "/api/checkout",
    body: { amount: 1999, currency: "INR", userId: "usr_123" },
    headers: { "Content-Type": "application/json" },
  }

  const response = {
    status: 200,
    body: { id: "txn_abc123", success: true, message: "Payment initiated" },
    headers: { "x-request-id": "req_987" },
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Backend (Node.js + Express)</h2>
          <p className="mt-2 text-muted-foreground">API request/response visualization and mock flow.</p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Learn more
        </Button>
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="flex items-center gap-2 border-b bg-muted/40 p-2">
          <button
            className={cn(
              "rounded-md px-3 py-1 text-sm",
              panel === "request" ? "bg-background" : "text-muted-foreground",
            )}
            onClick={() => setPanel("request")}
          >
            Request
          </button>
          <button
            className={cn(
              "rounded-md px-3 py-1 text-sm",
              panel === "response" ? "bg-background" : "text-muted-foreground",
            )}
            onClick={() => setPanel("response")}
          >
            Response
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          <motion.pre
            initial={{ opacity: 0.6 }}
            animate={{ opacity: panel === "request" ? 1 : 0.6 }}
            transition={{ duration: 0.25 }}
            className="m-0 p-4 text-xs md:text-sm border-r overflow-auto bg-card"
          >
            <code>{JSON.stringify(request, null, 2)}</code>
          </motion.pre>
          <motion.pre
            initial={{ opacity: 0.6 }}
            animate={{ opacity: panel === "response" ? 1 : 0.6 }}
            transition={{ duration: 0.25 }}
            className="m-0 p-4 text-xs md:text-sm overflow-auto bg-card"
          >
            <code>{JSON.stringify(response, null, 2)}</code>
          </motion.pre>
        </div>
      </Card>

      <SkillModal
        open={open}
        onClose={() => setOpen(false)}
        title="Backend APIs"
        description="REST APIs with Node.js and Express, including authentication, authorization, real-time via WebSockets, and secure integrations (Stripe/Razorpay). Emphasis on validation and clean error handling."
        github="#"
        demo="#"
      />
    </div>
  )
}
