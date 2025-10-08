"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { UnderTheHood } from "@/components/under-the-hood";

type Log = { id: string; text: string };

export default function ApiIntegrationsSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("subscribe");
  const [logs, setLogs] = useState<Log[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

  const run = () => {
    setLogs([]);
    const add = (text: string, delay = 400) =>
      new Promise<void>((resolve) =>
        setTimeout(() => {
          setLogs((l) => [...l, { id: crypto.randomUUID(), text }]);
          resolve();
        }, delay)
      );
    (async () => {
      await add(`Preparing ${action} request...`);
      await add("Validating inputs...");
      await add(`Sending request for ${name} <${email}>`);
      await add("Processing on server...");
      await add("Response: 200 OK — { success: true }", 700);
    })();
  };

  return (
    <FullViewportSection
      id="api-integrations"
      ariaLabel="Third party API integrations"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Third-Party API Integrations
          </h2>
          <p className="mt-2 text-muted-foreground">
            Enter mock data and observe simulated, live response logs.
          </p>
        </div>
        <UnderTheHood text="Sequential async log updates via Promises; auto-scroll into view for latest entries." />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <div className="grid gap-3">
            <label className="text-sm font-medium">Action</label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Choose action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subscribe">Subscribe</SelectItem>
                <SelectItem value="create-order">Create Order</SelectItem>
                <SelectItem value="send-otp">Send OTP</SelectItem>
              </SelectContent>
            </Select>

            <label className="text-sm font-medium mt-4">Name</label>
            <Input
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="text-sm font-medium mt-4">Email</label>
            <Input
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button className="mt-4" onClick={run}>
              Run
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium">Live Response</div>
          <div
            ref={logRef}
            className="mt-3 h-56 overflow-auto rounded-md border bg-muted/30 p-3 space-y-2"
          >
            {logs.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <code className="text-xs">{l.text}</code>
              </motion.div>
            ))}
            {logs.length === 0 && (
              <div className="text-xs text-muted-foreground">
                No logs yet. Run a request.
              </div>
            )}
          </div>
        </Card>
      </div>
    </FullViewportSection>
  );
}
