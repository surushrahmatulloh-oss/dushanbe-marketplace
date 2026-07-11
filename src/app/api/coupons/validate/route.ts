import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateCoupon } from "@/lib/recommendations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Авторизатсия лозим аст" }, { status: 401 });
  }

  const { code, total } = await request.json();
  const result = await validateCoupon(code, total);

  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    discount: result.discount,
    code: result.coupon!.code,
  });
}
