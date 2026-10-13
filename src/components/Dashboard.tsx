import React from 'react';
import { SavedProject } from '../types/index.ts';
import { formatCurrency, calculateQuoteTotals } from '../utils/calculator.ts';
import {
  FileText,
  GitCompare,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface DashboardProps {
  projects: SavedProject[];
  onNewProposal: () => void;
  onOpenProject: (project: SavedProject) => void;
  onOpenScopeChange: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onLoadSample: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onNewProposal,
  onOpenProject,
  onOpenScopeChange,
  onDeleteProject,
  onLoadSample,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Compact Introduction Section */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl">
              Turn client briefs into clear scopes, quotes & change defense.
            </h1>
            <p className="mt-2 text-sm text-[#64748B] sm:text-base">
              ScopeMate helps independent freelancers define explicit deliverables, establish contractual exclusions,
              calculate deterministic quotes, and diplomatically push back on out-of-scope requests.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              onClick={onNewProposal}
              className="flex items-center space-x-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#115E59]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Proposal</span>
            </button>

            <button
              onClick={onLoadSample}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1E293B] transition hover:bg-slate-50"
            >
              Try sample project
            </button>
          </div>
        </div>

        {/* 3 Core Pillars in Compact Strip */}
        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#E2E8F0] pt-6 sm:grid-cols-3">
          <div className="flex items-start space-x-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[#F0FDFA] text-[#0F766E]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1E293B]">Explicit Exclusions</p>
              <p className="text-[11px] text-[#64748B]">
                Define clear boundaries so clients cannot claim assumptions were included.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[#F0FDFA] text-[#0F766E]">
              <Calculator className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1E293B]">Deterministic Quote Math</p>
              <p className="text-[11px] text-[#64748B]">
                Line items, contingency buffer, and discounts calculated purely by TypeScript arithmetic.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[#F0FDFA] text-[#0F766E]">
              <GitCompare className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1E293B]">Scope Change Analyzer</p>
              <p className="text-[11px] text-[#64748B]">
                Classify new requests against approved scope and draft polite client responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Recent Scopes & Proposals</h2>
              <p className="text-xs text-[#64748B]">Your stored project baselines ({projects.length})</p>
            </div>

            {projects.length > 0 && (
              <button
                onClick={onNewProposal}
                className="text-xs font-semibold text-[#0F766E] hover:underline"
              >
                + New proposal
              </button>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[#64748B]">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[#1E293B]">No proposals created yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-[#64748B]">
                Turn your first client brief into a structured scope, or load the sample project to see how ScopeMate works.
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <button
                  onClick={onNewProposal}
                  className="rounded-lg bg-[#0F766E] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#115E59]"
                >
                  Create Proposal
                </button>
                <button
                  onClick={onLoadSample}
                  className="rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1E293B] hover:bg-slate-50"
                >
                  Load Sample
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {projects.map((proj) => {
                const totals = calculateQuoteTotals(proj.quoteItems || [], proj.quoteConfig);
                return (
                  <div
                    key={proj.id}
                    className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-2xs transition hover:border-[#CBD5E1] hover:shadow-xs sm:flex-row sm:items-center"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="truncate text-sm font-semibold text-[#1E293B]">
                          {proj.brief.projectName}
                        </span>
                        {proj.isSample && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-[#64748B]">
                            Sample
                          </span>
                        )}
                        <span className="rounded bg-[#F0FDFA] px-1.5 py-0.2 text-[10px] font-medium text-[#0F766E]">
                          {proj.brief.serviceType.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                        {proj.brief.clientName && <span>Client: {proj.brief.clientName}</span>}
                        <span>{proj.proposal.deliverables?.length || 0} Deliverables</span>
                        <span>{proj.proposal.explicitExclusions?.length || 0} Exclusions</span>
                        <span>Updated: {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#E2E8F0] pt-2 sm:mt-0 sm:border-0 sm:pt-0 sm:justify-end sm:space-x-4">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-[#64748B] block">Estimate</span>
                        <span className="font-mono text-sm font-bold text-[#1E293B]">
                          {formatCurrency(totals.grandTotal, proj.quoteConfig.currency)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onOpenProject(proj)}
                          className="rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E293B] hover:bg-slate-50"
                        >
                          View Scope
                        </button>

                        <button
                          onClick={() => onOpenScopeChange(proj)}
                          className="rounded-md bg-[#F0FDFA] px-2.5 py-1 text-xs font-medium text-[#0F766E] hover:bg-[#CCFBF1]"
                          title="Audit new client request"
                        >
                          Audit Change
                        </button>

                        <button
                          onClick={() => onDeleteProject(proj.id)}
                          className="rounded-md p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Scope Change Analyzer Secondary Action & Guidelines */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#0F766E]">
              <GitCompare className="h-4 w-4" />
              <span>Scope Change Analyzer</span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-[#1E293B]">
              Client asking for extra work mid-sprint?
            </h3>
            <p className="mt-1 text-xs text-[#64748B]">
              Paste any email, Slack message, or chat snippet. The analyzer evaluates the request against your approved scope and drafts a professional response.
            </p>

            <button
              onClick={() => {
                if (projects.length > 0) {
                  onOpenScopeChange(projects[0]);
                } else {
                  onLoadSample();
                }
              }}
              className="mt-4 flex w-full items-center justify-center space-x-1.5 rounded-lg border border-[#0F766E] bg-white py-2 text-xs font-semibold text-[#0F766E] hover:bg-[#F0FDFA]"
            >
              <span>Launch Analyzer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs text-xs text-[#64748B]">
            <h4 className="font-semibold text-[#1E293B] mb-2">Scope Defense Best Practices</h4>
            <ul className="space-y-2 list-disc list-inside text-[11px] leading-relaxed">
              <li>Always include at least 3 explicit exclusions (e.g. backend data entry, translation).</li>
              <li>Include a 10% contingency buffer to protect against unexpected revisions.</li>
              <li>Limit revision iterations to 2 consolidated rounds per milestone.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
