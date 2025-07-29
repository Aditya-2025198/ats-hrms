export const dynamic = "force-dynamic"; 
export const revalidate = 0; // Disable caching

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

// Prevent multiple Prisma instances during dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    // Fetch employees
    const employees = await prisma.employee.findMany();

    if (!employees || employees.length === 0) {
      return NextResponse.json({ error: "No employees found" }, { status: 404 });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    // Dynamically set columns from keys
    worksheet.columns = Object.keys(employees[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    // Add rows
    employees.forEach((employee) => worksheet.addRow(employee));

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=employees.xlsx",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export employees" },
      { status: 500 }
    );
  }
}
