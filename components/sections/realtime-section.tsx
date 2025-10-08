"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { UnderTheHood } from "@/components/under-the-hood";

type Msg = { id: string; from: "you" | "remote"; text: string };

export default function RealtimeSection() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m1", from: "remote", text: "Welcome to the live chat demo!" },
  ]);
  const [text, setText] = useState("");
  const [remoteTyping, setRemoteTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), from: "you", text: t },
    ]);
    setText("");
    // simulate remote typing + reply
    setRemoteTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), from: "remote", text: `Echo: ${t}` },
      ]);
      setRemoteTyping(false);
    }, 800);
  };

  return (
    <FullViewportSection id="realtime" ariaLabel="Realtime apps simulation">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Real-Time Apps (WebSockets)
          </h2>
          <p className="mt-2 text-muted-foreground">
            Live Chat and Typing Indicator simulated on the client to
            demonstrate real-time UX patterns.
          </p>
        </div>
        <UnderTheHood text="Simulated WS with timeouts; animated message entry and typing indicator via Framer Motion." />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Live Chat Demo</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Remote typing
              </span>
              <Switch
                checked={remoteTyping}
                onCheckedChange={setRemoteTyping}
              />
            </div>
          </div>
          <div
            ref={listRef}
            className="mt-4 h-56 overflow-auto rounded-md border bg-muted/30 p-3 space-y-2"
          >
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${
                  m.from === "you"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-card border"
                }`}
              >
                {m.text}
              </motion.div>
            ))}
            {remoteTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-1 rounded-md border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                <span>Remote is typing</span>
                <span className="animate-pulse">...</span>
              </motion.div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button onClick={send}>Send</Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">Typing Indicator Demo</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Immediate UI feedback shows users when a remote participant is
            typing. Toggle the switch in the chat demo to see it.
          </p>
          <motion.div
            className="mt-4 h-40 grid place-items-center rounded-md border bg-muted/30"
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-muted-foreground">
              Real-time UX without backend via clever UI state
            </span>
          </motion.div>
        </Card>
      </div>
    </FullViewportSection>
  );
}
