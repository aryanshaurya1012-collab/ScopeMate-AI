export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export type RateType = 'hourly' | 'fixed';

export type ServiceType =
  | 'web_development'
  | 'ui_ux_design'
  | 'graphic_design'
  | 'content_writing'
  | 'video_editing'
  | 'other';

export interface ClientBrief {
  projectName: string;
  clientName?: string;
  serviceType: ServiceType;
  clientBrief: string;
  desiredOutcome?: string;
  expectedDeliverables?: string;
  timeline?: string;
  budgetKnown?: boolean;
  budgetAmount?: number;
  currency: Currency;
  rateType: RateType;
  hourlyRate?: number;
  fixedBudget?: number;
  availableHours?: number;
  revisionRounds: number;
  constraintsAndExclusions?: string;
  additionalNotes?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  estimatedHours?: number;
  estimatedPrice?: number;
}

export interface Milestone {
  id: string;
  name: string;
  duration: string;
  deliverableKeys: string[];
  percentageOfTotal?: number;
}

export interface PaymentScheduleItem {
  id: string;
  phase: string;
  percentage: number;
  trigger: string;
}

export interface QuoteLineItem {
  id: string;
  title: string;
  description: string;
  quantity: number; // hours or unit quantity
  unitRate: number; // hourly rate or unit cost
  isAdditional?: boolean; // added via scope change analyzer
}

export interface QuoteConfig {
  currency: Currency;
  rateType: RateType;
  contingencyPercent: number; // e.g. 10
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxPercent: number; // 0 by default, explicitly opt-in
  validityDays: number; // e.g. 14, 30
  paymentSchedule: PaymentScheduleItem[];
  notes?: string;
}

export interface QuoteTotals {
  subtotal: number;
  contingencyAmount: number;
  discountAmount: number;
  taxableBase: number;
  taxAmount: number;
  grandTotal: number;
}

export interface ProposalContent {
  projectSummary: string;
  businessObjective: string;
  proposalIntro: string;
  deliverables: Deliverable[];
  explicitExclusions: string[];
  assumptions: string[];
  dependenciesAndRisks: string[];
  clarificationQuestions: string[];
  milestones: Milestone[];
  revisionTerms: string;
  suggestedPaymentSchedule: PaymentScheduleItem[];
  nextSteps: string[];
  modelUsed?: string;
}

export type ScopeClassification =
  | 'likely_included'
  | 'potential_scope_change'
  | 'needs_clarification';

export interface ScopeChangeItem {
  id: string;
  title: string;
  classification: ScopeClassification;
  originalReference: string;
  reasoning: string;
  estimatedHoursImpact?: number;
  estimatedTimelineImpact?: string;
  userOverride?: ScopeClassification;
}

export interface ScopeChangeAnalysis {
  id: string;
  createdAt: string;
  clientMessage: string;
  requestSummary: string;
  items: ScopeChangeItem[];
  clarificationQuestionsToAsk: string[];
  changeRequestSummary: string;
  clientMessageDraft: string;
  suggestedExtraLineItems: QuoteLineItem[];
  modelUsed?: string;
}

export interface SavedProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  brief: ClientBrief;
  proposal: ProposalContent;
  quoteItems: QuoteLineItem[];
  quoteConfig: QuoteConfig;
  scopeAnalyses: ScopeChangeAnalysis[];
  isSample?: boolean;
}
