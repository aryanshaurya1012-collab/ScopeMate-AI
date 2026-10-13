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
      className="mx-auto max-w-[210mm] bg-white p-8 text-[#1F2923] sm:p-12 print:p-0 print:text-black"
    >
      {/* Header & Meta */}
      <div className="border-b-2 border-[#21473A] pb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#21473A]">
                ScopeMate
              </span>
              <span className="text-xs uppercase tracking-widest text-[#1F2923]/60 print:text-gray-600">
                • Scope of Work & Proposal
              </span>
            </div>
            <h1 className="mt-2 font-editorial text-3xl font-bold text-[#21473A] sm:text-4xl print:text-2xl">
              {project.brief.projectName}
            </h1>
            {project.brief.clientName && (
              <p className="mt-1 text-sm font-semibold text-[#1F2923]/80">
                Prepared for: {project.brief.clientName}
              </p>
            )}
          </div>

          <div className="text-right text-xs">
            <p className="font-semibold text-[#21473A]">Proposal ID</p>
            <p className="font-mono text-[#1F2923]/70">{project.id.slice(0, 12)}</p>
            <p className="mt-1 font-semibold text-[#21473A]">Date Issued</p>
            <p className="text-[#1F2923]/70">{new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</p>
            <p className="mt-1 font-semibold text-[#21473A]">Validity</p>
            <p className="text-[#1F2923]/70">{project.quoteConfig.validityDays} Days</p>
          </div>
        </div>
      </div>

      {/* Proposal Intro & Summary */}
      <div className="mt-6 space-y-4">
        {project.proposal.proposalIntro && (
          <div className="text-xs leading-relaxed text-[#1F2923]/85 italic print:text-black">
            "{project.proposal.proposalIntro}"
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 rounded-lg border border-[#E5E0D5] bg-[#F7F5EF]/30 p-4 sm:grid-cols-2 print:border-gray-300 print:bg-gray-50">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#21473A]">
              Project Summary
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#1F2923]/80">
              {project.proposal.projectSummary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#21473A]">
              Target Objective & Outcome
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#1F2923]/80">
              {project.proposal.businessObjective}
            </p>
          </div>
        </div>
      </div>

      {/* Agreed Deliverables & Acceptance Criteria */}
      <div className="mt-8 break-inside-avoid">
        <h2 className="font-editorial text-xl font-bold text-[#21473A] border-b border-[#E5E0D5] pb-2">
          1. Agreed Deliverables & Acceptance Criteria
        </h2>
        <div className="mt-4 space-y-4">
          {project.proposal.deliverables.map((del, idx) => (
            <div
              key={del.id || idx}
              className="rounded-lg border border-[#E5E0D5] p-3.5 break-inside-avoid print:border-gray-200"
            >
              <div className="flex items-baseline justify-between">
                <h4 className="font-semibold text-xs text-[#21473A]">
                  1.{idx + 1} {del.title}
                </h4>
                {del.estimatedHours ? (
                  <span className="font-mono text-[11px] text-[#1F2923]/60">
                    Est. {del.estimatedHours} hrs
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[#1F2923]/80 leading-relaxed">{del.description}</p>

              {del.acceptanceCriteria && del.acceptanceCriteria.length > 0 && (
                <div className="mt-2.5 bg-[#F7F5EF]/60 p-2 rounded text-[11px] print:bg-gray-50">
                  <span className="font-semibold text-[#21473A] block mb-1">
                    Acceptance Criteria:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[#1F2923]/75">
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
      <div className="mt-8 break-inside-avoid">
        <div className="flex items-center space-x-2 border-b border-[#E5E0D5] pb-2">
          <h2 className="font-editorial text-xl font-bold text-[#21473A]">
            2. Explicit Exclusions (Out-of-Scope)
          </h2>
          <span className="rounded bg-[#E9795C]/20 px-2 py-0.5 text-[10px] font-bold text-[#E9795C] print:border print:border-red-400">
            Airtight Boundaries
          </span>
        </div>
        <p className="mt-2 text-xs text-[#1F2923]/70">
          To maintain timeline and budget integrity, the following items are expressly excluded from this proposal. Any work relating to these areas constitutes a scope change and requires separate agreement:
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-2 text-xs text-[#1F2923]/80 sm:grid-cols-2">
          {project.proposal.explicitExclusions.map((ex, i) => (
            <li key={i} className="flex items-start space-x-2 rounded border border-[#E5E0D5] p-2 bg-white print:border-gray-200">
              <span className="text-[#E9795C] font-bold">✕</span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Assumptions & Dependencies */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 break-inside-avoid">
        <div className="rounded-lg border border-[#E5E0D5] p-3.5 print:border-gray-200">
          <h3 className="font-editorial text-base font-bold text-[#21473A]">
            3. Project Assumptions
          </h3>
          <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-[#1F2923]/75">
            {project.proposal.assumptions.map((as, i) => (
              <li key={i}>{as}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-[#E5E0D5] p-3.5 print:border-gray-200">
          <h3 className="font-editorial text-base font-bold text-[#21473A]">
            4. Revision Terms & Policy
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#1F2923]/75">
            {project.proposal.revisionTerms}
          </p>
        </div>
      </div>

      {/* Financial Quote & Line Items Table */}
      <div className="mt-8 break-inside-avoid">
        <h2 className="font-editorial text-xl font-bold text-[#21473A] border-b border-[#E5E0D5] pb-2">
          5. Project Investment & Quote
        </h2>

        <div className="mt-4 overflow-hidden rounded-lg border border-[#E5E0D5] print:border-gray-300">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5EF] font-semibold text-[#21473A] print:bg-gray-100">
              <tr>
                <th className="p-2.5">Scope Item</th>
                <th className="p-2.5 text-right">
                  {project.quoteConfig.rateType === 'hourly' ? 'Hours' : 'Qty'}
                </th>
                <th className="p-2.5 text-right">Rate</th>
                <th className="p-2.5 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D5] print:divide-gray-200">
              {project.quoteItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-2.5">
                    <span className="font-semibold">{item.title}</span>
                    <p className="text-[11px] text-[#1F2923]/60">{item.description}</p>
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
          <div className="border-t-2 border-[#21473A] bg-[#F7F5EF]/60 p-4 text-xs print:bg-gray-50">
            <div className="ml-auto max-w-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#1F2923]/70">Subtotal:</span>
                <span className="font-mono font-semibold">
                  {formatCurrency(totals.subtotal, project.quoteConfig.currency)}
                </span>
              </div>
              {totals.contingencyAmount > 0 && (
                <div className="flex justify-between text-[#21473A]">
                  <span>Contingency ({project.quoteConfig.contingencyPercent}%):</span>
                  <span className="font-mono font-semibold">
                    +{formatCurrency(totals.contingencyAmount, project.quoteConfig.currency)}
                  </span>
                </div>
              )}
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-[#E9795C]">
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
                <div className="flex justify-between text-[11px] text-[#1F2923]/50">
                  <span>Taxes:</span>
                  <span>Excluding taxes</span>
                </div>
              )}
              <div className="border-t border-[#21473A]/30 pt-1.5 flex justify-between font-bold text-sm text-[#21473A]">
                <span>Total Estimated Investment:</span>
                <span className="font-mono">
                  {formatCurrency(totals.grandTotal, project.quoteConfig.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Milestones */}
      <div className="mt-8 break-inside-avoid">
        <h2 className="font-editorial text-xl font-bold text-[#21473A] border-b border-[#E5E0D5] pb-2">
          6. Payment Milestone Schedule
        </h2>
        <div className="mt-3 divide-y divide-[#E5E0D5] text-xs">
          {project.quoteConfig.paymentSchedule.map((m) => {
            const val = totals.grandTotal * (m.percentage / 100);
            return (
              <div key={m.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#21473A]">{m.phase}</span>
                  <p className="text-[11px] text-[#1F2923]/60">{m.trigger}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="font-semibold">
                    {formatCurrency(val, project.quoteConfig.currency)}
                  </span>
                  <span className="text-[11px] text-[#1F2923]/50 block">({m.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps & Signoff */}
      <div className="mt-10 border-t-2 border-[#21473A] pt-4 break-inside-avoid text-xs">
        <h3 className="font-editorial text-base font-bold text-[#21473A]">
          Client Sign-off & Next Steps
        </h3>
        <p className="mt-1 text-[#1F2923]/70">
          To proceed with the scope outlined above, please approve this proposal and schedule the kickoff session.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-8 pt-4">
          <div className="border-t border-[#1F2923]/40 pt-2">
            <p className="font-semibold text-xs text-[#21473A]">Prepared By (Freelancer):</p>
            <p className="text-[11px] text-[#1F2923]/60">Independent Specialist</p>
          </div>
          <div className="border-t border-[#1F2923]/40 pt-2">
            <p className="font-semibold text-xs text-[#21473A]">Accepted By (Client):</p>
            <p className="text-[11px] text-[#1F2923]/60">Authorized Representative</p>
          </div>
        </div>
      </div>
    </div>
  );
};
