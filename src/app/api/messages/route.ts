import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const userId = session.user.id;

  const [sent, received] = await Promise.all([
    prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        listing: { select: { id: true, title: true } },
      },
      take: 100,
    }),
    prisma.message.count({
      where: { receiverId: userId, isRead: false },
    }),
  ]);

  const conversations = new Map<string, typeof sent[0]>();
  for (const msg of sent) {
    const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const key = `${otherId}-${msg.listingId || "general"}`;
    if (!conversations.has(key)) conversations.set(key, msg);
  }

  return NextResponse.json({
    conversations: Array.from(conversations.values()),
    unreadCount: received,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const { receiverId, listingId, text } = await request.json();
  if (!receiverId || !text?.trim()) {
    return NextResponse.json({ error: "Паём холӣ аст" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      listingId,
      text: text.trim(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: "MESSAGE",
      text: `Паёми нав аз ${session.user.name || "истифодабаранда"}`,
    },
  });

  return NextResponse.json(message, { status: 201 });
}
