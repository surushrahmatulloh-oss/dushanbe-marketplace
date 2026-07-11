"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, LayoutDashboard, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart/cart-button";
import { NotificationsBell } from "@/components/notifications/notifications-bell";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 shrink-0 transition-transform duration-200 hover:scale-[1.03]"
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-[10px]",
                "bg-gradient-to-br from-teal-800 via-primary to-teal-400",
                "text-white font-bold text-lg leading-none shadow-sm"
              )}
            >
              D
            </div>
            <span className="hidden sm:block text-sm md:text-base font-bold tracking-tight">
              <span className="text-neutral-900">Dushanbe</span>
              <span className="text-primary">Маркетплейс</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/categories">
              <Button variant="ghost" size="sm">
                Категорияҳо
              </Button>
            </Link>
            <CartButton />
            {session ? (
              <>
                <NotificationsBell />
                <Link href="/sell">
                  <Button size="sm" className="rounded-full">
                    <Plus className="h-4 w-4" />
                    Эълон
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  aria-label="Баромад"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Вуруд
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full">
                    Бақайдгирӣ
                  </Button>
                </Link>
              </>
            )}
          </nav>

          <div className="flex lg:hidden items-center gap-1">
            {session && <NotificationsBell />}
            <CartButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Категорияҳо
              </Button>
            </Link>
            {session ? (
              <>
                <Link href="/sell" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Ҷойгиркунӣ
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Утоқи ман
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Баромад
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Вуруд
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full">Бақайдгирӣ</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
