import React from 'react';
import { SavedProject } from '../types/index.ts';
import { formatCurrency, calculateQuoteTotals } from '../utils/calculator.ts';
import {
  FileText,
  GitCompare,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calculator,
  CheckCircle2,
  Trash2,
  ExternalLink,
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
  const totalScopeAnalyses = projects.reduce(
    (acc, p) => acc + (p.scopeAnalyses?.length || 0),
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Editorial Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[#21473A]/15 bg-linear-to-b from-[#ECE7DC] to-[#F7F5EF] p-6 shadow-xs sm:p-10">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center space-x-2 rounded-full border border-[#21473A]/20 bg-[#DCE7DC]/70 px-3 py-1 text-xs font-semibold text-[#21473A]">
            <Sparkles className="h-3.5 w-3.5 text-[#E9795C]" />
            <span>Open-Weight AI • Gemma 4 Model Integration</span>
          </div>

          <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#21473A] sm:text-5xl sm:leading-[1.15]">
            Turn vague client briefs into airtight scopes, deterministic quotes & change defense.
          </h1>

          <p className="mt-4 text-base text-[#1F2923]/80 sm:text-lg sm:leading-relaxed">
            ScopeMate protects freelance web developers, designers, and creators from scope creep.
            Translate messy emails into professional proposals with explicit exclusions, deterministic
            pricing calculations, and instant AI audits whenever clients ask for “just one more thing.”
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNewProposal}
              className="flex items-center space-x-2 rounded-lg bg-[#21473A] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#18362C]"
            >
              <Plus className="h-4 w-4" />
              <span>Draft New Client Scope</span>
            </button>

            <button
              onClick={onLoadSample}
              className="flex items-center space-x-2 rounded-lg border border-[#21473A]/30 bg-white px-5 py-3 text-sm font-semibold text-[#21473A] shadow-xs transition hover:bg-[#DCE7DC]/40"
            >
              <Sparkles className="h-4 w-4 text-[#E9795C]" />
              <span>Explore Sample Project</span>
            </button>
          </div>
        </div>

        {/* Feature pillars */}
        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-[#E5E0D5] pt-6 sm:grid-cols-3">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#21473A]/10 text-[#21473A]">
              <ShieldAlert className="h-4 w-4 text-[#E9795C]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#21473A]">Airtight Exclusions</h4>
              <p className="text-xs text-[#1F2923]/70">
                Gemma 4 defines explicit out-of-scope boundaries so clients can never claim it was “assumed.”
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#21473A]/10 text-[#21473A]">
              <Calculator className="h-4 w-4 text-[#21473A]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#21473A]">Deterministic Quote Math</h4>
              <p className="text-xs text-[#1F2923]/70">
                Line items, contingency buffer, and discounts calculated purely by TypeScript arithmetic.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#21473A]/10 text-[#21473A]">
              <GitCompare className="h-4 w-4 text-[#21473A]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#21473A]">Scope Change Analyzer</h4>
              <p className="text-xs text-[#1F2923]/70">
                Paste client change messages to classify scope impact and generate diplomatic email drafts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-4 shadow-2xs">
          <span className="text-xs font-medium text-[#1F2923]/60">Saved Projects</span>
          <p className="mt-1 font-editorial text-2xl font-bold text-[#21473A]">{projects.length}</p>
        </div>
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-4 shadow-2xs">
          <span className="text-xs font-medium text-[#1F2923]/60">Scope Change Audits</span>
          <p className="mt-1 font-editorial text-2xl font-bold text-[#21473A]">{totalScopeAnalyses}</p>
        </div>
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-4 shadow-2xs">
          <span className="text-xs font-medium text-[#1F2923]/60">Configured AI Model</span>
          <p className="mt-1 font-editorial text-lg font-bold text-[#21473A] truncate">gemma-4-26b-a4b-it</p>
        </div>
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-4 shadow-2xs">
          <span className="text-xs font-medium text-[#1F2923]/60">Data Persistence</span>
          <p className="mt-1 font-editorial text-lg font-bold text-[#21473A]">Local / Private</p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#21473A]">Your Scopes & Proposals</h2>
            <p className="text-sm text-[#1F2923]/70">Manage saved client agreements and analyze mid-project change requests</p>
          </div>

          <button
            onClick={onNewProposal}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#21473A] hover:underline"
          >
            <span>Create another</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[#21473A]/25 bg-white/70 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DCE7DC]">
              <FileText className="h-6 w-6 text-[#21473A]" />
            </div>
            <h3 className="mt-4 font-editorial text-xl font-bold text-[#21473A]">No proposals saved yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#1F2923]/70">
              Create your first project scope from a client brief, or explore the sample AeroPay project to see how ScopeMate operates.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={onNewProposal}
                className="rounded-lg bg-[#21473A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#18362C]"
              >
                Create New Proposal
              </button>
              <button
                onClick={onLoadSample}
                className="rounded-lg border border-[#21473A]/30 bg-white px-4 py-2 text-xs font-semibold text-[#21473A] hover:bg-[#DCE7DC]/40"
              >
                Load Sample Project
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => {
              const totals = calculateQuoteTotals(proj.quoteItems || [], proj.quoteConfig);
              return (
                <div
                  key={proj.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs transition hover:border-[#21473A]/40 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-[#DCE7DC] px-2 py-0.5 text-[11px] font-semibold text-[#21473A]">
                          {proj.brief.serviceType.replace('_', ' ').toUpperCase()}
                        </span>
                        {proj.isSample && (
                          <span className="rounded bg-[#E9795C]/15 px-2 py-0.5 text-[11px] font-semibold text-[#E9795C]">
                            Sample
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[#1F2923]/50">
                        {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="mt-3 font-editorial text-xl font-bold text-[#21473A] group-hover:text-[#18362C]">
                      {proj.brief.projectName}
                    </h3>
                    {proj.brief.clientName && (
                      <p className="text-xs font-medium text-[#1F2923]/70">{proj.brief.clientName}</p>
                    )}

                    <p className="mt-2.5 line-clamp-2 text-xs text-[#1F2923]/70">
                      {proj.proposal.projectSummary}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#E5E0D5]/70 pt-3 text-xs">
                      <span className="text-[#1F2923]/60">Quote Total:</span>
                      <span className="font-mono font-bold text-[#21473A]">
                        {formatCurrency(totals.grandTotal, proj.quoteConfig.currency)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#1F2923]/60">
                      <span>{proj.proposal.deliverables?.length || 0} Deliverables</span>
                      <span>{proj.proposal.explicitExclusions?.length || 0} Exclusions</span>
                      <span>{proj.scopeAnalyses?.length || 0} Change Audits</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#E5E0D5]/70 pt-3">
                    <button
                      onClick={() => onOpenProject(proj)}
                      className="flex items-center space-x-1 text-xs font-semibold text-[#21473A] hover:underline"
                    >
                      <span>View & Edit</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenScopeChange(proj)}
                        className="flex items-center space-x-1 rounded bg-[#DCE7DC]/60 px-2 py-1 text-[11px] font-semibold text-[#21473A] hover:bg-[#DCE7DC]"
                        title="Analyze new client request against this scope"
                      >
                        <GitCompare className="h-3 w-3" />
                        <span>Audit Change</span>
                      </button>

                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="rounded p-1 text-[#1F2923]/40 hover:bg-red-50 hover:text-red-600"
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
    </div>
  );
};
