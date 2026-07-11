import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/marketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user!.id },
    include: {
      items: { include: { listing: { select: { title: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Фармоишҳои ман</h2>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block rounded-2xl border border-border p-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-muted-foreground">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
                <Badge variant="secondary">{getOrderStatusLabel(order.status)}</Badge>
              </div>
              <p className="font-bold text-primary">{formatPrice(order.totalPrice)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.items.length} маҳсулот · {formatDate(order.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">Фармоиш нест</p>
          <Link href="/">
            <Button>Харидро оғоз кунед</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
