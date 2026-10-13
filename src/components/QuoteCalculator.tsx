import React from 'react';
import { QuoteConfig, QuoteLineItem, Currency, PaymentScheduleItem } from '../types/index.ts';
import {
  calculateLineItemTotal,
  calculateQuoteTotals,
  formatCurrency,
} from '../utils/calculator.ts';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Calculator,
  ShieldCheck,
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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F0FDFA] text-[#0F766E]">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1E293B]">Quote & Line Items Calculator</h3>
            <p className="text-[11px] text-[#64748B]">Deterministic calculations independent of AI arithmetic</p>
          </div>
        </div>

        {!readOnly && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-medium text-[#64748B]">Currency:</span>
              <select
                value={config.currency}
                onChange={(e) => onChangeConfig({ ...config, currency: e.target.value as Currency })}
                className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-medium text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 rounded-md border border-[#E2E8F0] bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, rateType: 'hourly' })}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  config.rateType === 'hourly'
                    ? 'bg-white text-[#0F766E] font-semibold shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Hourly Rates
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ ...config, rateType: 'fixed' })}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  config.rateType === 'fixed'
                    ? 'bg-white text-[#0F766E] font-semibold shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Fixed Item Fees
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-slate-50 text-[11px] font-semibold text-[#64748B]">
              <tr>
                <th className="px-3.5 py-2.5 w-10">#</th>
                <th className="px-3.5 py-2.5 min-w-[260px]">Deliverable & Task Description</th>
                <th className="px-3.5 py-2.5 text-right w-28">
                  {config.rateType === 'hourly' ? 'Hours' : 'Quantity'}
                </th>
                <th className="px-3.5 py-2.5 text-right w-32">
                  {config.rateType === 'hourly' ? `Rate (${config.currency}/hr)` : `Price (${config.currency})`}
                </th>
                <th className="px-3.5 py-2.5 text-right w-32">Total</th>
                {!readOnly && <th className="px-3.5 py-2.5 text-center w-20">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#64748B]">
                    No quote line items defined yet. Click "Add Line Item" below.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const lineTotal = calculateLineItemTotal(item);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/50 transition ${
                        item.isAdditional ? 'bg-[#F0FDFA]/40' : ''
                      }`}
                    >
                      <td className="px-3.5 py-2.5 font-mono text-[11px] text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="px-3.5 py-2.5">
                        {readOnly ? (
                          <div>
                            <div className="flex items-center space-x-1.5 font-semibold text-[#1E293B]">
                              <span>{item.title}</span>
                              {item.isAdditional && (
                                <span className="rounded bg-[#F0FDFA] px-1.5 py-0.2 text-[9px] font-medium text-[#0F766E] border border-teal-200">
                                  Scope Change Addon
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[#64748B] text-[11px]">{item.description}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                                className="w-full rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
                                placeholder="Deliverable name"
                              />
                              {item.isAdditional && (
                                <span className="shrink-0 rounded bg-[#F0FDFA] px-1.5 py-0.5 text-[9px] font-medium text-[#0F766E] border border-teal-200">
                                  Scope Addon
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                              className="w-full rounded border border-transparent bg-transparent px-2 py-0.5 text-[11px] text-[#64748B] hover:border-[#E2E8F0] focus:border-[#0F766E] focus:bg-white focus:outline-none"
                              placeholder="Functional scope or description"
                            />
                          </div>
                        )}
                      </td>

                      <td className="px-3.5 py-2.5 text-right">
                        {readOnly ? (
                          <span className="font-mono text-xs">{item.quantity}</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { quantity: Number(e.target.value) || 0 })
                            }
                            className="w-20 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-right font-mono text-xs focus:border-[#0F766E] focus:outline-none"
                          />
                        )}
                      </td>

                      <td className="px-3.5 py-2.5 text-right">
                        {readOnly ? (
                          <span className="font-mono text-xs">{item.unitRate}</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.unitRate}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { unitRate: Number(e.target.value) || 0 })
                            }
                            className="w-24 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-right font-mono text-xs focus:border-[#0F766E] focus:outline-none"
                          />
                        )}
                      </td>

                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#1E293B]">
                        {formatCurrency(lineTotal, config.currency)}
                      </td>

                      {!readOnly && (
                        <td className="px-3.5 py-2.5 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleMoveItem(idx, 'up')}
                              disabled={idx === 0}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-20"
                              title="Move up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveItem(idx, 'down')}
                              disabled={idx === items.length - 1}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-20"
                              title="Move down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-red-50"
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
          <div className="border-t border-[#E2E8F0] bg-slate-50/50 p-3">
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center space-x-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5 text-[#0F766E]" />
              <span>Add Line Item</span>
            </button>
          </div>
        )}
      </div>

      {/* Adjustments & Totals Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Adjustments Column */}
        <div className="space-y-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs lg:col-span-7">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
            Estimate Terms & Buffers
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">
                Contingency Buffer (%)
              </label>
              <p className="text-[10px] text-[#64748B]">Protects against unexpected revisions</p>
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
                    className="w-16 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-mono focus:border-[#0F766E] focus:outline-none"
                  />
                  <div className="flex space-x-1">
                    {[0, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, contingencyPercent: pct })}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          config.contingencyPercent === pct
                            ? 'bg-[#0F766E] text-white'
                            : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
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
              <label className="block text-xs font-semibold text-[#1E293B]">Commercial Discount</label>
              <p className="text-[10px] text-[#64748B]">Negotiated discount</p>
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
                    className="w-20 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-mono focus:border-[#0F766E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChangeConfig({
                        ...config,
                        discountType: config.discountType === 'percentage' ? 'fixed' : 'percentage',
                      })
                    }
                    className="rounded border border-[#E2E8F0] bg-white px-2 py-1 text-[10px] font-semibold text-[#1E293B]"
                  >
                    {config.discountType === 'percentage' ? '%' : config.currency}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">Applicable Tax / VAT (%)</label>
              <p className="text-[10px] text-[#64748B]">Explicit opt-in (0% by default)</p>
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
                    className="w-16 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-mono focus:border-[#0F766E] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#64748B]">
                    {config.taxPercent === 0 ? 'Excluding taxes' : `+${config.taxPercent}% Tax`}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">Validity Window (Days)</label>
              <p className="text-[10px] text-[#64748B]">Days before quote expires</p>
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
                    className="w-16 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-mono focus:border-[#0F766E] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#64748B]">Days</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B]">Client Pricing Notes</label>
            {readOnly ? (
              <p className="mt-1 text-xs text-[#64748B]">{config.notes || 'None'}</p>
            ) : (
              <input
                type="text"
                value={config.notes || ''}
                onChange={(e) => onChangeConfig({ ...config, notes: e.target.value })}
                placeholder="e.g. Estimate valid for 14 days. Excludes third-party API or hosting costs."
                className="mt-1 w-full rounded border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Clean Financial Totals Column */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Financial Summary
            </h4>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Line Items Subtotal:</span>
                <span className="font-mono font-semibold text-[#1E293B]">
                  {formatCurrency(totals.subtotal, config.currency)}
                </span>
              </div>

              {totals.contingencyAmount > 0 && (
                <div className="flex items-center justify-between text-[#0F766E]">
                  <span>Contingency Buffer ({config.contingencyPercent}%):</span>
                  <span className="font-mono font-semibold">
                    +{formatCurrency(totals.contingencyAmount, config.currency)}
                  </span>
                </div>
              )}

              {totals.discountAmount > 0 && (
                <div className="flex items-center justify-between text-red-600">
                  <span>
                    Discount ({config.discountType === 'percentage' ? `${config.discountValue}%` : 'Fixed'}):
                  </span>
                  <span className="font-mono font-semibold">
                    -{formatCurrency(totals.discountAmount, config.currency)}
                  </span>
                </div>
              )}

              {totals.taxAmount > 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Tax / VAT ({config.taxPercent}%):</span>
                  <span className="font-mono font-semibold text-[#1E293B]">
                    +{formatCurrency(totals.taxAmount, config.currency)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Taxes:</span>
                  <span>Excluding taxes</span>
                </div>
              )}

              <div className="border-t border-[#E2E8F0] pt-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                      Grand Total Estimate
                    </span>
                    <p className="text-[10px] text-[#64748B]">Valid for {config.validityDays} days</p>
                  </div>
                  <span className="font-mono text-xl font-bold text-[#0F766E]">
                    {formatCurrency(totals.grandTotal, config.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-[#E2E8F0] bg-slate-50 p-3 text-[11px] text-[#64748B]">
            <div className="flex items-center space-x-1.5 font-semibold text-[#1E293B]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0F766E]" />
              <span>Commercial Estimate</span>
            </div>
            <p className="mt-0.5">
              This document is a commercial scope estimate and quote proposal, not a legally binding tax invoice.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Payment Milestone Schedule */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Payment Milestone Schedule
            </h4>
            <p className="text-xs text-[#64748B]">
              Tying payments to verified milestone delivery
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-mono font-medium ${
                milestonePercentageSum === 100
                  ? 'bg-[#F0FDFA] text-[#0F766E]'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              Sum: {milestonePercentageSum}%
            </span>
            {!readOnly && (
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center space-x-1 rounded border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E293B] hover:bg-slate-50"
              >
                <Plus className="h-3 w-3 text-[#0F766E]" />
                <span>Add Milestone</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 divide-y divide-[#E2E8F0]">
          {config.paymentSchedule.map((milestone) => {
            const milestoneValue = totals.grandTotal * (milestone.percentage / 100);
            return (
              <div
                key={milestone.id}
                className="flex flex-col items-start justify-between gap-2 py-2.5 sm:flex-row sm:items-center"
              >
                <div className="flex-1 space-y-1">
                  {readOnly ? (
                    <div className="font-semibold text-xs text-[#1E293B]">{milestone.phase}</div>
                  ) : (
                    <input
                      type="text"
                      value={milestone.phase}
                      onChange={(e) => handleUpdateMilestone(milestone.id, { phase: e.target.value })}
                      className="w-full rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
                    />
                  )}
                  {readOnly ? (
                    <p className="text-[11px] text-[#64748B]">{milestone.trigger}</p>
                  ) : (
                    <input
                      type="text"
                      value={milestone.trigger}
                      onChange={(e) => handleUpdateMilestone(milestone.id, { trigger: e.target.value })}
                      placeholder="Verification trigger condition..."
                      className="w-full rounded border border-transparent bg-transparent px-2 py-0.5 text-[11px] text-[#64748B] hover:border-[#E2E8F0] focus:border-[#0F766E] focus:bg-white focus:outline-none"
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
                          className="w-14 rounded border border-[#E2E8F0] bg-white px-1.5 py-0.5 text-right font-mono text-xs focus:border-[#0F766E] focus:outline-none"
                        />
                      )}
                      <span className="text-xs text-[#64748B]">%</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#1E293B]">
                      {formatCurrency(milestoneValue, config.currency)}
                    </span>
                  </div>

                  {!readOnly && config.paymentSchedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-red-50"
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
