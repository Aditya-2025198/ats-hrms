import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const employees = await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const data = await req.json();
  const employee = await prisma.employee.create({ data });
  return NextResponse.json(employee);
}
