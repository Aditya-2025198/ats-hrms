export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const candidates = await prisma.candidate.findMany({
    where: { company_id: user.company_id },
    orderBy: { createdAt: "desc" },
  });

  if (candidates.length === 0)
    return NextResponse.json({ error: "No candidates found" }, { status: 404 });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Candidates");

  sheet.columns = Object.keys(candidates[0]).map((key) => ({
    header: key.charAt(0).toUpperCase() + key.slice(1),
    key,
    width: 20,
  }));

  candidates.forEach((row) => sheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=candidates.xlsx",
    },
  });
}
