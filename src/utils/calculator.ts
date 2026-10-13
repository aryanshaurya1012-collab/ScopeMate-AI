import { Currency, QuoteConfig, QuoteLineItem, QuoteTotals } from '../types/index.ts';

/**
 * Rounds a number to exactly two decimal places safely avoiding floating point artifacts.
 */
export function roundCurrency(value: number): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates a single line item's total.
 */
export function calculateLineItemTotal(item: QuoteLineItem): number {
  const qty = Number(item.quantity) || 0;
  const rate = Number(item.unitRate) || 0;
  return roundCurrency(qty * rate);
}

/**
 * Deterministically calculates all totals for a given list of line items and config.
 */
export function calculateQuoteTotals(
  items: QuoteLineItem[],
  config: QuoteConfig
): QuoteTotals {
  // 1. Subtotal is sum of all individual line item totals
  const subtotal = items.reduce((acc, item) => {
    return roundCurrency(acc + calculateLineItemTotal(item));
  }, 0);

  // 2. Contingency calculation (percentage of subtotal)
  const contingencyPercent = Math.max(0, Number(config.contingencyPercent) || 0);
  const contingencyAmount = roundCurrency(subtotal * (contingencyPercent / 100));

  // 3. Discount calculation
  let discountAmount = 0;
  const discountVal = Math.max(0, Number(config.discountValue) || 0);
  if (config.discountType === 'percentage') {
    discountAmount = roundCurrency(subtotal * (Math.min(100, discountVal) / 100));
  } else {
    discountAmount = roundCurrency(Math.min(subtotal + contingencyAmount, discountVal));
  }

  // 4. Taxable base = subtotal + contingency - discount
  const taxableBase = Math.max(0, roundCurrency(subtotal + contingencyAmount - discountAmount));

  // 5. Tax amount (if explicitly configured > 0)
  const taxPercent = Math.max(0, Number(config.taxPercent) || 0);
  const taxAmount = taxPercent > 0 ? roundCurrency(taxableBase * (taxPercent / 100)) : 0;

  // 6. Grand total
  const grandTotal = roundCurrency(taxableBase + taxAmount);

  return {
    subtotal,
    contingencyAmount,
    discountAmount,
    taxableBase,
    taxAmount,
    grandTotal,
  };
}

/**
 * Currency symbol and display map.
 */
export const CURRENCY_MAP: Record<Currency, { symbol: string; label: string; locale: string }> = {
  USD: { symbol: '$', label: 'USD ($)', locale: 'en-US' },
  EUR: { symbol: '€', label: 'EUR (€)', locale: 'de-DE' },
  GBP: { symbol: '£', label: 'GBP (£)', locale: 'en-GB' },
  INR: { symbol: '₹', label: 'INR (₹)', locale: 'en-IN' },
};

/**
 * Formats a numeric monetary value cleanly with proper currency symbols and 2 decimal points.
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const safeAmount = roundCurrency(amount);
  const config = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${config.symbol}${safeAmount.toFixed(2)}`;
  }
}
