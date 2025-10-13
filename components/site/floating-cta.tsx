"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X } from "lucide-react";

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
        className="fixed bottom-4 right-4 z-40 shadow-lg"
        size="default"
        aria-label="Let's build something"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Let's build something</span>
        <span className="sm:hidden">Contact</span>
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Popup */}
          <div className="fixed bottom-4 right-4 sm:bottom-20 sm:right-4 z-50 w-full sm:w-96 max-w-[calc(100vw-2rem)] sm:max-w-96 bg-white dark:bg-gray-950 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom-5 duration-300 max-h-[90vh] sm:max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Contact
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Send a quick message — no redirects.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 -mt-1 -mr-1 flex-shrink-0"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 grid gap-3 overflow-y-auto flex-1">
              <div className="grid gap-1">
                <label className="text-xs sm:text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs sm:text-sm font-medium">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs sm:text-sm font-medium">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would you like to build?"
                  rows={5}
                  className="text-sm resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2 flex-shrink-0">
              <Button onClick={submit} className="flex-1 text-sm sm:text-base">
                Send email
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="text-sm sm:text-base"
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
