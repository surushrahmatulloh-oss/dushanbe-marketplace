import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCoupon } from "@/lib/recommendations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { listing: { select: { title: true, images: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  try {
    const { items, address, paymentMethod, couponCode } = await request.json();

    if (!items?.length || !address) {
      return NextResponse.json({ error: "Маълумот нопурра аст" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity,
      0
    );

    let discount = 0;
    let appliedCoupon: string | null = null;

    if (couponCode) {
      const result = await validateCoupon(couponCode, subtotal);
      if (!result.valid) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      discount = result.discount!;
      appliedCoupon = result.coupon!.code;
      await prisma.coupon.update({
        where: { code: appliedCoupon },
        data: { usedCount: { increment: 1 } },
      });
    }

    const totalPrice = subtotal - discount;
    const trackingNumber = `DM${Date.now().toString(36).toUpperCase()}`;
    const statusHistory = JSON.stringify([
      { status: "PENDING", at: new Date().toISOString() },
    ]);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPrice,
        discountAmount: discount,
        couponCode: appliedCoupon,
        address,
        paymentMethod: paymentMethod || "CASH",
        trackingNumber,
        status: "PENDING",
        statusHistory,
        items: {
          create: items.map((i: { listingId: string; price: number; quantity: number }) => ({
            listingId: i.listingId,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "ORDER",
        text: `Фармоиши шумо #${order.id.slice(-6)} қабул шуд`,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Хатогии сервер" }, { status: 500 });
  }
}
