"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1. Get the logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // 2. Fetch the user's profile to get company_id
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: { company_id: true },
    });

    if (!profile || !profile.company_id) {
      return NextResponse.json(
        { error: "User profile or company not found" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body.type) {
      return NextResponse.json(
        { error: "Requisition type is required." },
        { status: 400 }
      );
    }

    // 3. Build the requisition data
    const commonData: any = {
      company_id: profile.company_id, // ✅ auto-fill from profile
      type: body.type,
      title: body.title || body.jobTitle || null,
      department: body.department || null,
      location: body.location || null,
      employment_type: body.employment_type || null,
      openings: body.openings ? Number(body.openings) : null,
      priority: body.priority || null,
      needed_by: body.needed_by ? new Date(body.needed_by) : null,
      job_description: body.job_description || body.responsibilities || null,
      responsibilities: body.responsibilities || null,
      skills: body.skills || [],
      experience: body.experience || null,
      education: body.education || null,
      currency: body.currency || null,
      salary_type: body.salary_type || null,
      salary_min: body.salary_min ? Number(body.salary_min) : null,
      salary_max: body.salary_max ? Number(body.salary_max) : null,
      budget_notes: body.budget_notes || null,
      client_name: body.client_name || null,
      roles: body.roles || null,
      notes: body.notes || null,
      raised_by: body.raised_by || null,
      final_status: body.final_status || "pending_dept_head",
      dept_head_id: body.dept_head_id || null,
      dept_head_email: body.dept_head_email || null,
      dept_head_status: body.dept_head_status || "pending",
      dept_head_remarks: body.dept_head_remarks || null,
      md_id: body.md_id || null,
      md_email: body.md_email || null,
      md_status: body.md_status || "pending",
      md_remarks: body.md_remarks || null,
      approver_message: body.approver_message || null,
      created_at: new Date(),
    };

    // Only set requisition_code if provided (let DB trigger handle auto-generation)
    if (body.requisition_code) {
      commonData.requisition_code = body.requisition_code;
    }

    // 4. Save the requisition
    const requisition = await prisma.requisitions.create({
      data: commonData,
    });

    // 5. Auto-create Job linked to this requisition
    await prisma.jobs.create({
      data: {
        job_code: `JOB-${Date.now()}`, // Simple job code generation
        requisition_code: requisition.requisition_code,
        job_title: requisition.job_title,
        department: requisition.department,
        location: requisition.location,
        openings: requisition.openings ?? 1,
        salary_min: requisition.salary_min,
        salary_max: requisition.salary_max,
      },
    });

    return NextResponse.json({ success: true, requisition });
  } catch (err: any) {
    console.error("Requisition API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create requisition" },
      { status: 500 }
    );
    
  }
}
