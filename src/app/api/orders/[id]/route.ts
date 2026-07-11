import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrderStatusLabel, parseStatusHistory } from "@/lib/marketplace";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { listing: { select: { title: true, images: true } } } },
    },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Фармоиш ёфт нашуд" }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    statusLabel: getOrderStatusLabel(order.status),
    history: parseStatusHistory(order.statusHistory),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const { status } = await request.json();
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Фармоиш ёфт нашуд" }, { status: 404 });
  }

  const history = parseStatusHistory(order.statusHistory);
  history.push({ status, at: new Date().toISOString() });

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status, statusHistory: JSON.stringify(history) },
  });

  await prisma.notification.create({
    data: {
      userId: order.userId,
      type: "ORDER",
      text: `Фармоиш #${order.id.slice(-6)}: ${getOrderStatusLabel(status)}`,
    },
  });

  return NextResponse.json(updated);
}
