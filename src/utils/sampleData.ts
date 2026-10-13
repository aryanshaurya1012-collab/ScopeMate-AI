import { SavedProject } from '../types/index.ts';

export const SAMPLE_PROJECT: SavedProject = {
  id: 'sample-fintech-portal-2026',
  createdAt: '2026-10-10T14:00:00.000Z',
  updatedAt: '2026-10-12T09:30:00.000Z',
  isSample: true,
  brief: {
    projectName: 'AeroPay Customer Analytics & Billing Portal',
    clientName: 'AeroPay Financial Technologies',
    serviceType: 'web_development',
    clientBrief:
      'We need a complete rebuild of our customer-facing billing & transaction portal in React and Tailwind. The current portal is slow, looks dated from 2018, and doesn’t work on mobile tablets. We need authentication, an interactive dashboard showing monthly recurring revenue & transaction history, downloadable PDF invoices, and an account settings page with webhook credentials. Our team uses Stripe for billing and Supabase for auth/data. We want this delivered in 6 weeks.',
    desiredOutcome:
      'Modern, snappy self-serve portal that reduces support tickets regarding invoice downloads by 50% and works seamlessly on tablets.',
    expectedDeliverables:
      'Figma wireframe review, responsive frontend codebase in React/TypeScript/Tailwind, Stripe customer portal integration, PDF invoice export component, and developer handoff documentation.',
    timeline: '6 weeks (targeted launch mid-November)',
    budgetKnown: true,
    budgetAmount: 6500,
    currency: 'USD',
    rateType: 'hourly',
    hourlyRate: 85,
    availableHours: 80,
    revisionRounds: 2,
    constraintsAndExclusions:
      'Client backend APIs are already built by internal engineers. Excludes backend database schema redesign, payment gateway account underwriting, and native mobile iOS/Android app wrappers.',
    additionalNotes: 'Need clear scope boundaries because client stakeholders frequently request ad-hoc charts during weekly sprints.',
  },
  proposal: {
    projectSummary:
      'ScopeMate scoping for the redesign and implementation of AeroPay’s client billing and transaction portal. This scope establishes exact deliverables, explicit exclusions, and milestone verification criteria to ensure launch readiness within 6 weeks.',
    businessObjective:
      'Elevate user trust, eliminate manual billing support inquiries, and modernize responsive performance for high-volume financial transactions.',
    proposalIntro:
      'Thank you for considering this proposal for the AeroPay Customer Analytics & Billing Portal redesign. As an independent engineer, I prioritize bulletproof reliability, clear communication, and transparent milestone delivery. Below is the detailed scope of work, technical architecture, and transparent quote structure.',
    deliverables: [
      {
        id: 'del-1',
        title: 'Architectural Blueprint & Design System Integration',
        description: 'Audit existing UI components, establish Tailwind design tokens matching AeroPay branding, and deliver responsive layout templates for dashboard, tables, and settings.',
        acceptanceCriteria: [
          'Design tokens approved in Figma/Tailwind',
          'Responsive grid tested at 375px, 768px, 1024px, and 1440px breakpoints',
          'WCAG AA accessible contrast for all financial data tables',
        ],
        estimatedHours: 16,
        estimatedPrice: 1360,
      },
      {
        id: 'del-2',
        title: 'Authentication & Session Flow (Supabase Bridge)',
        description: 'Implement secure login, session renewal, password reset, and protected route guards connecting to AeroPay’s existing Supabase instance.',
        acceptanceCriteria: [
          'Secure token storage and automatic refresh mechanism',
          'Zero plaintext credentials in client state',
          'Graceful handling of expired sessions with redirect preservation',
        ],
        estimatedHours: 14,
        estimatedPrice: 1190,
      },
      {
        id: 'del-3',
        title: 'Transaction History & Analytics Dashboard',
        description: 'Build high-performance virtualized transaction table with client-side filtering (date range, status, amount), pagination, and CSV export.',
        acceptanceCriteria: [
          'Handles 5,000+ transaction rows with smooth 60fps scrolling',
          'Multi-filter combinations work without page reload',
          'Client-side CSV export formats timestamps in user local timezone',
        ],
        estimatedHours: 24,
        estimatedPrice: 2040,
      },
      {
        id: 'del-4',
        title: 'Stripe Customer Portal & PDF Invoice Generation',
        description: 'Integrate Stripe Customer Portal redirect for payment method updates and client-side deterministic PDF invoice generation for transaction receipts.',
        acceptanceCriteria: [
          'One-click Stripe Customer Portal redirect with return URL handling',
          'PDF invoice rendering matches AeroPay company header and VAT details',
          'Print CSS and browser PDF export verified across Chrome, Safari, and Edge',
        ],
        estimatedHours: 18,
        estimatedPrice: 1530,
      },
      {
        id: 'del-5',
        title: 'Deployment, Testing & Developer Handoff',
        description: 'Unit test critical formatters, setup production Vite build pipeline, verify lighthouse score (>90 performance), and conduct 2-hour handoff walkthrough with AeroPay tech lead.',
        acceptanceCriteria: [
          'Clean TypeScript build with zero lint errors',
          'Comprehensive README with environment variables and deploy guide',
          'Recorded video handoff session provided to internal team',
        ],
        estimatedHours: 10,
        estimatedPrice: 850,
      },
    ],
    explicitExclusions: [
      'Backend database migrations or PostgreSQL query optimization outside frontend REST/GraphQL contracts',
      'Integration with unannounced third-party payment gateways other than Stripe',
      'Native mobile applications for App Store or Google Play',
      'Copywriting or translation into languages other than English',
      'Ongoing 24/7 server monitoring or DevOps infrastructure on-call support beyond the 14-day post-launch warranty window',
    ],
    assumptions: [
      'AeroPay backend team delivers stable API endpoints and Swagger/Postman documentation before Week 2',
      'Client provides Stripe test API keys and Supabase credentials within 3 business days of kickoff',
      'Client feedback rounds will be compiled centrally by one designated product owner',
    ],
    dependenciesAndRisks: [
      'Dependency: Timely availability of backend staging APIs. Mitigation: Mock API contracts developed during Week 1 so frontend work never stalls.',
      'Risk: Scope creep on custom charting libraries. Mitigation: Chart components strictly adhere to defined metric cards; complex custom dashboards require separate change order.',
    ],
    clarificationQuestions: [
      'Will client end-users require multi-currency display (e.g. EUR/GBP) or is billing strictly settled in USD?',
      'Is two-factor authentication (2FA) handled directly by Supabase Auth UI or required within custom modal flows?',
    ],
    milestones: [
      {
        id: 'ms-1',
        name: 'Sprint 1: Architecture & Design Token Approval',
        duration: 'Days 1 – 10',
        deliverableKeys: ['Architectural Blueprint', 'Design System Integration'],
        percentageOfTotal: 30,
      },
      {
        id: 'ms-2',
        name: 'Sprint 2: Auth, Transactions & Stripe Flow',
        duration: 'Days 11 – 25',
        deliverableKeys: ['Supabase Bridge', 'Transaction History', 'Stripe Customer Portal'],
        percentageOfTotal: 40,
      },
      {
        id: 'ms-3',
        name: 'Sprint 3: PDF Invoices, QA & Production Handoff',
        duration: 'Days 26 – 40',
        deliverableKeys: ['PDF Invoice Gen', 'Lighthouse Optimization', 'Developer Handoff'],
        percentageOfTotal: 30,
      },
    ],
    revisionTerms:
      'Includes two (2) consolidated rounds of revisions per milestone. Revisions apply to agreed scope items only. Requests outside defined deliverables or changing architectural direction will be assessed via the Scope Change Analyzer.',
    suggestedPaymentSchedule: [
      {
        id: 'pay-1',
        phase: 'Kickoff Deposit',
        percentage: 35,
        trigger: 'Due upon proposal approval prior to project commencement',
      },
      {
        id: 'pay-2',
        phase: 'Milestone 2 Delivery',
        percentage: 35,
        trigger: 'Due upon staging demo of transaction table & Stripe integration',
      },
      {
        id: 'pay-3',
        phase: 'Final Handoff & Launch',
        percentage: 30,
        trigger: 'Due upon repository code transfer and deployment verification',
      },
    ],
    nextSteps: [
      'Review and adjust deliverables or line item quantities as required.',
      'Approve this proposal document and confirm scheduled kickoff date.',
      'Provide repository access, staging API docs, and designated product owner contact.',
    ],
    modelUsed: 'gemma-4-26b-a4b-it (Sample Verification Blueprint)',
  },
  quoteItems: [
    {
      id: 'item-1',
      title: 'Architectural Blueprint & Design System Integration',
      description: 'Audit UI, setup Tailwind tokens, build responsive layout shells',
      quantity: 16,
      unitRate: 85,
    },
    {
      id: 'item-2',
      title: 'Authentication & Session Flow (Supabase Bridge)',
      description: 'Route guards, token refresh, password recovery, session handling',
      quantity: 14,
      unitRate: 85,
    },
    {
      id: 'item-3',
      title: 'Transaction History & Analytics Dashboard',
      description: 'Virtualized table, multi-parameter filters, CSV export',
      quantity: 24,
      unitRate: 85,
    },
    {
      id: 'item-4',
      title: 'Stripe Customer Portal & PDF Invoice Generation',
      description: 'Stripe customer session redirect and client-side PDF receipts',
      quantity: 18,
      unitRate: 85,
    },
    {
      id: 'item-5',
      title: 'Deployment, Testing & Developer Handoff',
      description: 'TypeScript clean build, Lighthouse optimization, handoff docs',
      quantity: 10,
      unitRate: 85,
    },
  ],
  quoteConfig: {
    currency: 'USD',
    rateType: 'hourly',
    contingencyPercent: 10,
    discountType: 'percentage',
    discountValue: 0,
    taxPercent: 0,
    validityDays: 14,
    paymentSchedule: [
      {
        id: 'pay-1',
        phase: 'Kickoff Deposit (35%)',
        percentage: 35,
        trigger: 'Upon signing proposal prior to kickoff',
      },
      {
        id: 'pay-2',
        phase: 'Sprint 2 Milestone (35%)',
        percentage: 35,
        trigger: 'Upon delivery of staging build with active Stripe auth',
      },
      {
        id: 'pay-3',
        phase: 'Final Delivery & Code Handoff (30%)',
        percentage: 30,
        trigger: 'Upon transfer of Git repository and deployment guide',
      },
    ],
    notes: 'Estimate valid for 14 days. Excludes third-party API subscription costs (Stripe/Supabase). Taxes not included.',
  },
  scopeAnalyses: [
    {
      id: 'analysis-sample-1',
      createdAt: '2026-10-12T10:15:00.000Z',
      clientMessage:
        'Hey! Quick question: Our marketing VP wants users to be able to toggle the entire portal into dark mode, and also we want to add an automated daily email digest feature where users receive their summary directly in their inbox. Can we have this in the launch next week?',
      requestSummary:
        'Client requests two new features during active sprint: 1) System-wide Dark Mode theme toggle, and 2) Automated backend daily email digest service.',
      items: [
        {
          id: 'item-sc-1',
          title: 'Dark Mode Theme Toggle',
          classification: 'potential_scope_change',
          originalReference: 'Architectural Blueprint & Design System Integration (Deliverable 1)',
          reasoning:
            'Original design tokens were specified for standard AeroPay light theme. Adding full dark mode requires defining secondary semantic color tokens, high-contrast states for all data tables, and persistent theme storage in localStorage.',
          estimatedHoursImpact: 8,
          estimatedTimelineImpact: '+2 to 3 days',
        },
        {
          id: 'item-sc-2',
          title: 'Automated Daily Email Digest Service',
          classification: 'potential_scope_change',
          originalReference: 'Explicit Exclusions: "Backend database migrations or query optimization outside frontend REST/GraphQL contracts"',
          reasoning:
            'A daily automated email digest is entirely a backend server cron job / queue architecture (e.g. SendGrid/Resend triggered via Celery/Supabase Edge Functions). This is outside the agreed frontend React portal scope.',
          estimatedHoursImpact: 14,
          estimatedTimelineImpact: '+4 to 5 days',
        },
        {
          id: 'item-sc-3',
          title: 'Timeline feasibility for launch next week',
          classification: 'needs_clarification',
          originalReference: 'Agreed 6-week milestone timeline',
          reasoning:
            'Injecting 22 additional engineering hours into the immediate next week would compress QA and risk delivery of agreed Sprint 2 deliverables.',
          estimatedHoursImpact: 0,
          estimatedTimelineImpact: 'Requires milestone extension',
        },
      ],
      clarificationQuestionsToAsk: [
        'Would you like dark mode prioritized as an optional phase 1 addon or scheduled for phase 2 post-launch?',
        'Does the internal backend team already have an email service endpoint (e.g. Resend/Postmark) or would the backend job need to be designed from scratch?',
      ],
      changeRequestSummary:
        'Scope change adding Dark Mode UI Theme and Backend Email Digest service (~22 hours total effort).',
      clientMessageDraft:
        'Hi Alex,\n\nThanks for sharing the feedback! Dark mode is definitely a great polish feature, and the automated daily email digest sounds like high-value utility for users.\n\nReviewing our initial scope agreement:\n1. The current contract focuses on the frontend React billing portal and transaction table with our agreed light brand palette.\n2. Dark mode requires about 8 additional hours to ensure every table, modal, and badge has WCAG-compliant dark contrast.\n3. The automated daily email digest is a backend scheduled task (cron/email service) rather than a frontend portal feature, which is estimated at roughly 14 hours if implemented here, or could be handled by your internal backend team.\n\nTo keep our launch next week completely on schedule, I recommend one of two options:\n- Option A: We launch the agreed core portal on time next week, and add Dark Mode and Email Digests in an immediate follow-up Sprint (estimated at 22 hrs / $1,870).\n- Option B: We approve a scope change order now and extend the release window by 4 business days to incorporate both features.\n\nLet me know which option suits the team best!\n\nBest regards,',
      suggestedExtraLineItems: [
        {
          id: 'extra-1',
          title: 'Dark Mode UI Palette & Contrast Verification',
          description: 'Semantic Tailwind dark tokens, table high-contrast adjustments, theme switch hook',
          quantity: 8,
          unitRate: 85,
          isAdditional: true,
        },
        {
          id: 'extra-2',
          title: 'Automated Daily Email Digest Setup',
          description: 'Edge function cron handler, transactional email template, digest compilation logic',
          quantity: 14,
          unitRate: 85,
          isAdditional: true,
        },
      ],
      modelUsed: 'gemma-4-26b-a4b-it (Sample Verification Blueprint)',
    },
  ],
};
