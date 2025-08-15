import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Try a simple query
    const jobsCount = await prisma.job.count();
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      jobsCount,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
