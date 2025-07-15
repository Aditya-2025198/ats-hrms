import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // ✅ Get ID manually from the request URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Missing ID in URL" }, { status: 400 });
    }

    const data = await req.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const status = data.get("status") as string;

    await prisma.candidate.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        status,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/candidates", req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 });
  }
}
