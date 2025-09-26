import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.jobs.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ success: true, jobs });
  } catch (err: any) {
    console.error("Jobs GET error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
