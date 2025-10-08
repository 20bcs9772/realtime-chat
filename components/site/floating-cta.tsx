"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    const subject = "Loved your portfolio";
    const body = `Hi Madhav,\n\nName: ${name}\nEmail: ${email}\n\n${message}\n`;
    const link = `mailto:bansalmadhav787@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = link;
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40"
        aria-label="Let's build something"
      >
        <MessageSquare /> Let's build something
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Contact</DrawerTitle>
            <DrawerDescription>
              Send a quick message — no redirects.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 grid gap-3">
            <div className="grid gap-1">
              <label className="text-sm">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to build?"
                rows={5}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={submit}>Send email</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
