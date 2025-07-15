import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

export async function GET() {
  const employees = await prisma.employee.findMany();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employees");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Position", key: "position", width: 25 },
    { header: "Status", key: "status", width: 15 },
  ];

  employees.forEach((employee) => {
    worksheet.addRow(employee);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=employees.xlsx`,
    },
  });
}
