import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const otherId = searchParams.get("userId");
  const listingId = searchParams.get("listingId");

  if (!otherId) {
    return NextResponse.json({ error: "userId лозим аст" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: otherId },
        { senderId: otherId, receiverId: session.user.id },
      ],
      ...(listingId ? { listingId } : {}),
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

  await prisma.message.updateMany({
    where: { senderId: otherId, receiverId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json(messages);
}
