"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { UnderTheHood } from "@/components/under-the-hood";

export default function PaymentsSection() {
  const [provider, setProvider] = useState<"razorpay" | "stripe">("razorpay");
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

  const pay = () => {
    setLogs([]);
    const add = (t: string, delay = 400) =>
      new Promise<void>((r) =>
        setTimeout(() => (setLogs((l) => [...l, t]), r()), delay)
      );
    (async () => {
      await add(`Provider selected: ${provider}`);
      await add("Creating order...");
      await add("Redirecting to checkout...");
      await add("Payment success ✔", 700);
    })();
  };

  return (
    <FullViewportSection id="payments" ariaLabel="Payment gateways">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Payment Gateways</h2>
          <p className="mt-2 text-muted-foreground">
            Mock checkout flow and API snippet viewer (Razorpay/Stripe).
          </p>
        </div>
        <UnderTheHood text="State-driven mock checkout; tabbed code viewer using Radix Tabs from shadcn/ui." />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <div className="text-sm font-medium">Mock Checkout</div>
          <div className="mt-3 rounded-md border bg-muted/30 p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Pro Subscription</span>
              <span>₹1,999</span>
            </div>
          </div>
          <div className="mt-4">
            <RadioGroup
              value={provider}
              onValueChange={(v) => setProvider(v as any)}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center gap-2 rounded-md border p-3">
                <RadioGroupItem id="razorpay" value="razorpay" />
                <Label htmlFor="razorpay">Razorpay</Label>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3">
                <RadioGroupItem id="stripe" value="stripe" />
                <Label htmlFor="stripe">Stripe</Label>
              </div>
            </RadioGroup>
            <Button className="mt-4" onClick={pay}>
              Pay now
            </Button>
          </div>
          <div
            ref={logRef}
            className="mt-4 h-40 overflow-auto rounded-md border bg-muted/30 p-3 space-y-2"
          >
            {logs.map((t, i) => (
              <motion.div
                key={`${t}-${i}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <code className="text-xs">{t}</code>
              </motion.div>
            ))}
            {logs.length === 0 && (
              <div className="text-xs text-muted-foreground">
                No events yet.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium">API Snippet Viewer</div>
          <Tabs defaultValue="razorpay" className="mt-3">
            <TabsList>
              <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
              <TabsTrigger value="stripe">Stripe</TabsTrigger>
            </TabsList>
            <TabsContent value="razorpay">
              <pre className="mt-3 overflow-auto rounded-md border bg-card p-3 text-xs">
                <code>{`// Razorpay order creation (Node.js)
app.post("/create-order", async (req, res) => {
  const order = await razorpay.orders.create({ amount: 199900, currency: "INR" })
  res.json(order)
})`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="stripe">
              <pre className="mt-3 overflow-auto rounded-md border bg-card p-3 text-xs">
                <code>{`// Stripe checkout session (Node.js)
app.post("/create-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: "price_123", quantity: 1 }],
    success_url: "https://example.com/success",
  })
  res.json(session)
})`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </FullViewportSection>
  );
}
