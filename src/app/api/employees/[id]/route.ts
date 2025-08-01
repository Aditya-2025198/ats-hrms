// src/app/api/employees/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
    });
    if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const updateData: any = {};
    formData.forEach((value, key) => {
      updateData[key] = value;
    });

    if (updateData.doj) updateData.doj = new Date(updateData.doj);
    if (updateData.lwd) updateData.lwd = new Date(updateData.lwd);

    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.employee.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Employee deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
