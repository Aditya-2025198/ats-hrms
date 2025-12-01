"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { job_id, status } = await req.json();

    if (!job_id || !status) {
      return NextResponse.json({ success: false, error: "Job ID and status required" }, { status: 400 });
    }

    // Update the job status
    const updatedJob = await prisma.jobs.update({
      where: { id: job_id },
      data: { status },
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (err: any) {
    console.error("Update job status error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
