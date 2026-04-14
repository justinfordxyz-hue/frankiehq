export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    // Get franchisee
    const { data: franchisee, error: fError } = await supabase
      .from("franchisees")
      .select("*")
      .eq("id", id)
      .single();

    if (fError || !franchisee) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get assessments
    const { data: assessments } = await supabase
      .from("assessments")
      .select("id, report_type, visit_date, percentage, tier, critical_findings, positive_findings")
      .eq("franchisee_id", id)
      .order("visit_date", { ascending: false });

    // Get letters
    const { data: letters } = await supabase
      .from("letters")
      .select("id, letter_type, status, created_at, content")
      .eq("franchisee_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      ...franchisee,
      assessments: assessments || [],
      letters: letters || [],
    });
  } catch (error) {
    console.error("Franchisee detail error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
