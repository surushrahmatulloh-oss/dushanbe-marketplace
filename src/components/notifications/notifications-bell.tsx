"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications);
      setUnread(data.unreadCount);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setUnread(0);
    setNotifications((n) => n.map((x) => ({ ...x, isRead: true })));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => {
          setOpen(!open);
          if (!open && unread > 0) markRead();
        }}
        aria-label="Огоҳиномаҳо"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-border font-medium text-sm">
              Огоҳиномаҳо
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "px-4 py-3 text-sm border-b border-border last:border-0",
                      !n.isRead && "bg-primary/5"
                    )}
                  >
                    {n.text}
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  Огоҳинома нест
                </p>
              )}
            </div>
            <Link
              href="/dashboard/orders"
              className="block p-3 text-center text-sm text-primary hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Фармоишҳои ман
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
