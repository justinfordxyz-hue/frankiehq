export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Check if Paco Taco already exists
    const { data: existing } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", "paco-taco")
      .single();

    if (existing) {
      return NextResponse.json({
        message: "Paco Taco already seeded",
        brand_id: existing.id,
      });
    }

    // Create brand
    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .insert({
        name: "Paco Taco",
        slug: "paco-taco",
        config: {
          scoring: {
            categories: [
              { name: "Safety", maxPoints: 30 },
              { name: "Product Quality", maxPoints: 25 },
              { name: "Service", maxPoints: 25 },
              { name: "Image", maxPoints: 20 },
            ],
            tiers: [
              { name: "CRITICAL", maxScore: 69 },
              { name: "DEVELOPING", maxScore: 84 },
              { name: "GOOD", maxScore: 91 },
              { name: "ELITE", maxScore: 100 },
            ],
          },
          reportTypes: [
            "Operations Assessment",
            "Health & Safety",
            "Window Readiness",
            "Deficiency Report",
          ],
          feeTypes: ["Royalty", "Marketing/Adv Fund", "Technology Fee"],
          letterClosing: "Regards,",
        },
      })
      .select()
      .single();

    if (brandError) throw brandError;

    // Create franchisees
    const franchiseeData = [
      {
        brand_id: brand.id,
        name: "Maria Rodriguez",
        dba_name: "Rodriguez Tacos LLC",
        location_id: "PT-4012",
        address: "1450 S Pacific Coast Hwy",
        city: "Redondo Beach",
        state: "CA",
        zip: "90277",
        phone: "(310) 555-0142",
        email: "mrodriguez@pacotaco.com",
        status: "active",
      },
      {
        brand_id: brand.id,
        name: "James Chen",
        dba_name: "Chen Food Group Inc",
        location_id: "PT-4018",
        address: "8821 Valley Blvd",
        city: "Rosemead",
        state: "CA",
        zip: "91770",
        phone: "(626) 555-0198",
        email: "jchen@pacotaco.com",
        status: "active",
      },
      {
        brand_id: brand.id,
        name: "Priya Patel",
        dba_name: "Patel Restaurant Group",
        location_id: "PT-4025",
        address: "3200 E Imperial Hwy",
        city: "Lynwood",
        state: "CA",
        zip: "90262",
        phone: "(424) 555-0167",
        email: "ppatel@pacotaco.com",
        status: "active",
      },
      {
        brand_id: brand.id,
        name: "Robert Williams",
        dba_name: null,
        location_id: "PT-4031",
        address: "15602 Whittier Blvd",
        city: "Whittier",
        state: "CA",
        zip: "90603",
        phone: "(562) 555-0133",
        email: "rwilliams@pacotaco.com",
        status: "probation",
      },
      {
        brand_id: brand.id,
        name: "Sandra Kim",
        dba_name: "Kim Enterprises",
        location_id: "PT-4037",
        address: "2110 Artesia Blvd",
        city: "Torrance",
        state: "CA",
        zip: "90504",
        phone: "(310) 555-0188",
        email: "skim@pacotaco.com",
        status: "active",
      },
      {
        brand_id: brand.id,
        name: "David Nguyen",
        dba_name: "Nguyen Holdings LLC",
        location_id: "PT-4042",
        address: "901 E Carson St",
        city: "Long Beach",
        state: "CA",
        zip: "90807",
        phone: "(562) 555-0155",
        email: "dnguyen@pacotaco.com",
        status: "active",
      },
    ];

    const { data: franchisees, error: fError } = await supabase
      .from("franchisees")
      .insert(franchiseeData)
      .select();

    if (fError) throw fError;

    // Create sample assessments
    const assessments = [
      {
        brand_id: brand.id,
        franchisee_id: franchisees[0].id,
        report_type: "Operations Assessment",
        visit_date: "2026-04-01",
        scores: [
          { category: "Safety", score: 28, max: 30 },
          { category: "Product Quality", score: 23, max: 25 },
          { category: "Service", score: 22, max: 25 },
          { category: "Image", score: 19, max: 20 },
        ],
        total_score: 92,
        total_max: 100,
        percentage: 92,
        tier: "ELITE",
        critical_findings: null,
        positive_findings: "Outstanding team culture. Consistently exceeds standards across all categories.",
        source: "manual",
      },
      {
        brand_id: brand.id,
        franchisee_id: franchisees[1].id,
        report_type: "Operations Assessment",
        visit_date: "2026-03-28",
        scores: [
          { category: "Safety", score: 25, max: 30 },
          { category: "Product Quality", score: 22, max: 25 },
          { category: "Service", score: 20, max: 25 },
          { category: "Image", score: 18, max: 20 },
        ],
        total_score: 85,
        total_max: 100,
        percentage: 85,
        tier: "GOOD",
        critical_findings: "Minor temperature logging gaps in walk-in cooler.",
        positive_findings: "Strong sales growth, excellent product consistency.",
        source: "manual",
      },
      {
        brand_id: brand.id,
        franchisee_id: franchisees[2].id,
        report_type: "Operations Assessment",
        visit_date: "2026-03-15",
        scores: [
          { category: "Safety", score: 22, max: 30 },
          { category: "Product Quality", score: 18, max: 25 },
          { category: "Service", score: 18, max: 25 },
          { category: "Image", score: 15, max: 20 },
        ],
        total_score: 73,
        total_max: 100,
        percentage: 73,
        tier: "DEVELOPING",
        critical_findings: "Expired product found in walk-in. Handwashing station partially blocked.",
        positive_findings: "New shift lead showing improvement. Team morale is high.",
        source: "manual",
      },
      {
        brand_id: brand.id,
        franchisee_id: franchisees[3].id,
        report_type: "Health & Safety",
        visit_date: "2026-03-20",
        scores: [
          { category: "Safety", score: 15, max: 30 },
          { category: "Product Quality", score: 14, max: 25 },
          { category: "Service", score: 16, max: 25 },
          { category: "Image", score: 10, max: 20 },
        ],
        total_score: 55,
        total_max: 100,
        percentage: 55,
        tier: "CRITICAL",
        critical_findings: "Multiple food safety violations. No sanitizer at stations. Opening/closing checklists not in use. Grease trap overdue for service.",
        positive_findings: "Owner acknowledged issues and committed to corrective action plan.",
        source: "manual",
      },
      {
        brand_id: brand.id,
        franchisee_id: franchisees[4].id,
        report_type: "Operations Assessment",
        visit_date: "2026-04-05",
        scores: [
          { category: "Safety", score: 26, max: 30 },
          { category: "Product Quality", score: 21, max: 25 },
          { category: "Service", score: 23, max: 25 },
          { category: "Image", score: 18, max: 20 },
        ],
        total_score: 88,
        total_max: 100,
        percentage: 88,
        tier: "GOOD",
        critical_findings: null,
        positive_findings: "Consistent performer. Loyalty enrollment trending up. Clean facility.",
        source: "manual",
      },
      {
        brand_id: brand.id,
        franchisee_id: franchisees[5].id,
        report_type: "Operations Assessment",
        visit_date: "2026-04-10",
        scores: [
          { category: "Safety", score: 24, max: 30 },
          { category: "Product Quality", score: 19, max: 25 },
          { category: "Service", score: 19, max: 25 },
          { category: "Image", score: 16, max: 20 },
        ],
        total_score: 78,
        total_max: 100,
        percentage: 78,
        tier: "DEVELOPING",
        critical_findings: "Speed of service below target. Labor scheduling needs attention.",
        positive_findings: "Product quality improved from last visit. Franchisee engaged and responsive.",
        source: "manual",
      },
    ];

    const { error: aError } = await supabase.from("assessments").insert(assessments);
    if (aError) throw aError;

    return NextResponse.json({
      message: "Paco Taco seeded successfully",
      brand_id: brand.id,
      franchisees: franchisees.length,
      assessments: assessments.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
