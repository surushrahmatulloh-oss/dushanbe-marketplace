import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  callClaudeApi,
  getCategoryCatalog,
  localFallbackParse,
  searchWithFilters,
} from "@/lib/ai-search";

const bodySchema = z.object({
  query: z.string().min(2).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = bodySchema.parse(body);
    const categories = await getCategoryCatalog();

    let filters;
    let fallback = false;

    try {
      filters = await callClaudeApi(query, categories);
    } catch {
      filters = localFallbackParse(query, categories);
      fallback = true;
    }

    const { listings, summary } = await searchWithFilters(filters, query);

    const session = await auth();
    if (session?.user?.id) {
      await prisma.searchHistory.create({
        data: { userId: session.user.id, query: `[AI] ${query}` },
      });
    }

    return NextResponse.json({
      filters,
      summary,
      fallback,
      listings: listings.map((l) => ({
        id: l.id,
        title: l.title,
        price: l.price,
        images: l.images,
        location: l.location,
        condition: l.condition,
        type: l.type,
        category: l.category.name,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Дархости нодуруст" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Хатогии сервер" },
      { status: 500 }
    );
  }
}
