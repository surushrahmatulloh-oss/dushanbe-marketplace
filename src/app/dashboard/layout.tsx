import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Heart,
  Settings,
  Plus,
  ShoppingBag,
  MessageCircle,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Умумӣ", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "Эълонҳои ман", icon: Package },
  { href: "/dashboard/orders", label: "Фармоишҳо", icon: ShoppingBag },
  { href: "/dashboard/favorites", label: "Дӯстдоштаҳо", icon: Heart },
  { href: "/dashboard/messages", label: "Паёмҳо", icon: MessageCircle },
  { href: "/dashboard/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Танзимот", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Кабинет</h1>
            <p className="text-sm text-muted-foreground">{session.user.name}</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/sell"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground mt-4"
            >
              <Plus className="h-4 w-4" />
              Эълон гузоред
            </Link>
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
