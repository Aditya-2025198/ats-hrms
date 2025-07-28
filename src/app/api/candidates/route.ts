import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fetch candidates (filtered by company)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("company_id");

    if (!companyId) {
      return NextResponse.json({ error: "Missing company_id" }, { status: 400 });
    }

    const candidates = await prisma.candidate.findMany({
      where: { company_id: companyId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}

// Add candidate (always linked to HR's company)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, status, position, hr_user_id } = body;

    if (!name || !email || !status || !position || !hr_user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch HR user to get company_id
    const hrUser = await prisma.hr_users.findUnique({
      where: { id: hr_user_id },
      select: { company_id: true },
    });

    if (!hrUser || !hrUser.company_id) {
      return NextResponse.json({ error: "HR user or company not found" }, { status: 404 });
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        email,
        status,
        position,
        company_id: hrUser.company_id,
      },
    });

    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error("Error adding candidate:", error);
    return NextResponse.json({ error: "Something failed" }, { status: 500 });
  }
}
