"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Heart, PlusCircle, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Ҷустуҷӯ", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/dashboard/favorites",
    label: "Интихобшуда",
    icon: Heart,
    match: (p: string) => p.startsWith("/dashboard/favorites"),
    auth: true,
  },
  {
    href: "/sell",
    label: "Ҷойгиркунӣ",
    icon: PlusCircle,
    match: (p: string) => p.startsWith("/sell"),
    auth: true,
  },
  {
    href: "/dashboard/messages",
    label: "Паёмакҳо",
    icon: MessageCircle,
    match: (p: string) => p.startsWith("/dashboard/messages"),
    auth: true,
  },
  {
    href: "/dashboard",
    label: "Утоқи ман",
    icon: User,
    match: (p: string) =>
      p.startsWith("/dashboard") &&
      !p.startsWith("/dashboard/favorites") &&
      !p.startsWith("/dashboard/messages"),
    auth: true,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 md:hidden",
        "border-t border-border bg-background/95 backdrop-blur-lg",
        "pb-[env(safe-area-inset-bottom)]"
      )}
      aria-label="Менюи асосӣ"
    >
      <div className="grid grid-cols-5 h-[60px]">
        {items.map((item) => {
          const href =
            item.auth && !session
              ? `/login?callbackUrl=${encodeURIComponent(item.href)}`
              : item.href;
          const active = item.match(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon
                className={cn("h-[22px] w-[22px]", item.href === "/sell" && "h-6 w-6")}
                strokeWidth={active ? 2.5 : 1.75}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
