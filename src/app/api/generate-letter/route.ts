import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";

export const maxDuration = 60;

interface AssessmentData {
  brandName: string;
  franchiseeName: string;
  locationId: string;
  locationAddress?: string;
  fbcName: string;
  visitDate: string;
  reportType: string;
  // Scoring
  safetyScore: number;
  safetyMax: number;
  productScore: number;
  productMax: number;
  serviceScore: number;
  serviceMax: number;
  imageScore: number;
  imageMax: number;
  // Key findings
  criticalFindings: string;
  positiveFindings: string;
  // Additional context
  previousVisitNotes?: string;
  additionalContext?: string;
}

function calculateTier(totalScore: number): {
  tier: string;
  tone: string;
} {
  if (totalScore < 70)
    return {
      tier: "CRITICAL",
      tone: "Direct and urgent. This location needs immediate corrective action. Be firm but professional — the goal is compliance, not punishment.",
    };
  if (totalScore < 85)
    return {
      tier: "DEVELOPING",
      tone: "Constructive and encouraging. Acknowledge progress but be clear about gaps. Push for accountability with a coaching mindset.",
    };
  if (totalScore < 92)
    return {
      tier: "GOOD",
      tone: "Positive and motivating. Celebrate strengths, identify the 2-3 areas that separate good from elite. Use aspirational language.",
    };
  return {
    tier: "ELITE",
    tone: "Congratulatory and reinforcing. This operator is a model. Highlight what they do that others should emulate. Challenge them to mentor.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: AssessmentData = await request.json();

    const totalScore =
      data.safetyScore + data.productScore + data.serviceScore + data.imageScore;
    const totalMax =
      data.safetyMax + data.productMax + data.serviceMax + data.imageMax;
    const percentage = Math.round((totalScore / totalMax) * 100);
    const { tier, tone } = calculateTier(percentage);

    const anthropic = getAnthropicClient();

    const systemPrompt = `You are Frankie, an AI assistant that generates professional franchise business review follow-up letters for Franchise Business Consultants (FBCs).

You write letters that an FBC would send to a franchisee after an operations assessment or site visit. The letter must feel like it was written by an experienced field consultant — not a robot.

BRAND: ${data.brandName}
PERFORMANCE TIER: ${tier} (${percentage}/100)
TONE GUIDANCE: ${tone}

LETTER STRUCTURE (always follow this exact structure):
1. Opening — reference the visit, date, and purpose
2. Overall Score Summary — state the score, tier, and what it means
3. PEOPLE section — staffing, training, team development findings
4. OPERATIONS section — food safety, procedures, standards compliance
5. SALES section — revenue performance, transaction trends, growth opportunities (use motivational pep-talk tone here, not clinical)
6. LOYALTY section — enrollment rate, program participation (minimum goal is 10% of transactions)
7. YIELD GAP section — if applicable, gap between current and potential performance
8. FINANCIALS section — P&L observations, cost management, profitability
9. THREE PRIORITY GOALS — bold these, numbered 1-2-3, specific and measurable
10. Closing — follow-up commitment with timeframe

RULES:
- Never attribute market-level data to an individual franchisee
- Sales section should be motivational/pep-talk, not clinical
- Close with "Regards," (not "Kind Regards" or "Best Regards")
- Priority goals must be specific, measurable, and time-bound where possible
- Reference specific findings from the assessment data provided
- Keep the letter professional but warm — this is a coaching relationship`;

    const userPrompt = `Generate a follow-up letter for this assessment:

FRANCHISEE: ${data.franchiseeName}
LOCATION: ${data.locationId}${data.locationAddress ? ` — ${data.locationAddress}` : ""}
FBC: ${data.fbcName}
VISIT DATE: ${data.visitDate}
REPORT TYPE: ${data.reportType}

SCORES:
- Safety: ${data.safetyScore}/${data.safetyMax}
- Product Quality: ${data.productScore}/${data.productMax}
- Service: ${data.serviceScore}/${data.serviceMax}
- Image/Cleanliness: ${data.imageScore}/${data.imageMax}
- TOTAL: ${totalScore}/${totalMax} (${percentage}%) — ${tier}

CRITICAL FINDINGS:
${data.criticalFindings || "None reported"}

POSITIVE FINDINGS:
${data.positiveFindings || "None reported"}

${data.previousVisitNotes ? `PREVIOUS VISIT NOTES:\n${data.previousVisitNotes}` : ""}
${data.additionalContext ? `ADDITIONAL CONTEXT:\n${data.additionalContext}` : ""}

Generate the complete follow-up letter now.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const letterContent =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({
      letter: letterContent,
      metadata: {
        tier,
        score: percentage,
        totalScore,
        totalMax,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Letter generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate letter" },
      { status: 500 }
    );
  }
}
