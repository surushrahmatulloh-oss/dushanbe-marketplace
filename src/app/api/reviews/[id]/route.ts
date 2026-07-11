import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const { sellerReply } = await request.json();
  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: { listing: true },
  });

  if (!review || review.listing?.userId !== session.user.id) {
    return NextResponse.json({ error: "Дастрасӣ манъ" }, { status: 403 });
  }

  const updated = await prisma.review.update({
    where: { id: params.id },
    data: { sellerReply },
  });

  return NextResponse.json(updated);
}
