"use server";


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { job_id: jobIdString, status } = await req.json(); // Renamed to avoid confusion

    if (!jobIdString || !status) {
      return NextResponse.json({ success: false, error: "Job ID and status required" }, { status: 400 });
    }

    // --- FIX APPLIED HERE ---
    // Convert the incoming string ID to an integer/number for Prisma
    const job_id = parseInt(jobIdString, 10);
    // --- END FIX ---

    // Update the job status
    const updatedJob = await prisma.jobs.update({
      where: { id: job_id }, // Now passes a number
      data: { status },
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (err: any) {
    console.error("Update job status error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
