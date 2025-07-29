import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import ExcelJS from "exceljs";

export async function GET() {
  const { data, error } = await supabase.from("candidates").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Candidates");
  sheet.columns = Object.keys(data[0] || {}).map((key) => ({ header: key, key }));
  data.forEach((row) => sheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=candidates.xlsx",
    },
  });
}
