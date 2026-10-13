import React, { useState } from 'react';
import { QuoteConfig, QuoteLineItem, Currency, RateType, PaymentScheduleItem } from '../types/index.ts';
import {
  calculateLineItemTotal,
  calculateQuoteTotals,
  formatCurrency,
  CURRENCY_MAP,
} from '../utils/calculator.ts';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Calculator,
  ShieldCheck,
  AlertCircle,
  Percent,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

interface QuoteCalculatorProps {
  items: QuoteLineItem[];
  config: QuoteConfig;
  onChangeItems: (items: QuoteLineItem[]) => void;
  onChangeConfig: (config: QuoteConfig) => void;
  readOnly?: boolean;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  items,
  config,
  onChangeItems,
  onChangeConfig,
  readOnly = false,
}) => {
  const totals = calculateQuoteTotals(items, config);

  const handleUpdateItem = (id: string, updates: Partial<QuoteLineItem>) => {
    const updated = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
    onChangeItems(updated);
  };

  const handleAddItem = () => {
    const newItem: QuoteLineItem = {
      id: `item-${Date.now()}`,
      title: 'New Scoped Deliverable',
      description: 'Define specific functional deliverable or task',
      quantity: config.rateType === 'hourly' ? 8 : 1,
      unitRate: config.rateType === 'hourly' ? 75 : 500,
    };
    onChangeItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChangeItems(items.filter((item) => item.id !== id));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChangeItems(newItems);
  };

  const handleAddMilestone = () => {
    const nextMilestones = [
      ...config.paymentSchedule,
      {
        id: `pay-${Date.now()}`,
        phase: `Milestone ${config.paymentSchedule.length + 1}`,
        percentage: 20,
        trigger: 'Due upon agreed milestone completion',
      },
    ];
    onChangeConfig({ ...config, paymentSchedule: nextMilestones });
  };

  const handleUpdateMilestone = (id: string, updates: Partial<PaymentScheduleItem>) => {
    const nextMilestones = config.paymentSchedule.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    onChangeConfig({ ...config, paymentSchedule: nextMilestones });
  };

  const handleDeleteMilestone = (id: string) => {
    onChangeConfig({
      ...config,
      paymentSchedule: config.paymentSchedule.filter((m) => m.id !== id),
    });
  };

  const milestonePercentageSum = config.paymentSchedule.reduce(
    (acc, m) => acc + (Number(m.percentage) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E5E0D5] bg-white p-4 shadow-2xs">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#21473A]/10 text-[#21473A]">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#21473A]">Deterministic Quote Calculator</h3>
            <p className="text-[11px] text-[#1F2923]/60">Pure mathematical calculation • Independent of AI arithmetic</p>
          </div>
        </div>

        {!readOnly && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#1F2923]">Currency:</span>
              <select
                value={config.currency}
                onChange={(e) => onChangeConfig({ ...config, currency: e.target.value as Currency })}
                className="rounded-md border border-[#E5E0D5] bg-[#F7F5EF] px-2.5 py-1 text-xs font-medium text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 rounded-md border border-[#E5E0D5] bg-[#F7F5EF] p-0.5">
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, rateType: 'hourly' })}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  config.rateType === 'hourly'
                    ? 'bg-[#21473A] text-white'
                    : 'text-[#1F2923]/70 hover:text-[#1F2923]'
                }`}
              >
                Hourly Rates
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, rateType: 'fixed' })}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  config.rateType === 'fixed'
                    ? 'bg-[#21473A] text-white'
                    : 'text-[#1F2923]/70 hover:text-[#1F2923]'
                }`}
              >
                Fixed Item Fees
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E0D5] bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E0D5] bg-[#F7F5EF] text-[11px] font-semibold tracking-wider text-[#1F2923]/70 uppercase">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3 min-w-[240px]">Deliverable & Scope Description</th>
                <th className="px-4 py-3 text-right">
                  {config.rateType === 'hourly' ? 'Estimated Hours' : 'Quantity'}
                </th>
                <th className="px-4 py-3 text-right">
                  {config.rateType === 'hourly' ? `Rate (${config.currency}/hr)` : `Unit Price (${config.currency})`}
                </th>
                <th className="px-4 py-3 text-right">Line Total</th>
                {!readOnly && <th className="px-4 py-3 text-center w-24">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D5]/70">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#1F2923]/60">
                    No quote line items defined yet. Click "Add Deliverable Item" below.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const lineTotal = calculateLineItemTotal(item);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#F7F5EF]/40 transition ${
                        item.isAdditional ? 'bg-[#E9795C]/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-[11px] text-[#1F2923]/50">
                        {idx + 1}
                      </td>

                      <td className="px-4 py-3">
                        {readOnly ? (
                          <div>
                            <div className="flex items-center space-x-1.5 font-semibold text-[#21473A]">
                              <span>{item.title}</span>
                              {item.isAdditional && (
                                <span className="rounded bg-[#E9795C]/20 px-1.5 py-0.2 text-[9px] font-bold text-[#E9795C]">
                                  Scope Change Addon
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[#1F2923]/70 text-[11px]">{item.description}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                                className="w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-2 py-1 font-semibold text-[#21473A] focus:border-[#21473A] focus:outline-none"
                                placeholder="Item title"
                              />
                              {item.isAdditional && (
                                <span className="shrink-0 rounded bg-[#E9795C]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#E9795C]">
                                  Scope Addon
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                              className="w-full rounded border border-transparent bg-transparent px-2 py-0.5 text-[11px] text-[#1F2923]/70 hover:border-[#E5E0D5] focus:border-[#21473A] focus:outline-none"
                              placeholder="Functional scope or description"
                            />
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {readOnly ? (
                          <span className="font-mono">{item.quantity}</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { quantity: Number(e.target.value) || 0 })
                            }
                            className="w-20 rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-2 py-1 text-right font-mono focus:border-[#21473A] focus:outline-none"
                          />
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {readOnly ? (
                          <span className="font-mono">{item.unitRate}</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.unitRate}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { unitRate: Number(e.target.value) || 0 })
                            }
                            className="w-24 rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-2 py-1 text-right font-mono focus:border-[#21473A] focus:outline-none"
                          />
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-[#21473A]">
                        {formatCurrency(lineTotal, config.currency)}
                      </td>

                      {!readOnly && (
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleMoveItem(idx, 'up')}
                              disabled={idx === 0}
                              className="rounded p-1 text-[#1F2923]/50 hover:bg-[#E5E0D5]/50 disabled:opacity-20"
                              title="Move up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveItem(idx, 'down')}
                              disabled={idx === items.length - 1}
                              className="rounded p-1 text-[#1F2923]/50 hover:bg-[#E5E0D5]/50 disabled:opacity-20"
                              title="Move down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="rounded p-1 text-[#E9795C] hover:bg-red-50"
                              title="Delete line item"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!readOnly && (
          <div className="border-t border-[#E5E0D5] bg-[#F7F5EF]/50 p-3">
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center space-x-1.5 rounded-md border border-[#21473A]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#21473A] hover:bg-[#DCE7DC]/40"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Deliverable Line Item</span>
            </button>
          </div>
        )}
      </div>

      {/* Adjustments & Totals Summary Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Adjustments: Contingency, Discount, Tax, Validity */}
        <div className="space-y-4 rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs lg:col-span-7">
          <h4 className="font-editorial text-base font-bold text-[#21473A]">
            Estimate Terms & Buffers
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">
                Contingency Buffer (%)
              </label>
              <p className="text-[10px] text-[#1F2923]/60">Protects against unforeseen edge-cases</p>
              {readOnly ? (
                <p className="mt-1 font-mono text-xs">{config.contingencyPercent}%</p>
              ) : (
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={config.contingencyPercent}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        contingencyPercent: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-20 rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-2 py-1 text-xs font-mono focus:border-[#21473A] focus:outline-none"
                  />
                  <div className="flex space-x-1">
                    {[0, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, contingencyPercent: pct })}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          config.contingencyPercent === pct
                            ? 'bg-[#21473A] text-white'
                            : 'bg-[#F7F5EF] text-[#1F2923]/70 hover:bg-[#E5E0D5]'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Commercial Discount</label>
              <p className="text-[10px] text-[#1F2923]/60">Optional negotiated discount</p>
              {readOnly ? (
                <p className="mt-1 font-mono text-xs">
                  {config.discountValue > 0
                    ? config.discountType === 'percentage'
                      ? `${config.discountValue}%`
                      : formatCurrency(config.discountValue, config.currency)
                    : 'None'}
                </p>
              ) : (
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={config.discountValue}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        discountValue: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-24 rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-2 py-1 text-xs font-mono focus:border-[#21473A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChangeConfig({
                        ...config,
                        discountType: config.discountType === 'percentage' ? 'fixed' : 'percentage',
                      })
                    }
                    className="rounded border border-[#E5E0D5] bg-[#F7F5EF] px-2 py-1 text-[10px] font-semibold text-[#1F2923]"
                  >
                    {config.discountType === 'percentage' ? '%' : config.currency}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Applicable Tax / VAT (%)</label>
              <p className="text-[10px] text-[#1F2923]/60">Explicit opt-in only. 0% by default</p>
              {readOnly ? (
                <p className="mt-1 font-mono text-xs">
                  {config.taxPercent > 0 ? `${config.taxPercent}%` : 'Excluding taxes'}
                </p>
              ) : (
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={config.taxPercent}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        taxPercent: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-20 rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-2 py-1 text-xs font-mono focus:border-[#21473A] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#1F2923]/60">
                    {config.taxPercent === 0 ? 'Excluding taxes' : `+${config.taxPercent}% Tax`}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Estimate Validity Window</label>
              <p className="text-[10px] text-[#1F2923]/60">Days before quote expires</p>
              {readOnly ? (
                <p className="mt-1 font-mono text-xs">{config.validityDays} Days</p>
              ) : (
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={config.validityDays}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        validityDays: Math.max(1, Number(e.target.value) || 14),
                      })
                    }
                    className="w-20 rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-2 py-1 text-xs font-mono focus:border-[#21473A] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#1F2923]/60">Days from issuance</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2923]">Client Pricing Notes</label>
            {readOnly ? (
              <p className="mt-1 text-xs text-[#1F2923]/70">{config.notes || 'None'}</p>
            ) : (
              <input
                type="text"
                value={config.notes || ''}
                onChange={(e) => onChangeConfig({ ...config, notes: e.target.value })}
                placeholder="e.g. Estimate valid for 14 days. Excludes third-party API or cloud hosting fees."
                className="mt-1 w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-1.5 text-xs text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Deterministic Financial Breakdown */}
        <div className="rounded-xl border border-[#21473A]/20 bg-[#F7F5EF] p-5 shadow-2xs lg:col-span-5">
          <h4 className="font-editorial text-base font-bold text-[#21473A]">
            Financial Breakdown
          </h4>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#1F2923]/70">Line Items Subtotal:</span>
              <span className="font-mono font-semibold text-[#1F2923]">
                {formatCurrency(totals.subtotal, config.currency)}
              </span>
            </div>

            {totals.contingencyAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[#1F2923]/70">
                  Contingency Buffer ({config.contingencyPercent}%):
                </span>
                <span className="font-mono font-semibold text-[#21473A]">
                  +{formatCurrency(totals.contingencyAmount, config.currency)}
                </span>
              </div>
            )}

            {totals.discountAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[#1F2923]/70">
                  Applied Discount (
                  {config.discountType === 'percentage'
                    ? `${config.discountValue}%`
                    : 'Fixed'}
                  ):
                </span>
                <span className="font-mono font-semibold text-[#E9795C]">
                  -{formatCurrency(totals.discountAmount, config.currency)}
                </span>
              </div>
            )}

            {totals.taxAmount > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-[#1F2923]/70">Tax / VAT ({config.taxPercent}%):</span>
                <span className="font-mono font-semibold text-[#1F2923]">
                  +{formatCurrency(totals.taxAmount, config.currency)}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-[#1F2923]/50">
                <span>Taxes:</span>
                <span>Excluding taxes</span>
              </div>
            )}

            <div className="border-t border-[#21473A]/20 pt-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#21473A]">
                    Estimated Grand Total
                  </span>
                  <p className="text-[10px] text-[#1F2923]/60">Valid for {config.validityDays} days</p>
                </div>
                <span className="font-mono text-2xl font-bold text-[#21473A]">
                  {formatCurrency(totals.grandTotal, config.currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-[#21473A]/15 bg-white p-3 text-[11px] text-[#1F2923]/70">
            <div className="flex items-center space-x-1.5 font-semibold text-[#21473A]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#21473A]" />
              <span>Professional Estimate Notice</span>
            </div>
            <p className="mt-1">
              This document constitutes a project scope estimate and quote proposal. It is not an
              executed legal contract or an issued tax invoice.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Payment Milestone Schedule */}
      <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-editorial text-base font-bold text-[#21473A]">
              Payment Milestone Schedule
            </h4>
            <p className="text-xs text-[#1F2923]/60">
              Clear milestone checkpoints protect cash flow and tie payments to verified delivery.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                milestonePercentageSum === 100
                  ? 'bg-[#DCE7DC] text-[#21473A]'
                  : 'bg-[#E9795C]/20 text-[#E9795C]'
              }`}
            >
              Sum: {milestonePercentageSum}%
            </span>
            {!readOnly && (
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center space-x-1 rounded border border-[#21473A]/20 bg-white px-2.5 py-1 text-xs font-medium text-[#21473A] hover:bg-[#DCE7DC]/40"
              >
                <Plus className="h-3 w-3" />
                <span>Add Milestone</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 divide-y divide-[#E5E0D5]">
          {config.paymentSchedule.map((milestone) => {
            const milestoneValue = totals.grandTotal * (milestone.percentage / 100);
            return (
              <div
                key={milestone.id}
                className="flex flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center"
              >
                <div className="flex-1 space-y-1">
                  {readOnly ? (
                    <div className="font-semibold text-xs text-[#21473A]">{milestone.phase}</div>
                  ) : (
                    <input
                      type="text"
                      value={milestone.phase}
                      onChange={(e) => handleUpdateMilestone(milestone.id, { phase: e.target.value })}
                      className="w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/30 px-2 py-1 text-xs font-semibold text-[#21473A] focus:border-[#21473A] focus:outline-none"
                    />
                  )}
                  {readOnly ? (
                    <p className="text-[11px] text-[#1F2923]/60">{milestone.trigger}</p>
                  ) : (
                    <input
                      type="text"
                      value={milestone.trigger}
                      onChange={(e) => handleUpdateMilestone(milestone.id, { trigger: e.target.value })}
                      placeholder="Verification trigger condition..."
                      className="w-full rounded border border-transparent bg-transparent px-2 py-0.5 text-[11px] text-[#1F2923]/60 hover:border-[#E5E0D5] focus:border-[#21473A] focus:outline-none"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      {readOnly ? (
                        <span className="font-mono text-xs">{milestone.percentage}%</span>
                      ) : (
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={milestone.percentage}
                          onChange={(e) =>
                            handleUpdateMilestone(milestone.id, {
                              percentage: Number(e.target.value) || 0,
                            })
                          }
                          className="w-14 rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 px-1.5 py-0.5 text-right font-mono text-xs focus:border-[#21473A] focus:outline-none"
                        />
                      )}
                      <span className="text-xs text-[#1F2923]/60">%</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#21473A]">
                      {formatCurrency(milestoneValue, config.currency)}
                    </span>
                  </div>

                  {!readOnly && config.paymentSchedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="rounded p-1 text-[#E9795C] hover:bg-red-50"
                      title="Remove milestone"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
