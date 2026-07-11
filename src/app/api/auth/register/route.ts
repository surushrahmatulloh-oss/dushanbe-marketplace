import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { emailFromPhone, normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, password, phone: rawPhone } = parsed.data;
    const phone = normalizePhone(rawPhone);
    const email = parsed.data.email || emailFromPhone(phone);

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Ин email аллакай бақайдгирифта шудааст" },
        { status: 400 }
      );
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json(
        { error: "Ин рақами телефон аллакай бақайдгирифта шудааст" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone },
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Хатогии сервер" }, { status: 500 });
  }
}
