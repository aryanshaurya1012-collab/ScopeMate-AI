import React from 'react';
import { SavedProject } from '../types/index.ts';
import { calculateQuoteTotals, formatCurrency } from '../utils/calculator.ts';

interface PrintDocumentProps {
  project: SavedProject;
}

export const PrintDocument: React.FC<PrintDocumentProps> = ({ project }) => {
  const totals = calculateQuoteTotals(project.quoteItems || [], project.quoteConfig);

  return (
    <div
      id="printable-document"
      className="mx-auto max-w-[210mm] bg-white p-8 text-[#1E293B] sm:p-12 print:p-0 print:text-black font-sans"
    >
      {/* Header & Meta */}
      <div className="border-b-2 border-[#0F766E] pb-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-[#0F766E]">
                ScopeMate
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#64748B]">
                • Scope of Work & Proposal
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-[#1E293B] sm:text-3xl print:text-xl">
              {project.brief.projectName}
            </h1>
            {project.brief.clientName && (
              <p className="mt-1 text-xs font-semibold text-[#64748B]">
                Prepared for: {project.brief.clientName}
              </p>
            )}
          </div>

          <div className="text-right text-xs">
            <p className="font-semibold text-[#0F766E]">Proposal Ref</p>
            <p className="font-mono text-[#64748B]">{project.id.slice(0, 10)}</p>
            <p className="mt-1 font-semibold text-[#0F766E]">Date</p>
            <p className="text-[#64748B]">{new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</p>
            <p className="mt-1 font-semibold text-[#0F766E]">Validity</p>
            <p className="text-[#64748B]">{project.quoteConfig.validityDays} Days</p>
          </div>
        </div>
      </div>

      {/* Proposal Intro & Summary */}
      <div className="mt-5 space-y-3">
        {project.proposal.proposalIntro && (
          <div className="text-xs leading-relaxed text-[#1E293B] italic">
            "{project.proposal.proposalIntro}"
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 rounded-lg border border-[#E2E8F0] bg-slate-50/50 p-4 sm:grid-cols-2 print:border-gray-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              Project Summary
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#1E293B]">
              {project.proposal.projectSummary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              Target Objective & Outcome
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#1E293B]">
              {project.proposal.businessObjective}
            </p>
          </div>
        </div>
      </div>

      {/* Agreed Deliverables & Acceptance Criteria */}
      <div className="mt-6 break-inside-avoid">
        <h2 className="text-base font-bold text-[#1E293B] border-b border-[#E2E8F0] pb-2">
          1. Agreed Deliverables & Acceptance Criteria
        </h2>
        <div className="mt-3 space-y-3">
          {project.proposal.deliverables.map((del, idx) => (
            <div
              key={del.id || idx}
              className="rounded-lg border border-[#E2E8F0] p-3 break-inside-avoid print:border-gray-200"
            >
              <div className="flex items-baseline justify-between">
                <h4 className="font-semibold text-xs text-[#0F766E]">
                  1.{idx + 1} {del.title}
                </h4>
                {del.estimatedHours ? (
                  <span className="font-mono text-[11px] text-[#64748B]">
                    Est. {del.estimatedHours} hrs
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[#1E293B] leading-relaxed">{del.description}</p>

              {del.acceptanceCriteria && del.acceptanceCriteria.length > 0 && (
                <div className="mt-2 bg-slate-50 p-2 rounded text-[11px] print:bg-gray-50">
                  <span className="font-semibold text-[#1E293B] block mb-1">
                    Acceptance Criteria:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[#64748B]">
                    {del.acceptanceCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explicit Exclusions */}
      <div className="mt-6 break-inside-avoid">
        <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2">
          <h2 className="text-base font-bold text-[#1E293B]">
            2. Explicit Exclusions (Out of Scope)
          </h2>
          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            Airtight Scope Boundary
          </span>
        </div>
        <p className="mt-1.5 text-xs text-[#64748B]">
          The following tasks are expressly excluded. Any work related to these areas constitutes a scope change and requires separate agreement:
        </p>
        <ul className="mt-2.5 grid grid-cols-1 gap-1.5 text-xs text-[#1E293B] sm:grid-cols-2">
          {project.proposal.explicitExclusions.map((ex, i) => (
            <li key={i} className="flex items-start space-x-2 rounded border border-[#E2E8F0] p-2 bg-white print:border-gray-200">
              <span className="text-red-500 font-bold">✕</span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Assumptions & Revision Policy */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 break-inside-avoid">
        <div className="rounded-lg border border-[#E2E8F0] p-3 print:border-gray-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
            3. Project Assumptions
          </h3>
          <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs text-[#64748B]">
            {project.proposal.assumptions.map((as, i) => (
              <li key={i}>{as}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] p-3 print:border-gray-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
            4. Revision Terms & Policy
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">
            {project.proposal.revisionTerms}
          </p>
        </div>
      </div>

      {/* Financial Quote & Line Items Table */}
      <div className="mt-6 break-inside-avoid">
        <h2 className="text-base font-bold text-[#1E293B] border-b border-[#E2E8F0] pb-2">
          5. Project Investment & Quote
        </h2>

        <div className="mt-3 overflow-hidden rounded-lg border border-[#E2E8F0] print:border-gray-300">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-[#1E293B] print:bg-gray-100">
              <tr>
                <th className="p-2.5">Scope Item</th>
                <th className="p-2.5 text-right">
                  {project.quoteConfig.rateType === 'hourly' ? 'Hours' : 'Qty'}
                </th>
                <th className="p-2.5 text-right">Rate</th>
                <th className="p-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] print:divide-gray-200">
              {project.quoteItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-2.5">
                    <span className="font-semibold">{item.title}</span>
                    <p className="text-[11px] text-[#64748B]">{item.description}</p>
                  </td>
                  <td className="p-2.5 text-right font-mono">{item.quantity}</td>
                  <td className="p-2.5 text-right font-mono">
                    {formatCurrency(item.unitRate, project.quoteConfig.currency)}
                  </td>
                  <td className="p-2.5 text-right font-mono font-semibold">
                    {formatCurrency(item.quantity * item.unitRate, project.quoteConfig.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="border-t-2 border-[#0F766E] bg-slate-50/70 p-4 text-xs print:bg-gray-50">
            <div className="ml-auto max-w-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Subtotal:</span>
                <span className="font-mono font-semibold">
                  {formatCurrency(totals.subtotal, project.quoteConfig.currency)}
                </span>
              </div>
              {totals.contingencyAmount > 0 && (
                <div className="flex justify-between text-[#0F766E]">
                  <span>Contingency ({project.quoteConfig.contingencyPercent}%):</span>
                  <span className="font-mono font-semibold">
                    +{formatCurrency(totals.contingencyAmount, project.quoteConfig.currency)}
                  </span>
                </div>
              )}
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span className="font-mono font-semibold">
                    -{formatCurrency(totals.discountAmount, project.quoteConfig.currency)}
                  </span>
                </div>
              )}
              {totals.taxAmount > 0 ? (
                <div className="flex justify-between">
                  <span>Tax ({project.quoteConfig.taxPercent}%):</span>
                  <span className="font-mono font-semibold">
                    +{formatCurrency(totals.taxAmount, project.quoteConfig.currency)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Taxes:</span>
                  <span>Excluding taxes</span>
                </div>
              )}
              <div className="border-t border-[#0F766E]/30 pt-1.5 flex justify-between font-bold text-sm text-[#0F766E]">
                <span>Total Investment:</span>
                <span className="font-mono">
                  {formatCurrency(totals.grandTotal, project.quoteConfig.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Milestones */}
      <div className="mt-6 break-inside-avoid">
        <h2 className="text-base font-bold text-[#1E293B] border-b border-[#E2E8F0] pb-2">
          6. Payment Milestone Schedule
        </h2>
        <div className="mt-2.5 divide-y divide-[#E2E8F0] text-xs">
          {project.quoteConfig.paymentSchedule.map((m) => {
            const val = totals.grandTotal * (m.percentage / 100);
            return (
              <div key={m.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1E293B]">{m.phase}</span>
                  <p className="text-[11px] text-[#64748B]">{m.trigger}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="font-semibold">
                    {formatCurrency(val, project.quoteConfig.currency)}
                  </span>
                  <span className="text-[11px] text-[#64748B] block">({m.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sign-off */}
      <div className="mt-8 border-t-2 border-[#0F766E] pt-4 break-inside-avoid text-xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#1E293B]">
          Approval & Sign-off
        </h3>
        <p className="mt-1 text-[#64748B]">
          To confirm and proceed with the scope of work outlined above, please sign and return this document.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-8 pt-4">
          <div className="border-t border-slate-300 pt-2">
            <p className="font-semibold text-xs text-[#1E293B]">Specialist (Freelancer):</p>
            <p className="text-[11px] text-[#64748B]">Independent Consultant</p>
          </div>
          <div className="border-t border-slate-300 pt-2">
            <p className="font-semibold text-xs text-[#1E293B]">Client Representative:</p>
            <p className="text-[11px] text-[#64748B]">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};
