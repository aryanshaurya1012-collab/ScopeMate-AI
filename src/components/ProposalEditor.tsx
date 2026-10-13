import React, { useState } from 'react';
import { SavedProject, Deliverable, ProposalContent } from '../types/index.ts';
import { QuoteCalculator } from './QuoteCalculator.tsx';
import { PrintDocument } from './PrintDocument.tsx';
import {
  Printer,
  Save,
  Copy,
  Check,
  Sparkles,
  Edit3,
  Eye,
  Calculator,
  Plus,
  Trash2,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface ProposalEditorProps {
  project: SavedProject;
  onSave: (updated: SavedProject) => void;
  onOpenScopeChange: (project: SavedProject) => void;
}

type EditorViewMode = 'preview' | 'structured' | 'quote';

export const ProposalEditor: React.FC<ProposalEditorProps> = ({
  project,
  onSave,
  onOpenScopeChange,
}) => {
  const [currentProject, setCurrentProject] = useState<SavedProject>(project);
  const [viewMode, setViewMode] = useState<EditorViewMode>('structured');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  const handleUpdateProposal = (updates: Partial<ProposalContent>) => {
    const next: SavedProject = {
      ...currentProject,
      proposal: {
        ...currentProject.proposal,
        ...updates,
      },
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(next);
  };

  const handleManualSave = () => {
    onSave(currentProject);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `PROJECT SCOPE SUMMARY: ${currentProject.brief.projectName}
Client: ${currentProject.brief.clientName || 'N/A'}

OBJECTIVE:
${currentProject.proposal.businessObjective}

DELIVERABLES:
${currentProject.proposal.deliverables.map((d, i) => `${i + 1}. ${d.title}: ${d.description}`).join('\n')}

EXPLICIT EXCLUSIONS:
${currentProject.proposal.explicitExclusions.map((e) => `- ${e}`).join('\n')}

REVISION TERMS:
${currentProject.proposal.revisionTerms}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleRegenerateSection = async (sectionKey: 'explicitExclusions' | 'assumptions') => {
    setRegeneratingSection(sectionKey);
    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: sectionKey,
          projectContext: {
            projectName: currentProject.brief.projectName,
            serviceType: currentProject.brief.serviceType,
            deliverables: currentProject.proposal.deliverables,
          },
          currentContent: currentProject.proposal[sectionKey],
        }),
      });

      const data = await response.json();
      if (data.success && data.result && data.result.content) {
        handleUpdateProposal({
          [sectionKey]: Array.isArray(data.result.content)
            ? data.result.content
            : [data.result.content],
        });
      }
    } catch (err) {
      console.error(`Failed to regenerate ${sectionKey}:`, err);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Deliverable editing helpers
  const handleUpdateDeliverable = (id: string, updates: Partial<Deliverable>) => {
    const nextDeliverables = currentProject.proposal.deliverables.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    handleUpdateProposal({ deliverables: nextDeliverables });
  };

  const handleAddDeliverable = () => {
    const newDel: Deliverable = {
      id: `del-${Date.now()}`,
      title: 'New Scoped Deliverable',
      description: 'Describe functional capabilities and deliverables',
      acceptanceCriteria: ['Verification criterion 1', 'Verification criterion 2'],
      estimatedHours: 10,
    };
    handleUpdateProposal({ deliverables: [...currentProject.proposal.deliverables, newDel] });
  };

  const handleDeleteDeliverable = (id: string) => {
    handleUpdateProposal({
      deliverables: currentProject.proposal.deliverables.filter((d) => d.id !== id),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Action Bar */}
      <div className="no-print mb-6 flex flex-col justify-between gap-4 border-b border-[#E5E0D5] pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-editorial text-2xl font-bold text-[#21473A] sm:text-3xl">
              {currentProject.brief.projectName}
            </span>
            {currentProject.isSample && (
              <span className="rounded bg-[#E9795C]/20 px-2 py-0.5 text-[10px] font-bold text-[#E9795C]">
                Sample Project
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#1F2923]/60">
            {currentProject.brief.clientName || 'Independent Client'} • Model: {currentProject.proposal.modelUsed || 'gemma-4-26b-a4b-it'}
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-[#E5E0D5] bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('structured')}
              className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'structured'
                  ? 'bg-[#21473A] text-white'
                  : 'text-[#1F2923]/70 hover:text-[#1F2923]'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Scope Editor</span>
            </button>

            <button
              onClick={() => setViewMode('quote')}
              className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'quote'
                  ? 'bg-[#21473A] text-white'
                  : 'text-[#1F2923]/70 hover:text-[#1F2923]'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Quote Calculator</span>
            </button>

            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'preview'
                  ? 'bg-[#21473A] text-white'
                  : 'text-[#1F2923]/70 hover:text-[#1F2923]'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Document Preview & Print</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 rounded-md border border-[#21473A]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#21473A] shadow-2xs hover:bg-[#DCE7DC]/40"
              title="Copy plain text summary"
            >
              {copiedSummary ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rounded-md border border-[#21473A]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#21473A] shadow-2xs hover:bg-[#DCE7DC]/40"
              title="Print to A4 PDF via browser"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print A4 PDF</span>
            </button>

            <button
              onClick={handleManualSave}
              className="flex items-center space-x-1.5 rounded-md bg-[#21473A] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#18362C]"
            >
              {isSaved ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Save className="h-3.5 w-3.5" />}
              <span>{isSaved ? 'Saved!' : 'Save Project'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE: DOCUMENT PREVIEW */}
      {viewMode === 'preview' && (
        <div className="space-y-4">
          <div className="no-print flex items-center justify-between rounded-lg border border-[#21473A]/20 bg-[#ECE7DC]/60 p-3 text-xs text-[#21473A]">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>A4 Document Preview Mode • Ready for browser PDF export</span>
            </div>
            <button
              onClick={handlePrint}
              className="rounded bg-[#21473A] px-3 py-1 font-semibold text-white hover:bg-[#18362C]"
            >
              Print Now
            </button>
          </div>

          <div className="rounded-xl border border-[#E5E0D5] bg-white p-6 shadow-sm sm:p-12">
            <PrintDocument project={currentProject} />
          </div>
        </div>
      )}

      {/* VIEW MODE: QUOTE CALCULATOR */}
      {viewMode === 'quote' && (
        <div className="space-y-4">
          <QuoteCalculator
            items={currentProject.quoteItems}
            config={currentProject.quoteConfig}
            onChangeItems={(items) => setCurrentProject({ ...currentProject, quoteItems: items })}
            onChangeConfig={(config) => setCurrentProject({ ...currentProject, quoteConfig: config })}
          />
        </div>
      )}

      {/* VIEW MODE: STRUCTURED SCOPE EDITOR */}
      {viewMode === 'structured' && (
        <div className="space-y-6">
          {/* Executive Intro & Objective */}
          <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-[#21473A]">
              1. Proposal Introduction & Business Objective
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Proposal Introduction Note</label>
              <textarea
                rows={3}
                value={currentProject.proposal.proposalIntro}
                onChange={(e) => handleUpdateProposal({ proposalIntro: e.target.value })}
                className="mt-1 w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 p-2.5 text-xs text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#1F2923]">Project Summary</label>
                <textarea
                  rows={3}
                  value={currentProject.proposal.projectSummary}
                  onChange={(e) => handleUpdateProposal({ projectSummary: e.target.value })}
                  className="mt-1 w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 p-2.5 text-xs text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2923]">Business Objective</label>
                <textarea
                  rows={3}
                  value={currentProject.proposal.businessObjective}
                  onChange={(e) => handleUpdateProposal({ businessObjective: e.target.value })}
                  className="mt-1 w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/40 p-2.5 text-xs text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Deliverables & Acceptance Criteria */}
          <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#21473A]">
                  2. Scoped Deliverables & Acceptance Criteria
                </h3>
                <p className="text-xs text-[#1F2923]/60">
                  Explicit criteria define when work is legally accepted and complete
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDeliverable}
                className="flex items-center space-x-1 rounded border border-[#21473A]/25 bg-white px-2.5 py-1 text-xs font-semibold text-[#21473A] hover:bg-[#DCE7DC]/40"
              >
                <Plus className="h-3 w-3" />
                <span>Add Deliverable</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {currentProject.proposal.deliverables.map((del, idx) => (
                <div
                  key={del.id}
                  className="rounded-lg border border-[#E5E0D5] bg-[#F7F5EF]/20 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#21473A]">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={del.title}
                          onChange={(e) => handleUpdateDeliverable(del.id, { title: e.target.value })}
                          className="w-full rounded border border-[#E5E0D5] bg-white px-2 py-1 text-xs font-semibold text-[#21473A] focus:border-[#21473A] focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={del.description}
                        onChange={(e) =>
                          handleUpdateDeliverable(del.id, { description: e.target.value })
                        }
                        placeholder="Detailed description..."
                        className="w-full rounded border border-transparent bg-transparent px-2 py-0.5 text-xs text-[#1F2923]/70 hover:border-[#E5E0D5] focus:border-[#21473A] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-[11px] text-[#1F2923]/60">Est:</span>
                        <input
                          type="number"
                          value={del.estimatedHours || 0}
                          onChange={(e) =>
                            handleUpdateDeliverable(del.id, {
                              estimatedHours: Number(e.target.value) || 0,
                            })
                          }
                          className="w-14 rounded border border-[#E5E0D5] bg-white px-1.5 py-0.5 text-right font-mono text-xs"
                        />
                        <span className="text-[11px] text-[#1F2923]/60">hrs</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteDeliverable(del.id)}
                        className="rounded p-1 text-[#E9795C] hover:bg-red-50"
                        title="Delete deliverable"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Acceptance criteria */}
                  <div className="rounded border border-[#E5E0D5] bg-white p-2.5 text-xs space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#21473A]">
                      Acceptance Criteria (Checklist):
                    </span>
                    {(del.acceptanceCriteria || []).map((crit, cIdx) => (
                      <div key={cIdx} className="flex items-center space-x-2">
                        <span className="text-emerald-700">✓</span>
                        <input
                          type="text"
                          value={crit}
                          onChange={(e) => {
                            const nextCrit = [...del.acceptanceCriteria];
                            nextCrit[cIdx] = e.target.value;
                            handleUpdateDeliverable(del.id, { acceptanceCriteria: nextCrit });
                          }}
                          className="w-full rounded border-b border-transparent bg-transparent px-1 py-0.5 text-xs text-[#1F2923]/80 hover:border-[#E5E0D5] focus:border-[#21473A] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextCrit = del.acceptanceCriteria.filter((_, i) => i !== cIdx);
                            handleUpdateDeliverable(del.id, { acceptanceCriteria: nextCrit });
                          }}
                          className="text-[#1F2923]/40 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateDeliverable(del.id, {
                          acceptanceCriteria: [
                            ...(del.acceptanceCriteria || []),
                            'New acceptance verification test',
                          ],
                        });
                      }}
                      className="text-[10px] font-semibold text-[#21473A] hover:underline"
                    >
                      + Add Criterion
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explicit Exclusions */}
          <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-editorial text-lg font-bold text-[#21473A]">
                  3. Explicit Exclusions (Out of Scope)
                </h3>
                <span className="rounded bg-[#E9795C]/20 px-2 py-0.5 text-[10px] font-bold text-[#E9795C]">
                  Contractual Shield
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleRegenerateSection('explicitExclusions')}
                  disabled={regeneratingSection === 'explicitExclusions'}
                  className="flex items-center space-x-1 rounded border border-[#21473A]/20 bg-white px-2 py-1 text-xs text-[#21473A] hover:bg-[#DCE7DC]/40 disabled:opacity-50"
                  title="Use Gemma 4 to strengthen exclusions"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${
                      regeneratingSection === 'explicitExclusions' ? 'animate-spin' : ''
                    }`}
                  />
                  <span>Enhance with Gemma</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateProposal({
                      explicitExclusions: [
                        ...currentProject.proposal.explicitExclusions,
                        'New explicit exclusion item',
                      ],
                    })
                  }
                  className="flex items-center space-x-1 rounded border border-[#21473A]/25 bg-white px-2 py-1 text-xs font-semibold text-[#21473A] hover:bg-[#DCE7DC]/40"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <p className="mt-1 text-xs text-[#1F2923]/60">
              Clear exclusions remove ambiguity and provide contractual grounds to charge for additions.
            </p>

            <div className="mt-3 space-y-2">
              {currentProject.proposal.explicitExclusions.map((ex, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-[#E9795C] font-bold text-xs">✕</span>
                  <input
                    type="text"
                    value={ex}
                    onChange={(e) => {
                      const next = [...currentProject.proposal.explicitExclusions];
                      next[idx] = e.target.value;
                      handleUpdateProposal({ explicitExclusions: next });
                    }}
                    className="w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/30 px-2.5 py-1 text-xs text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = currentProject.proposal.explicitExclusions.filter((_, i) => i !== idx);
                      handleUpdateProposal({ explicitExclusions: next });
                    }}
                    className="p-1 text-[#1F2923]/40 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions & Revision Policy */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="font-editorial text-base font-bold text-[#21473A]">
                  4. Working Assumptions
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateProposal({
                      assumptions: [
                        ...currentProject.proposal.assumptions,
                        'Client will provide required assets before Week 1',
                      ],
                    })
                  }
                  className="text-xs font-semibold text-[#21473A] hover:underline"
                >
                  + Add
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {currentProject.proposal.assumptions.map((as, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-xs text-[#21473A]">•</span>
                    <input
                      type="text"
                      value={as}
                      onChange={(e) => {
                        const next = [...currentProject.proposal.assumptions];
                        next[idx] = e.target.value;
                        handleUpdateProposal({ assumptions: next });
                      }}
                      className="w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/30 px-2 py-1 text-xs text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = currentProject.proposal.assumptions.filter((_, i) => i !== idx);
                        handleUpdateProposal({ assumptions: next });
                      }}
                      className="p-1 text-[#1F2923]/40 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs">
              <h4 className="font-editorial text-base font-bold text-[#21473A]">
                5. Revision Terms & Scope Policy
              </h4>
              <p className="mt-1 text-[11px] text-[#1F2923]/60">
                Boundaries for included review iterations
              </p>
              <textarea
                rows={4}
                value={currentProject.proposal.revisionTerms}
                onChange={(e) => handleUpdateProposal({ revisionTerms: e.target.value })}
                className="mt-3 w-full rounded border border-[#E5E0D5] bg-[#F7F5EF]/30 p-2.5 text-xs text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>
          </div>

          {/* Quick jump to Scope Change Analyzer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#21473A]/20 bg-[#DCE7DC]/40 p-4">
            <div>
              <h4 className="font-semibold text-xs text-[#21473A]">
                Got an unexpected client email asking for additions?
              </h4>
              <p className="text-xs text-[#1F2923]/70">
                Audit the new request against this approved scope with Gemma 4.
              </p>
            </div>
            <button
              onClick={() => onOpenScopeChange(currentProject)}
              className="flex items-center space-x-1.5 rounded-lg bg-[#21473A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#18362C]"
            >
              <span>Launch Scope Change Analyzer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
