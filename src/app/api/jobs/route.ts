import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const job = await prisma.job.create({ data });
  return NextResponse.json(job);
}
