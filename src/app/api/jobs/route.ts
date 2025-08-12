import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
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
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;
    const vacancy = Number(formData.get("vacancy"));
    const status = formData.get("status") as string;
    const initiatedBy = session.user.email;
    const companyId = formData.get("companyId") as string;

    // Upload files to Supabase
    const jdFile = formData.get("jdFile") as File | null;
    const supportingFile = formData.get("supportingFile") as File | null;
    let jdUrl: string | null = null;
    let supportingDocUrl: string | null = null;

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

    const job = await prisma.job.create({
      data: {
        title,
        code,
        department,
        description,
        vacancy,
        status,
        initiatedBy,
        companyId,
        jdUrl,
        supportingDocUrl,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
