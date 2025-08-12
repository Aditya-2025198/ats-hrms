import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const employeeCode = formData.get("employeeCode") as string;
    const name = formData.get("name") as string;
    const doj = new Date(formData.get("doj") as string);
    const department = formData.get("department") as string;
    const designation = formData.get("designation") as string;
    const contactNo = formData.get("contactNo") as string;
    const email = formData.get("email") as string;
    const reportingTo = formData.get("reportingTo") as string;
    const status = formData.get("status") as string;
    const location = formData.get("location") as string;
    const nationality = formData.get("nationality") as string;

    // Additional fields
    const grade = formData.get("grade") as string;
    const personalEmail = formData.get("personalEmail") as string;
    const pan = formData.get("pan") as string;
    const aadhar = formData.get("aadhar") as string;
    const address = formData.get("address") as string;
    const altContactNo = formData.get("altContactNo") as string;
    const uan = formData.get("uan") as string;
    const fatherName = formData.get("fatherName") as string;
    const highestEducation = formData.get("highestEducation") as string;
    const modeOfSeparation = formData.get("modeOfSeparation") as string;
    const lwd = formData.get("lwd") ? new Date(formData.get("lwd") as string) : null;

    const companyId = formData.get("companyId") as string;

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        name,
        doj,
        department,
        designation,
        contactNo,
        email,
        reportingTo,
        status,
        location,
        nationality,
        grade,
        personalEmail,
        pan,
        aadhar,
        address,
        altContactNo,
        uan,
        fatherName,
        highestEducation,
        modeOfSeparation,
        lwd,
        companyId,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}