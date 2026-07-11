import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      user: { select: { id: true, name: true, avatar: true, phone: true, createdAt: true } },
      shop: true,
      variants: true,
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Эълон ёфт нашуд" }, { status: 404 });
  }

  await prisma.listing.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json(listing);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.userId !== session.user.id) {
    return NextResponse.json({ error: "Дастрасӣ манъ аст" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.listing.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.userId !== session.user.id) {
    return NextResponse.json({ error: "Дастрасӣ манъ аст" }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
