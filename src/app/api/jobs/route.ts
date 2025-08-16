// app/api/jobs/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
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
    // ✅ Auth check via cookies
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse formData
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;
    const vacancy = Number(formData.get("vacancy"));
    const status = formData.get("status") as string;

    // 🔎 Look up companyId from your User table (instead of trusting client)
    const appUser = await prisma.user.findFirst({
      where: { authId: user.id },
      select: { companyId: true, email: true, name: true },
    });

    if (!appUser?.companyId) {
      return NextResponse.json(
        { error: "User not linked to a company" },
        { status: 403 }
      );
    }

    // File uploads
    let jdUrl: string | null = null;
    let supportingDocUrl: string | null = null;

    const jdFile = formData.get("jdFile") as File | null;
    const supportingFile = formData.get("supportingFile") as File | null;

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
        .upload(`support/${uuidv4()}-${supportingFile.name}`, supportingFile, {
          upsert: true,
        });
      if (error) throw error;
      supportingDocUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/jobs/${data.path}`;
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        code,
        department,
        description,
        vacancy,
        status,
        initiatedBy: appUser.name ?? appUser.email ?? "System",
        companyId: appUser.companyId,
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
