export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    // Fetch candidates
    const { data, error } = await supabase.from("candidates").select("*");
    if (error) {
      console.error("Supabase fetch error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No candidates found" }, { status: 404 });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Candidates");

    // Dynamically set columns from keys of first row
    sheet.columns = Object.keys(data[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalized headers
      key,
      width: 20,
    }));

    // Add rows
    data.forEach((row) => sheet.addRow(row));

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=candidates.xlsx",
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Failed to export candidates" },
      { status: 500 }
    );
  }
}
