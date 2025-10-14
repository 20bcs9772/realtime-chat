"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { UnderTheHood } from "@/components/under-the-hood";
import {
  Users,
  MessageSquare,
  Wifi,
  WifiOff,
  Send,
  LogOut,
  Info,
} from "lucide-react";

type Msg = {
  id: string;
  type: "message" | "system";
  from?: string;
  text: string;
  timestamp: number;
};

export default function RealtimeSection() {
  const [step, setStep] = useState<"join" | "chat">("join");
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const connectToRoom = () => {
    const name = userName.trim();
    const room = roomId.trim();

    if (!name || !room) {
      alert("Please enter both name and room ID");
      return;
    }

    if (!/^\d{3,4}$/.test(room)) {
      alert("Room ID must be 3-4 digits (e.g., 1002)");
      return;
    }

    const WS_URL =
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/api/ws";
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "join", userName: name, roomId: room }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "joined") {
        setStep("chat");
        setUserCount(data.userCount || 1);
      } else if (data.type === "userCount") {
        setUserCount(data.count);
      } else if (data.type === "message") {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            type: "message",
            from: data.from,
            text: data.text,
            timestamp: data.timestamp,
          },
        ]);
      } else if (data.type === "system") {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            type: "system",
            text: data.text,
            timestamp: data.timestamp,
          },
        ]);
      } else if (data.type === "typing") {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (data.isTyping) {
            next.add(data.from);
          } else {
            next.delete(data.from);
          }
          return next;
        });
      }
    };

    ws.onerror = () => {
      alert("Connection error. Make sure the WebSocket server is running.");
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      setStep("join");
      setMessages([]);
    };

    wsRef.current = ws;
  };

  const sendMessage = () => {
    const t = text.trim();
    if (!t || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({ type: "message", text: t }));
    setText("");

    // Stop typing indicator
    wsRef.current.send(JSON.stringify({ type: "typing", isTyping: false }));
  };

  const handleTyping = (value: string) => {
    setText(value);

    if (!wsRef.current) return;

    // Send typing indicator
    wsRef.current.send(
      JSON.stringify({ type: "typing", isTyping: value.length > 0 })
    );

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: "typing", isTyping: false }));
      }
    }, 1000);
  };

  const leaveRoom = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setStep("join");
    setMessages([]);
    setUserName("");
    setRoomId("");
    setTypingUsers(new Set());
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <FullViewportSection
      id="realtime"
      ariaLabel="Realtime apps with WebSockets"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Real-Time Chat (WebSockets)
          </h2>
          <p className="mt-2 text-muted-foreground">
            Live multi-user chat with typing indicators. Connect from different
            browsers using the same room ID.
          </p>
        </div>
        <UnderTheHood text="WebSocket server with room-based messaging, typing indicators, and automatic room cleanup." />
      </div>

      {step === "join" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Join a Chat Room</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Your Name
                </label>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && connectToRoom()}
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Room ID
                </label>
                <Input
                  placeholder="e.g., 1002, 9999"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && connectToRoom()}
                  maxLength={4}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Enter 3-4 digits to create or join a room
                </p>
              </div>

              <Button onClick={connectToRoom} className="w-full h-11" size="lg">
                <MessageSquare className="w-4 h-4 mr-2" />
                Join Room
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm pt-2">
                {connected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Not connected</span>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-background">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">How It Works</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: "1",
                  text: "Enter your name and create a room ID (3-4 digits)",
                },
                {
                  num: "2",
                  text: "Share the room ID with friends or open in another browser",
                },
                {
                  num: "3",
                  text: "Everyone with the same room ID can chat in real-time",
                },
                {
                  num: "4",
                  text: "See live typing indicators and user count updates",
                },
                {
                  num: "5",
                  text: "Rooms automatically delete when the last person leaves",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.num}
                  </div>
                  <p className="text-sm text-muted-foreground pt-0.5">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-background/50 border backdrop-blur-sm">
              <p className="text-xs font-semibold mb-3 text-foreground">
                Built With:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "WebSockets",
                  "Next.js 15",
                  "Real-time Sync",
                  "Room Management",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="overflow-hidden border-2">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Room {roomId}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{userCount}</span>
                      <span>{userCount === 1 ? "user" : "users"} online</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={leaveRoom}
                variant="outline"
                size="sm"
                className="sm:ml-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="h-[28rem] sm:h-[32rem] overflow-y-auto bg-gradient-to-b from-muted/20 to-background p-4 sm:p-6 space-y-4"
          >
            <AnimatePresence initial={false}>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground/70">
                    Send a message to start the conversation
                  </p>
                </motion.div>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {m.type === "system" ? (
                    <div className="flex justify-center py-2">
                      <div className="px-4 py-1.5 rounded-full bg-muted/80 border text-xs text-muted-foreground font-medium">
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex ${
                        m.from === userName ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] ${
                          m.from === userName ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        {m.from !== userName && (
                          <div className="text-xs font-medium text-primary mb-1 ml-3">
                            {m.from}
                          </div>
                        )}
                        <div className="flex items-end gap-2">
                          {m.from !== userName && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {m.from?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div
                              className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                                m.from === userName
                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                  : "bg-card border rounded-bl-sm"
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words">
                                {m.text}
                              </p>
                            </div>
                            <div
                              className={`text-[10px] text-muted-foreground mt-1 px-2 ${
                                m.from === userName ? "text-right" : "text-left"
                              }`}
                            >
                              {formatTime(m.timestamp)}
                            </div>
                          </div>
                          {m.from === userName && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typingUsers.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3"
              >
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "0ms", animationDuration: "1s" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "200ms", animationDuration: "1s" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "400ms", animationDuration: "1s" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {Array.from(typingUsers).join(", ")}{" "}
                  {typingUsers.size === 1 ? "is" : "are"} typing
                </span>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-background px-4 sm:px-6 py-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Type your message..."
                  value={text}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  disabled={!connected}
                  className="h-11 resize-none"
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!connected || !text.trim()}
                size="lg"
                className="h-11 px-6"
              >
                <Send className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </FullViewportSection>
  );
}
