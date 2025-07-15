import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany();
    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error); // ✅ added console
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, status, position } = body;

    if (!name || !email || !status || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        email,
        status,
        position,
      },
    });

    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error("Error adding candidate:", error); // ✅ fixed
    return NextResponse.json({ error: "Something failed" }, { status: 500 });
  }
}
