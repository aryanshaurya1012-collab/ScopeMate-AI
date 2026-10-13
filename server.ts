import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Configured Gemma open-weight model identifier (never hidden in secrets)
export const GEMMA_MODEL = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';

app.use(express.json({ limit: '2mb' }));

// Helper to initialize GoogleGenAI with mandatory User-Agent
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to strip markdown and extract valid JSON
function parseJsonSafely(rawText: string): any {
  if (!rawText) throw new Error('Empty response from model');
  
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Find first '{' or '[' and last '}' or ']'
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIdx = 0;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace !== -1) cleaned = cleaned.substring(startIdx, lastBrace + 1);
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket !== -1) cleaned = cleaned.substring(startIdx, lastBracket + 1);
  }

  return JSON.parse(cleaned);
}

// GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    product: 'ScopeMate',
    model: GEMMA_MODEL,
    isOpenWeight: true,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// POST /api/proposal
app.post('/api/proposal', async (req: Request, res: Response) => {
  try {
    const brief = req.body;
    if (!brief || !brief.projectName || !brief.clientBrief) {
      res.status(400).json({
        error: true,
        message: 'Project name and client brief are required fields.',
      });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: true,
        code: 'MISSING_API_KEY',
        message: 'GEMINI_API_KEY is not configured on the server. Please attach an API key in the Secrets panel, or explore the pre-loaded sample project.',
        model: GEMMA_MODEL,
        canUseSample: true,
      });
      return;
    }

    const ai = getGenAIClient();

    const prompt = `
You are ScopeMate, an expert freelance contract, project scoping, and proposal architect.
Your role is to analyze a client brief and produce an honest, unambiguous, professional project scope and quote structure for an independent freelancer.

PROJECT DETAILS SUBMITTED BY FREELANCER:
- Project Name: ${brief.projectName}
- Client Name: ${brief.clientName || 'Client / Stakeholder'}
- Service Type: ${brief.serviceType || 'General Professional Service'}
- Client Original Brief:
"""
${brief.clientBrief}
"""
- Desired Outcome & Audience: ${brief.desiredOutcome || 'Not explicitly specified'}
- Expected Deliverables: ${brief.expectedDeliverables || 'To be determined by project scope'}
- Target Timeline: ${brief.timeline || 'Not specified (estimate reasonable milestones)'}
- Client Budget: ${brief.budgetKnown ? `${brief.currency || 'USD'} ${brief.budgetAmount}` : 'Unknown / not agreed'}
- Preferred Currency: ${brief.currency || 'USD'}
- Freelancer Rate Mode: ${brief.rateType || 'hourly'}
- Freelancer Rate: ${brief.rateType === 'hourly' ? `${brief.currency || 'USD'} ${brief.hourlyRate || 75}/hr` : `${brief.currency || 'USD'} ${brief.fixedBudget || 3000} fixed`}
- Estimated Available Hours: ${brief.availableHours || 'Flexible'}
- Included Revision Rounds: ${brief.revisionRounds || 2} rounds
- Explicit Constraints & Exclusions noted by user: ${brief.constraintsAndExclusions || 'None specified'}
- Additional Notes: ${brief.additionalNotes || 'None'}

CRITICAL GUIDELINES:
1. Distinguish user-provided facts from suggestions. If deadlines, pricing, or requirements are missing, flag them clearly rather than fabricating agreements.
2. Formulate explicit exclusions to prevent scope creep (e.g., backend migrations, third-party licensing, translation, 24/7 on-call).
3. Provide concrete acceptance criteria for EACH deliverable.
4. Estimate realistic hours or quantities for each deliverable item.
5. All financial totals will be computed deterministically on the client; provide realistic individual line item hours and suggested unit rates.
6. Return purely valid JSON adhering strictly to the schema below.

RETURN A JSON OBJECT WITH THE FOLLOWING STRUCTURE:
{
  "projectSummary": "Concise 2-3 sentence summary of the project scope and intent",
  "businessObjective": "Clear statement of the primary business outcome and target impact",
  "proposalIntro": "Professional, warm, client-ready introduction for the proposal document",
  "deliverables": [
    {
      "id": "del-1",
      "title": "Clear Deliverable Title",
      "description": "Specific functional description of what is built or produced",
      "acceptanceCriteria": [
        "Measurable verification criterion 1",
        "Measurable verification criterion 2",
        "Measurable verification criterion 3"
      ],
      "estimatedHours": 15,
      "estimatedPrice": 1200
    }
  ],
  "explicitExclusions": [
    "Specific out-of-scope task 1",
    "Specific out-of-scope task 2",
    "Specific out-of-scope task 3",
    "Specific out-of-scope task 4"
  ],
  "assumptions": [
    "Prerequisite assumption 1 (e.g. client supplies assets by week 1)",
    "Prerequisite assumption 2",
    "Prerequisite assumption 3"
  ],
  "dependenciesAndRisks": [
    "Risk or dependency 1 and mitigation",
    "Risk or dependency 2 and mitigation"
  ],
  "clarificationQuestions": [
    "Important clarification question for client 1",
    "Important clarification question for client 2"
  ],
  "milestones": [
    {
      "id": "ms-1",
      "name": "Phase 1: Discovery & Architecture",
      "duration": "Sprint 1 (Days 1-7)",
      "deliverableKeys": ["Deliverable Title 1"],
      "percentageOfTotal": 35
    }
  ],
  "revisionTerms": "Clear policy on the included revision rounds (e.g. 2 consolidated rounds) and how out-of-scope changes are handled",
  "suggestedPaymentSchedule": [
    {
      "id": "pay-1",
      "phase": "Kickoff Deposit",
      "percentage": 40,
      "trigger": "Due upon proposal acceptance prior to starting work"
    },
    {
      "id": "pay-2",
      "phase": "Interim Milestone",
      "percentage": 30,
      "trigger": "Due upon staging delivery"
    },
    {
      "id": "pay-3",
      "phase": "Final Delivery",
      "percentage": 30,
      "trigger": "Due upon final asset handoff"
    }
  ],
  "nextSteps": [
    "Review and approve project scope and timeline",
    "Provide prerequisite credentials and designated contact",
    "Submit initial kickoff deposit"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = parseJsonSafely(response.text || '{}');
    parsed.modelUsed = `${GEMMA_MODEL} (Google Open-Weight)`;

    res.json({
      success: true,
      proposal: parsed,
      modelUsed: GEMMA_MODEL,
    });
  } catch (err: any) {
    console.error('Error generating proposal with Gemma model:', err);
    const isUpstreamUnavailable = err.status === 500 || err.message?.includes('500') || err.message?.includes('INTERNAL');
    res.status(502).json({
      error: true,
      code: isUpstreamUnavailable ? 'GEMMA_UNAVAILABLE' : 'GENERATION_FAILED',
      message: isUpstreamUnavailable
        ? `The hosted Gemma 4 model (${GEMMA_MODEL}) returned an upstream service error (500 Internal). As per project specifications, proprietary models will not be silently substituted. Please explore the verified workflow using Sample Mode or retry shortly.`
        : (err.message || 'An error occurred during Gemma inference.'),
      model: GEMMA_MODEL,
      canUseSample: true,
    });
  }
});

// POST /api/scope-change
app.post('/api/scope-change', async (req: Request, res: Response) => {
  try {
    const { originalScope, newClientMessage, projectContext } = req.body;
    if (!originalScope || !newClientMessage) {
      res.status(400).json({
        error: true,
        message: 'Original scope and new client message are required.',
      });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: true,
        code: 'MISSING_API_KEY',
        message: 'GEMINI_API_KEY is not configured on the server. Please attach an API key in the Secrets panel, or explore the pre-loaded sample project.',
        model: GEMMA_MODEL,
        canUseSample: true,
      });
      return;
    }

    const ai = getGenAIClient();

    const prompt = `
You are ScopeMate's Scope Change Analyzer.
Your task is to analyze a new client message, feature request, or change request against an agreed original project scope.

AGREED ORIGINAL PROJECT SCOPE:
- Project Name: ${originalScope.projectName || 'Active Project'}
- Approved Deliverables:
${(originalScope.deliverables || []).map((d: any, i: number) => `  ${i + 1}. ${d.title}: ${d.description}`).join('\n')}
- Explicit Exclusions in Agreement:
${(originalScope.explicitExclusions || []).map((e: string) => `  - ${e}`).join('\n')}
- Key Assumptions:
${(originalScope.assumptions || []).map((a: string) => `  - ${a}`).join('\n')}
- Revision Policy: ${originalScope.revisionTerms || 'Standard consolidated rounds for agreed deliverables only'}
${projectContext ? `- Additional Context: ${projectContext}` : ''}

NEW CLIENT MESSAGE / REQUEST:
"""
${newClientMessage}
"""

ANALYSIS RULES:
1. Carefully break down each distinct request or item implied in the client message.
2. Classify each item into EXACTLY ONE of these three classifications:
   - "likely_included" (Fits squarely within the agreed deliverables, minor cosmetic tweak within included revisions, or direct bug fix)
   - "potential_scope_change" (New functionality, new integrations, distinct deliverables not in original scope, or explicitly excluded items)
   - "needs_clarification" (Ambiguous intent, unclear technical requirements, or depends on client decisions)
3. For each item:
   - Cite the relevant original deliverable, exclusion, or assumption.
   - Explain the neutral, professional reasoning behind your classification.
   - Estimate realistic hours impact (e.g. 4-12 hours for scope change items, 0 for included).
   - Estimate timeline impact (e.g. "+2 business days", "None", or "Requires sprint extension").
4. Formulate specific questions the freelancer should ask the client to clarify boundaries.
5. Draft a polite, respectful, firm, and diplomatic message the freelancer can send directly to the client.
   - Acknowledge the idea positively.
   - Clarify original agreement terms without sounding adversarial.
   - Propose clear options (e.g. Option A: stick to current launch and schedule this as Phase 2; Option B: approve a scope change estimate with updated timeline).
6. Propose suggested extra quote line items for the potential scope changes so the freelancer can quote the additional fee easily.

RETURN PURELY VALID JSON WITH THIS STRUCTURE:
{
  "requestSummary": "Concise 1-2 sentence overview of the client request",
  "items": [
    {
      "id": "sc-item-1",
      "title": "Specific Request Item",
      "classification": "potential_scope_change", // must be "likely_included" | "potential_scope_change" | "needs_clarification"
      "originalReference": "Deliverable 2 or Explicit Exclusion on Third-Party APIs",
      "reasoning": "Neutral explanation of why this constitutes a scope change or is included",
      "estimatedHoursImpact": 6,
      "estimatedTimelineImpact": "+2 days"
    }
  ],
  "clarificationQuestionsToAsk": [
    "Specific question 1 for the client",
    "Specific question 2 for the client"
  ],
  "changeRequestSummary": "High-level summary of the scope change impact",
  "clientMessageDraft": "Hi [Client Name],\\n\\nThanks for reaching out!...",
  "suggestedExtraLineItems": [
    {
      "id": "extra-1",
      "title": "Title of additional task",
      "description": "Scope of additional work",
      "quantity": 6,
      "unitRate": 75,
      "isAdditional": true
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = parseJsonSafely(response.text || '{}');
    parsed.modelUsed = `${GEMMA_MODEL} (Google Open-Weight)`;

    res.json({
      success: true,
      analysis: parsed,
      modelUsed: GEMMA_MODEL,
    });
  } catch (err: any) {
    console.error('Error analyzing scope change with Gemma model:', err);
    const isUpstreamUnavailable = err.status === 500 || err.message?.includes('500') || err.message?.includes('INTERNAL');
    res.status(502).json({
      error: true,
      code: isUpstreamUnavailable ? 'GEMMA_UNAVAILABLE' : 'ANALYSIS_FAILED',
      message: isUpstreamUnavailable
        ? `The hosted Gemma 4 model (${GEMMA_MODEL}) returned an upstream service error (500 Internal). As per project specifications, proprietary models will not be silently substituted. Please explore the verified workflow using Sample Mode or retry shortly.`
        : (err.message || 'An error occurred during scope change analysis.'),
      model: GEMMA_MODEL,
      canUseSample: true,
    });
  }
});

// POST /api/regenerate-section
app.post('/api/regenerate-section', async (req: Request, res: Response) => {
  try {
    const { sectionName, projectContext, currentContent } = req.body;
    if (!sectionName || !projectContext) {
      res.status(400).json({
        error: true,
        message: 'sectionName and projectContext are required.',
      });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: true,
        code: 'MISSING_API_KEY',
        message: 'GEMINI_API_KEY is not configured on the server.',
        model: GEMMA_MODEL,
      });
      return;
    }

    const ai = getGenAIClient();

    const prompt = `
You are ScopeMate, regenerating only the "${sectionName}" section of a freelance project proposal.
Model: ${GEMMA_MODEL} (Google Open-Weight).

PROJECT CONTEXT:
${typeof projectContext === 'string' ? projectContext : JSON.stringify(projectContext, null, 2)}

CURRENT CONTENT FOR THIS SECTION:
${typeof currentContent === 'string' ? currentContent : JSON.stringify(currentContent, null, 2)}

TASK:
Provide an updated, polished, professional version of this section that is more comprehensive, prevents scope creep, and protects the freelancer's time.

RETURN PURELY VALID JSON:
{
  "sectionName": "${sectionName}",
  "content": ... // matching the data type (string, array of strings, or array of objects) appropriate for ${sectionName}
}
`;

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = parseJsonSafely(response.text || '{}');
    res.json({
      success: true,
      result: parsed,
      modelUsed: GEMMA_MODEL,
    });
  } catch (err: any) {
    console.error('Error regenerating section:', err);
    res.status(500).json({
      error: true,
      message: err.message || 'Failed to regenerate section.',
      model: GEMMA_MODEL,
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScopeMate] Server running on http://0.0.0.0:${PORT} (Mode: ${isProd ? 'production' : 'development'})`);
    console.log(`[ScopeMate] Configured AI Model: ${GEMMA_MODEL}`);
  });
}

startServer();
