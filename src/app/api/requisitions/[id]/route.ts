import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Debugging Step 1: Check cookies
    const allCookies = cookies().getAll();
    console.log("🍪 Cookies received by API:", allCookies);

    // 1️⃣ Get logged-in user from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("👤 Supabase user:", user, "Error:", userError);

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // 2️⃣ Get user's company from profiles table
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: { company_id: true },
    });

    if (!profile?.company_id) {
      return NextResponse.json(
        { error: "User profile or company not found" },
        { status: 400 }
      );
    }

    // 3️⃣ Parse request body
    const body = await req.json();
    const { title, department, location } = body;

    if (!title || !department || !location) {
      return NextResponse.json(
        { error: "Title, Department, and Location are required." },
        { status: 400 }
      );
    }

    // 4️⃣ Fetch the requisition and verify ownership
    const requisition = await prisma.requisitions.findUnique({
      where: { id: Number(params.id) },
    });

    if (!requisition) {
      return NextResponse.json(
        { error: "Requisition not found." },
        { status: 404 }
      );
    }

    if (requisition.company_id !== profile.company_id) {
      return NextResponse.json(
        { error: "You are not authorized to edit this requisition." },
        { status: 403 }
      );
    }

    // 5️⃣ Update the requisition and mark as edited
    const updated = await prisma.requisitions.update({
      where: { id: Number(params.id) },
      data: {
        job_title: title,
        department,
        location,
        is_edited: true,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Requisition updated successfully",
      requisition: updated,
    });
  } catch (err: any) {
    console.error("❌ Update requisition error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
