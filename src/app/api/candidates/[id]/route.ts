// src/app/api/candidates/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
      include: { job: true },
    });
    if (!candidate) return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    return NextResponse.json(candidate);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch candidate" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const department = formData.get("department") as string;
    const status = formData.get("status") as string;
    const jobId = formData.get("jobId") as string;

    // Resume upload (optional)
    const resumeFile = formData.get("resume") as File | null;
    let resumeUrl = null;

    if (resumeFile && resumeFile.size > 0) {
      const { data, error } = await supabase.storage
        .from("candidates")
        .upload(`resumes/${uuidv4()}-${resumeFile.name}`, resumeFile, { upsert: true });
      if (error) throw error;
      resumeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/candidates/${data.path}`;
    }

    const candidate = await prisma.candidate.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        department,
        status,
        jobId,
        ...(resumeUrl && { resumeUrl }),
      },
    });

    return NextResponse.json(candidate);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.candidate.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Candidate deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete candidate" }, { status: 500 });
  }
}
