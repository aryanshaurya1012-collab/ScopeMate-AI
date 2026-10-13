# ScopeMate — Professional Scope & Quote Engine for Freelancers

**Built for the Hacktoberfest Open-Source AI Challenge, Week 2: “Side Hustle”**

ScopeMate helps independent freelancers turn vague client briefs into clear project scopes, professional proposals, editable deterministic quotes, and diplomatic responses to mid-project requests for extra work.

---

## 1. Problem & Target Users

### The Problem: Scope Creep & Freelancer Vulnerability
Independent freelancers (web developers, UI/UX designers, copywriters, video editors) frequently face project disputes due to:
1. **Unclear Briefs:** Agreeing to vague requests without detailed functional acceptance criteria.
2. **Missing Exclusions:** Failing to explicitly state what is *out of scope*, allowing clients to assume backend migrations, translations, or mobile apps were "included."
3. **Underestimating Effort:** Inability to break down complex requests into realistic hours and contingency buffers.
4. **Awkward Conversations:** Struggling to explain additional charges diplomatically when clients ask for "just one quick change."

### Target Users
- **Freelance Web & Software Engineers:** Frontend, full-stack, and headless CMS builders.
- **UI/UX & Product Designers:** Design systems, wireframes, prototypes, user testing.
- **Brand & Graphic Designers:** Visual identity, marketing assets, pitch decks.
- **Technical Writers & Content Strategists:** Documentation, onboarding guides, SEO copy.
- **Video Editors & Motion Designers:** Product launch teasers, demo reels, social cuts.

---

## 2. Core Features

### Feature A: Client Brief Builder
- Professional, validated input form capturing project name, client details, discipline, raw brief, target audience, budget, currency (USD, EUR, GBP, INR), rate mode (hourly vs fixed), and included revision rounds.
- Quick-fill presets (Web Dev, UI/UX Design, Content Writing, Video Editing) for rapid testing.
- Dedicated field for known exclusions and freelancer constraints.

### Feature B: Open-Weight AI Scope Generation (Gemma 4)
- Leverages Google's open-weight **Gemma 4** (`gemma-4-26b-a4b-it`) model via hosted API inference.
- Distinguishes user-provided facts from model suggestions.
- Generates structured deliverables, verification checklists, explicit exclusions, prerequisite assumptions, risks, milestone duration, and payment triggers.

### Feature C: Real Quote Calculator (Independent Deterministic Math)
- Operates independently of AI arithmetic: all calculations are strictly executed in TypeScript with 2-decimal-place currency precision.
- Editable line items: add, edit, reorder (up/down), and delete.
- Configurable contingency buffer (0%, 10%, 15%, 20%).
- Percentage or fixed commercial discounts.
- Optional tax percentage (0% default; marked "Excluding taxes").
- Milestone payment schedule (e.g., 35% deposit, 35% milestone demo, 30% handoff).

### Feature D: Scope Change Analyzer (Signature Feature)
- Cross-references incoming client emails or Slack requests against approved baseline deliverables and exclusions.
- Classifies each requested item:
  - 🟢 **Likely Included:** Minor tweak or bug fix fitting agreed deliverables.
  - 🔴 **Potential Scope Change:** New functionality or explicitly excluded work.
  - 🟡 **Needs Clarification:** Ambiguous intent requiring client questions.
- Generates transparent reasoning and estimated timeline impact.
- Drafts a polite, professional, firm email message ready to copy and send.
- Suggests priced extra line items and adds them directly to the quote calculator with 1 click.

### Feature E: Local Storage & Project History
- Versioned, resilient browser `localStorage` management.
- Reopen, edit, delete, and search across saved projects.
- Export all projects as a JSON backup file.
- Single-click local data purge for privacy.
- Includes pre-loaded **AeroPay Customer Analytics & Billing Portal** sample project.

### Feature F: Professional A4 Document Export
- Clean browser print stylesheet optimized for A4 PDF export (`window.print()`).
- Formats scope of work, deliverables, exclusions, and quote tables with clean page breaks.
- Hides buttons, sidebars, and navigation in print mode.
- 1-click clipboard copy for client emails and project summaries.

---

## 3. Architecture & Tech Stack

```
scopemate/
├── server.ts               # Express backend hosting API endpoints & Vite middleware
├── src/
│   ├── types/index.ts      # TypeScript definitions for briefs, proposals, & quotes
│   ├── utils/
│   │   ├── calculator.ts   # Deterministic math (subtotals, contingency, tax, currency)
│   │   ├── storage.ts      # Versioned localStorage repository & JSON export
│   │   └── sampleData.ts   # AeroPay sample project blueprint
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation & model badge
│   │   ├── Dashboard.tsx           # Welcome hero, stats, & recent scopes
│   │   ├── BriefBuilder.tsx        # Client brief intake & validation
│   │   ├── ProposalEditor.tsx      # Scope editor & preview tabs
│   │   ├── QuoteCalculator.tsx     # Deterministic line item math
│   │   ├── ScopeChangeAnalyzer.tsx # Signature change request audit engine
│   │   ├── ProjectsList.tsx        # Project library & backup manager
│   │   ├── AboutOpenAI.tsx         # Open AI & privacy transparency
│   │   └── PrintDocument.tsx       # A4 print-optimized document view
│   ├── App.tsx             # Main view router & state coordinator
│   └── index.css           # Tailwind CSS & dedicated @media print rules
└── scripts/
    └── test-all.ts         # Automated test suite for math, validation, & parsing
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend:** Node.js Express server mounting Vite middlewares in dev (`tsx server.ts`).
- **AI SDK:** Google's `@google/genai` TypeScript SDK with server-side User-Agent telemetry.
- **Configured Model:** `gemma-4-26b-a4b-it` (Google Open-Weight Gemma 4).

---

## 4. Open-Weight AI Integration: Gemma 4

### Configured Model Identifier
```typescript
export const GEMMA_MODEL = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';
```

### Why Open-Weight AI Matters
1. **Freedom from Proprietary Lock-In:** Freelancers and agencies avoid dependence on closed commercial ecosystems where pricing or terms can change unpredictably.
2. **Auditability:** Open weights allow independent inspection, reproducible testing, and community-verified safety evaluations.
3. **Portability:** Workflows and prompts engineered for Gemma 4 can be run in private cloud environments, self-hosted GPU clusters, or specialized inference backends (vLLM, Ollama, TensorRT-LLM).

### Hosted Inference Disclosure
In this environment, inference is performed via Google AI Studio’s server-side API integration. Text submitted in briefs is transmitted over TLS to the model provider. ScopeMate makes no false claims of "offline-only" execution.

---

## 5. Environment Variables & API Setup

Configure `.env` or use AI Studio Secrets:

```bash
# GEMINI_API_KEY: Injected by AI Studio or set manually
GEMINI_API_KEY="YOUR_API_KEY"

# GEMMA_MODEL: Configured model identifier (Defaults to gemma-4-26b-a4b-it)
GEMMA_MODEL="gemma-4-26b-a4b-it"

# APP_URL: URL where the app is hosted
APP_URL="http://localhost:3000"
```

---

## 6. Local Installation & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run the automated test suite
npm test

# 3. Start development server (Express + Vite on port 3000)
npm run dev

# 4. Build for production
npm run build

# 5. Run production server
npm start
```

---

## 7. Automated Test Suite

ScopeMate includes a test suite in `scripts/test-all.ts`:
- **Deterministic quote arithmetic:** Subtotals, contingency buffers, discounts, and taxable base calculations.
- **Multi-currency formatting:** USD ($), EUR (€), GBP (£), and INR (₹).
- **Brief input validation:** Required fields, minimum length, rate mode validation.
- **Defensive model JSON parsing:** Stripping markdown code fences and conversational wrapper text.
- **Scope change classification rules:** Validation of `likely_included`, `potential_scope_change`, and `needs_clarification`.

Run tests with:
```bash
npm test
```

---

## 8. Potential Monetization Model (Concept)

- **Free Tier:** Core brief builder, deterministic quote calculator, browser localStorage persistence, and 3 AI scopes per month.
- **Pro Tier ($12/month):** Unlimited Gemma 4 scope generations, unlimited Scope Change audits, custom company branding on PDF exports, and multi-currency exchange rate sync.
- **Agency Tier ($29/month):** Client approval portal links, e-signature integration, and CRM sync.

---

## 9. License

Open source under the Apache 2.0 License.
