import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Get all franchisees with their latest assessment
    const { data: franchisees, error } = await supabase
      .from("franchisees")
      .select("*")
      .order("name");

    if (error) throw error;

    // Get latest assessment for each franchisee
    const enriched = await Promise.all(
      (franchisees || []).map(async (f) => {
        const { data: assessments } = await supabase
          .from("assessments")
          .select("visit_date, percentage, tier")
          .eq("franchisee_id", f.id)
          .order("visit_date", { ascending: false })
          .limit(1);

        const latest = assessments?.[0];
        return {
          id: f.id,
          name: f.name,
          dba_name: f.dba_name,
          location_id: f.location_id,
          city: f.city,
          state: f.state,
          status: f.status,
          last_visit_date: latest?.visit_date || null,
          last_score: latest?.percentage || null,
          last_tier: latest?.tier || null,
        };
      })
    );

    return NextResponse.json({ franchisees: enriched });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ franchisees: [] }, { status: 500 });
  }
}
