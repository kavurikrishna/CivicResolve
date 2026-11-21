import { NextRequest, NextResponse } from 'next/server';
import { validateCsrfOrigin } from '@/lib/security';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

interface GeminiAnalysisRequest {
  title: string;
  description: string;
  location: string;
  category?: string;
}

const SYSTEM_PROMPT = `You are CivicResolve AI, an expert system for analyzing civic infrastructure complaints. 
Analyze the complaint and return ONLY valid JSON with these exact fields:
{
  "category": "one of: Road Damage, Garbage & Waste, Water & Drainage, Street Lighting, Sewage, Public Infrastructure, Other",
  "priority": "one of: Critical, High, Medium, Low",
  "department": "responsible department name",
  "urgency_reason": "brief explanation of why this priority level was assigned",
  "public_impact": "explanation of potential impact on the public",
  "recommended_action": "specific actionable recommendation",
  "summary": "concise 1-2 sentence summary of the complaint"
}

Priority guidelines:
- Critical: Immediate safety risk, active emergency, risk to life or major infrastructure failure
- High: Significant safety hazard, major disruption, urgent health risk  
- Medium: Moderate issue affecting quality of life, non-emergency infrastructure damage
- Low: Minor inconvenience, aesthetic issues, non-urgent repairs needed

Always consider: safety risk, severity, public impact, potential for further damage.
Return ONLY the JSON object, no markdown, no explanation, no code blocks.`;

function getFallbackAnalysis(title: string, description: string, category?: string) {
  const text = `${title} ${description}`.toLowerCase();
  
  let detectedCategory = category || 'Other';
  if (!category || category === 'Auto-detect') {
    if (text.includes('pothole') || text.includes('road') || text.includes('pavement')) detectedCategory = 'Road Damage';
    else if (text.includes('garbage') || text.includes('waste') || text.includes('bin') || text.includes('trash')) detectedCategory = 'Garbage & Waste';
    else if (text.includes('water') || text.includes('pipe') || text.includes('flood') || text.includes('drain')) detectedCategory = 'Water & Drainage';
    else if (text.includes('light') || text.includes('lamp') || text.includes('electricity') || text.includes('streetlight')) detectedCategory = 'Street Lighting';
    else if (text.includes('sewage') || text.includes('sewer') || text.includes('smell') || text.includes('stench')) detectedCategory = 'Sewage';
    else detectedCategory = 'Public Infrastructure';
  }

  let priority = 'Medium';
  if (text.includes('burst') || text.includes('accident') || text.includes('emergency') || text.includes('injury') || text.includes('dangerous') || text.includes('critical')) priority = 'Critical';
  else if (text.includes('urgent') || text.includes('safety') || text.includes('hazard') || text.includes('overflow') || text.includes('blocked')) priority = 'High';
  else if (text.includes('minor') || text.includes('small') || text.includes('slight')) priority = 'Low';

  const deptMap: Record<string, string> = {
    'Road Damage': 'Roads and Infrastructure',
    'Garbage & Waste': 'Sanitation and Waste Management',
    'Water & Drainage': 'Water Supply and Drainage',
    'Street Lighting': 'Electricity and Public Lighting',
    'Sewage': 'Sewage and Plumbing',
    'Public Infrastructure': 'Public Works Department',
    'Other': 'Urban Development',
  };

  return {
    category: detectedCategory,
    priority,
    department: deptMap[detectedCategory] || 'Public Works Department',
    urgency_reason: `Classified as ${priority.toLowerCase()} priority based on keyword analysis. Manual review recommended.`,
    public_impact: `This ${detectedCategory.toLowerCase()} issue may affect residents and commuters in the reported area.`,
    recommended_action: `Assign to ${deptMap[detectedCategory] || 'Public Works Department'} for assessment and resolution.`,
    summary: `${detectedCategory} complaint: ${title.slice(0, 100)}. Requires departmental review and action.`,
    is_fallback: true,
  };
}

function validateAnalysis(data: Record<string, unknown>) {
  const validCategories = ['Road Damage', 'Garbage & Waste', 'Water & Drainage', 'Street Lighting', 'Sewage', 'Public Infrastructure', 'Other'];
  const validPriorities = ['Critical', 'High', 'Medium', 'Low'];
  
  if (!validCategories.includes(data.category as string)) data.category = 'Other';
  if (!validPriorities.includes(data.priority as string)) data.priority = 'Medium';
  if (!data.department) data.department = 'Public Works Department';
  if (!data.urgency_reason) data.urgency_reason = 'Standard review required.';
  if (!data.public_impact) data.public_impact = 'Impact assessment pending.';
  if (!data.recommended_action) data.recommended_action = 'Assign to appropriate department for review.';
  if (!data.summary) data.summary = 'Civic issue reported for review.';
  
  return data;
}

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF Origin Verification
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden: Invalid request origin' }, { status: 403 });
    }

    // 2. Rate Limiting (30 requests per minute per IP to protect downstream APIs)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`ai_analyze:${clientIp}`, 30, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Please retry in ${rateLimit.reset} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
      );
    }

    // 3. Payload parsing & size check
    let body: GeminiAnalysisRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const { title, description, location, category } = body;

    // 4. Strict input validation
    if (!title || typeof title !== 'string' || !description || typeof description !== 'string' || !location || typeof location !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: title, description, location' },
        { status: 400 }
      );
    }

    if (title.length > 200 || description.length > 5000 || location.length > 300) {
      return NextResponse.json(
        { error: 'Input exceeds maximum allowed length' },
        { status: 400 }
      );
    }

    // 5. Sanitize inputs
    const sanitizedTitle = title.replace(/[<>]/g, '').trim();
    const sanitizedDesc = description.replace(/[<>]/g, '').trim();
    const sanitizedLocation = location.replace(/[<>]/g, '').trim();
    const sanitizedCategory = category && typeof category === 'string' ? category.replace(/[<>]/g, '').trim() : undefined;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.length < 20) {
      const fallback = getFallbackAnalysis(sanitizedTitle, sanitizedDesc, sanitizedCategory);
      return NextResponse.json(fallback);
    }

    const userPrompt = `Analyze this civic complaint:

Title: ${sanitizedTitle}
Description: ${sanitizedDesc}
Location: ${sanitizedLocation}
${sanitizedCategory && sanitizedCategory !== 'Auto-detect' ? `Reported Category: ${sanitizedCategory}` : ''}

Provide your analysis as JSON.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              topK: 1,
              topP: 0.8,
              maxOutputTokens: 500,
            },
          }),
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      console.warn('Gemini API status not OK, switching to fallback classification:', response.status);
      const fallback = getFallbackAnalysis(sanitizedTitle, sanitizedDesc, sanitizedCategory);
      return NextResponse.json(fallback);
    }

    const geminiData = await response.json();
    const content = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      const fallback = getFallbackAnalysis(sanitizedTitle, sanitizedDesc, sanitizedCategory);
      return NextResponse.json(fallback);
    }

    // Parse JSON from Gemini response
    let parsed: Record<string, unknown>;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const fallback = getFallbackAnalysis(sanitizedTitle, sanitizedDesc, sanitizedCategory);
      return NextResponse.json(fallback);
    }

    const validated = validateAnalysis(parsed);
    return NextResponse.json({ ...validated, is_fallback: false });
  } catch (error: any) {
    console.error('AI analysis service error:', error?.message || error);
    return NextResponse.json(
      { error: 'Analysis service temporarily unavailable' },
      { status: 503 }
    );
  }
}
