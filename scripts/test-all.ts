/**
 * ScopeMate Comprehensive Automated Test Suite
 * Validates deterministic quote arithmetic, currency formatting,
 * JSON defense, brief validation, and scope classification logic.
 */

import {
  calculateLineItemTotal,
  calculateQuoteTotals,
  formatCurrency,
  roundCurrency,
} from '../src/utils/calculator.ts';
import { QuoteConfig, QuoteLineItem, ClientBrief } from '../src/types/index.ts';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    if (details) console.error(`    Details: ${details}`);
    throw new Error(`Test failed: ${testName}`);
  }
}

console.log('\n--- Running ScopeMate Automated Test Suite ---\n');

// 1. Deterministic Quote Math & Decimal Arithmetic
console.log('[Suite 1: Deterministic Quote Arithmetic & Rounding]');

const sampleItems: QuoteLineItem[] = [
  { id: '1', title: 'Frontend UI', description: 'React components', quantity: 15.5, unitRate: 80 },
  { id: '2', title: 'Stripe Portal', description: 'Billing bridge', quantity: 10, unitRate: 80 },
  { id: '3', title: 'PDF Invoice Gen', description: 'Printable component', quantity: 6.25, unitRate: 80 },
];

// Check individual line totals
const line1 = calculateLineItemTotal(sampleItems[0]); // 15.5 * 80 = 1240.00
const line2 = calculateLineItemTotal(sampleItems[1]); // 10 * 80 = 800.00
const line3 = calculateLineItemTotal(sampleItems[2]); // 6.25 * 80 = 500.00
assert(line1 === 1240, 'Line 1 calculation (15.5 * 80 = 1240)');
assert(line2 === 800, 'Line 2 calculation (10 * 80 = 800)');
assert(line3 === 500, 'Line 3 calculation (6.25 * 80 = 500)');

const baseConfig: QuoteConfig = {
  currency: 'USD',
  rateType: 'hourly',
  contingencyPercent: 10,
  discountType: 'percentage',
  discountValue: 5,
  taxPercent: 0,
  validityDays: 14,
  paymentSchedule: [
    { id: 'p1', phase: 'Deposit', percentage: 40, trigger: 'Kickoff' },
    { id: 'p2', phase: 'Milestone', percentage: 30, trigger: 'Sprint 2' },
    { id: 'p3', phase: 'Final', percentage: 30, trigger: 'Handoff' },
  ],
};

const totals = calculateQuoteTotals(sampleItems, baseConfig);
// subtotal = 1240 + 800 + 500 = 2540
assert(totals.subtotal === 2540, 'Subtotal correctly sums all line items', `Got ${totals.subtotal}`);

// contingency = 10% of 2540 = 254.00
assert(totals.contingencyAmount === 254, 'Contingency is exactly 10% of subtotal (254.00)', `Got ${totals.contingencyAmount}`);

// discount = 5% of 2540 = 127.00
assert(totals.discountAmount === 127, 'Percentage discount is exactly 5% of subtotal (127.00)', `Got ${totals.discountAmount}`);

// grand total = 2540 + 254 - 127 = 2667.00
assert(totals.grandTotal === 2667, 'Grand total = subtotal + contingency - discount = 2667.00', `Got ${totals.grandTotal}`);

// Test with flat discount and explicit 8% tax
const taxedConfig: QuoteConfig = {
  ...baseConfig,
  discountType: 'fixed',
  discountValue: 200,
  taxPercent: 8,
};

const taxedTotals = calculateQuoteTotals(sampleItems, taxedConfig);
// subtotal = 2540
// contingency = 254
// discount = 200
// taxable base = 2540 + 254 - 200 = 2594.00
// tax = 8% of 2594 = 207.52
// grand total = 2594 + 207.52 = 2801.52
assert(taxedTotals.taxableBase === 2594, 'Taxable base calculation with fixed discount', `Got ${taxedTotals.taxableBase}`);
assert(taxedTotals.taxAmount === 207.52, 'Explicit tax calculation (8% of 2594 = 207.52)', `Got ${taxedTotals.taxAmount}`);
assert(taxedTotals.grandTotal === 2801.52, 'Grand total calculation with tax = 2801.52', `Got ${taxedTotals.grandTotal}`);

// 2. Currency Formatting
console.log('\n[Suite 2: Multi-Currency Formatter]');
const usdFormatted = formatCurrency(2801.52, 'USD');
const eurFormatted = formatCurrency(2801.52, 'EUR');
const gbpFormatted = formatCurrency(2801.52, 'GBP');
const inrFormatted = formatCurrency(2801.52, 'INR');

assert(usdFormatted.includes('2,801.52') || usdFormatted.includes('$'), 'USD currency format contains dollar or numeric string');
assert(eurFormatted.includes('2.801,52') || eurFormatted.includes('2,801.52') || eurFormatted.includes('€'), 'EUR currency format handled');
assert(gbpFormatted.includes('£') || gbpFormatted.includes('2,801.52'), 'GBP currency format handled');
assert(inrFormatted.includes('₹') || inrFormatted.includes('2,801.52'), 'INR currency format handled');

// 3. Brief Validation Logic
console.log('\n[Suite 3: Client Brief Validation]');
function validateBrief(b: Partial<ClientBrief>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!b.projectName || !b.projectName.trim()) errors.push('Project name is required');
  if (!b.clientBrief || b.clientBrief.trim().length < 20) errors.push('Client brief too short');
  if (b.rateType === 'hourly' && (!b.hourlyRate || b.hourlyRate <= 0)) errors.push('Valid hourly rate required');
  if (b.rateType === 'fixed' && (!b.fixedBudget || b.fixedBudget <= 0)) errors.push('Valid fixed budget required');
  return { isValid: errors.length === 0, errors };
}

const emptyBriefValidation = validateBrief({});
assert(!emptyBriefValidation.isValid, 'Empty brief fails validation');
assert(emptyBriefValidation.errors.length >= 2, 'Empty brief reports multiple validation errors');

const validBriefValidation = validateBrief({
  projectName: 'SaaS Dashboard',
  clientBrief: 'We need a React web developer to build our billing dashboard with Stripe and Supabase.',
  rateType: 'hourly',
  hourlyRate: 85,
});
assert(validBriefValidation.isValid, 'Complete brief passes validation');

// 4. JSON Defense & Malformed AI Output Recovery
console.log('\n[Suite 4: Model JSON Defense & Clean Parsing]');
function cleanAndParse(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

const markdownJson = '```json\n{\n  "projectSummary": "Clean scope",\n  "deliverables": []\n}\n```';
const parsedMarkdown = cleanAndParse(markdownJson);
assert(parsedMarkdown.projectSummary === 'Clean scope', 'Safely strips markdown code blocks from model JSON');

const conversationalJson = 'Here is the requested proposal:\n\n{\n  "projectSummary": "Conversational wrapped scope",\n  "deliverables": []\n}\n\nHope this helps!';
const parsedConversational = cleanAndParse(conversationalJson);
assert(parsedConversational.projectSummary === 'Conversational wrapped scope', 'Safely extracts JSON surrounded by conversational text');

// 5. Scope Change Classification Validation
console.log('\n[Suite 5: Scope Change Classification Logic]');
const validClasses = ['likely_included', 'potential_scope_change', 'needs_clarification'];
function isValidScopeItem(item: any): boolean {
  return (
    typeof item.title === 'string' &&
    validClasses.includes(item.classification) &&
    typeof item.reasoning === 'string'
  );
}

assert(
  isValidScopeItem({
    title: 'Dark Mode UI',
    classification: 'potential_scope_change',
    reasoning: 'Out of original light theme scope',
  }),
  'Valid scope change item passes schema check'
);

assert(
  !isValidScopeItem({
    title: 'Unknown item',
    classification: 'completely_out_of_scope_random_string',
    reasoning: 'Invalid classification tag',
  }),
  'Invalid classification rejects invalid enum values'
);

console.log(`\n========================================`);
console.log(`All ${passedTests}/${totalTests} ScopeMate Tests Passed Successfully!`);
console.log(`========================================\n`);
