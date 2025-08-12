import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: "desc" },
      include: { job: true },
    });
    return NextResponse.json(candidates);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const jobId = formData.get("jobId") as string;
    const department = formData.get("department") as string;
    const status = formData.get("status") as string;
    const initiatedBy = session.user.email;
    const companyId = formData.get("companyId") as string;

    // Resume upload
    const resumeFile = formData.get("resume") as File | null;
    let resumeUrl: string | null = null;

    if (resumeFile && resumeFile.size > 0) {
      const { data, error } = await supabase.storage
        .from("candidates")
        .upload(
          `resumes/${uuidv4()}-${resumeFile.name}`,
          resumeFile,
          { upsert: true }
        );

      if (error) throw error;

      resumeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/candidates/${data.path}`;
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        status,
        jobId,
        companyId,
        initiatedBy,
        resumeUrl,
        department, // Only if this field exists in your Prisma schema
      },
    });

    return NextResponse.json(candidate);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
