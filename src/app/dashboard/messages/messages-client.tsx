"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; name: string | null };
}

interface Conversation {
  senderId: string;
  receiverId: string;
  text: string;
  listing?: { id: string; title: string } | null;
  sender: { id: string; name: string | null };
  receiver: { id: string; name: string | null };
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUser, setActiveUser] = useState<string | null>(
    searchParams.get("userId")
  );
  const [activeListing, setActiveListing] = useState<string | null>(
    searchParams.get("listingId")
  );
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/messages");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations || []));
  }, []);

  useEffect(() => {
    if (!activeUser) return;
    const url = `/api/messages/thread?userId=${activeUser}${activeListing ? `&listingId=${activeListing}` : ""}`;
    fetch(url)
      .then((r) => r.json())
      .then(setMessages);
  }, [activeUser, activeListing]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim() || !activeUser) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: activeUser,
        listingId: activeListing,
        text,
      }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages([
        ...messages,
        { ...msg, sender: { id: session!.user!.id, name: session!.user!.name } },
      ]);
      setText("");
    }
  };

  const quickReplies = ["Ташаккур!", "Мавҷуд аст", "Нарх тахфиф дода мешавад"];

  if (status === "loading") return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-6">Паёмҳо</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        <div className="rounded-2xl border border-border overflow-y-auto">
          {conversations.map((c) => {
            const otherId = c.senderId === session!.user!.id ? c.receiverId : c.senderId;
            const otherName =
              c.senderId === session!.user!.id ? c.receiver.name : c.sender.name;
            return (
              <button
                key={`${otherId}-${c.listing?.id}`}
                onClick={() => {
                  setActiveUser(otherId);
                  setActiveListing(c.listing?.id || null);
                }}
                className={cn(
                  "w-full text-left p-4 border-b border-border hover:bg-muted transition-colors",
                  activeUser === otherId && "bg-primary/5"
                )}
              >
                <p className="font-medium text-sm">{otherName || "Истифодабаранда"}</p>
                {c.listing && (
                  <p className="text-xs text-primary truncate">{c.listing.title}</p>
                )}
                <p className="text-xs text-muted-foreground truncate mt-1">{c.text}</p>
              </button>
            );
          })}
          {conversations.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">Паём нест</p>
          )}
        </div>

        <div className="md:col-span-2 rounded-2xl border border-border flex flex-col">
          {activeUser ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                      msg.senderId === session!.user!.id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t border-border space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {quickReplies.map((q) => (
                    <button
                      key={q}
                      onClick={() => setText(q)}
                      className="text-xs rounded-full bg-muted px-3 py-1 hover:bg-primary/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Паём навишед..."
                    onKeyDown={(e) => e.key === "Enter" && send()}
                  />
                  <Button size="icon" onClick={send}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Мукотибаро интихоб кунед
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
