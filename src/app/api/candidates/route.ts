import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const candidates = await prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(candidates);
}

export async function POST(req: Request) {
  const data = await req.json();
  const candidate = await prisma.candidate.create({ data });
  return NextResponse.json(candidate);
}
