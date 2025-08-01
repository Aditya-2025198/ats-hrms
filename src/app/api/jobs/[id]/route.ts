// src/app/api/jobs/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;
    const vacancy = Number(formData.get("vacancy"));
    const status = formData.get("status") as string;

    // Upload new files (if provided)
    const jdFile = formData.get("jdFile") as File | null;
    const supportingFile = formData.get("supportingFile") as File | null;
    let jdUrl = null;
    let supportingDocUrl = null;

    if (jdFile && jdFile.size > 0) {
      const { data, error } = await supabase.storage
        .from("jobs")
        .upload(`jd/${uuidv4()}-${jdFile.name}`, jdFile, { upsert: true });
      if (error) throw error;
      jdUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/jobs/${data.path}`;
    }

    if (supportingFile && supportingFile.size > 0) {
      const { data, error } = await supabase.storage
        .from("jobs")
        .upload(`support/${uuidv4()}-${supportingFile.name}`, supportingFile, { upsert: true });
      if (error) throw error;
      supportingDocUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/jobs/${data.path}`;
    }

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        title,
        department,
        description,
        vacancy,
        status,
        ...(jdUrl && { jdUrl }),
        ...(supportingDocUrl && { supportingDocUrl }),
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.job.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Job deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
