import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, parseImages } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/marketplace";
import { OrderTracker } from "@/components/orders/order-tracker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Props {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { listing: true } },
    },
  });

  if (!order || order.userId !== session!.user!.id) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/orders" className="text-sm text-muted-foreground hover:text-primary">
            ← Бозгашт
          </Link>
          <h2 className="text-xl font-bold mt-1">
            Фармоиш #{order.id.slice(-8).toUpperCase()}
          </h2>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <Badge>{getOrderStatusLabel(order.status)}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Пайгирии фармоиш</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTracker
              status={order.status}
              statusHistory={order.statusHistory}
              trackingNumber={order.trackingNumber}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Маълумот</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Суроға</p>
                <p>{order.address}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Пардохт</p>
                <p>{order.paymentMethod === "CASH" ? "Нақд" : "Корт"}</p>
              </div>
              {order.couponCode && (
                <div>
                  <p className="text-muted-foreground">Купон</p>
                  <p>{order.couponCode} (-{formatPrice(order.discountAmount)})</p>
                </div>
              )}
              <div className="pt-2 border-t border-border">
                <p className="text-lg font-bold text-primary">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Маҳсулот</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => {
                const images = parseImages(item.listing.images);
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={images[0] || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{item.listing.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
