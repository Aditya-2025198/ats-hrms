// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";    // uses your existing default export
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_BUCKET!; // e.g. "ats-hrms-prod"

// server-side client (service role)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const companyId = (formData.get("companyId") || formData.get("company_id"))?.toString();
    const userId = (formData.get("userId") || formData.get("user_id"))?.toString();
    const kind = (formData.get("kind")?.toString() || "DOCUMENT").toUpperCase(); // JD | RESUME | DOCUMENT | OTHER
    const jobId = (formData.get("jobId") || formData.get("job_id"))?.toString() || undefined;
    const candidateId = (formData.get("candidateId") || formData.get("candidate_id"))?.toString() || undefined;
    const employeeId = (formData.get("employeeId") || formData.get("employee_id"))?.toString() || undefined;

    if (!file || !companyId || !userId) {
      return NextResponse.json({ error: "Missing file, companyId or userId" }, { status: 400 });
    }

    // Basic validation (file size + types) — adjust allowed list & max size
    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // build objectKey path
    const ext = file.name.split(".").pop() ?? "bin";
    const safeKind = kind.toLowerCase();
    const objectKey = `company/${companyId}/users/${userId}/${safeKind}s/${randomUUID()}.${ext}`;

    // upload to Supabase
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(objectKey, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // create Attachment row in Prisma
    const attachment = await prisma.attachment.create({
      data: {
        kind,
        contentType: file.type,
        sizeBytes: buffer.length,
        provider: "supabase",
        bucket: BUCKET,
        objectKey,
        url: "", // intentionally empty: we prefer signed URLs on-demand
        companyId,
        uploaderUserId: userId,
        jobId,
        candidateId,
        employeeId,
      },
    });

    return NextResponse.json({ success: true, attachment });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
