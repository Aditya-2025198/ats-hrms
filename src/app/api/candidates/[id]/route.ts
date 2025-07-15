import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const status = data.get("status") as string;

return await prisma.candidate.update({
  where: { id: Number(params.id) },
  data: {
    name,
    email,
    status,
  },
});


    // ✅ Use absolute URL for redirection
    return NextResponse.redirect(new URL("/dashboard/candidates", req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 });
  }
}
