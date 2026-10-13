import React, { useState } from 'react';
import {
  SavedProject,
  ScopeChangeAnalysis,
  ScopeClassification,
} from '../types/index.ts';
import { formatCurrency } from '../utils/calculator.ts';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Plus,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface ScopeChangeAnalyzerProps {
  projects: SavedProject[];
  activeProject: SavedProject | null;
  onSelectProject: (project: SavedProject) => void;
  onUpdateProject: (updated: SavedProject) => void;
  onOpenQuoteEditor: (project: SavedProject) => void;
}

export const ScopeChangeAnalyzer: React.FC<ScopeChangeAnalyzerProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onUpdateProject,
  onOpenQuoteEditor,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    activeProject?.id || (projects.length > 0 ? projects[0].id : '')
  );

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || activeProject || (projects.length > 0 ? projects[0] : null);

  const [clientMessage, setClientMessage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ScopeChangeAnalysis | null>(
    currentProject?.scopeAnalyses && currentProject.scopeAnalyses.length > 0
      ? currentProject.scopeAnalyses[0]
      : null
  );

  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [addedItemsNotice, setAddedItemsNotice] = useState<boolean>(false);

  const handleRunAnalysis = async () => {
    if (!currentProject) return;
    if (!clientMessage.trim() || clientMessage.trim().length < 15) {
      setAnalysisError('Please paste a client message or request of at least 15 characters.');
      return;
    }

    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/scope-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalScope: {
            projectName: currentProject.brief.projectName,
            deliverables: currentProject.proposal.deliverables,
            explicitExclusions: currentProject.proposal.explicitExclusions,
            assumptions: currentProject.proposal.assumptions,
            revisionTerms: currentProject.proposal.revisionTerms,
          },
          newClientMessage: clientMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || 'Failed to analyze scope change with Gemma model');
      }

      const rawAnalysis = data.analysis;
      const newAnalysis: ScopeChangeAnalysis = {
        id: `analysis-${Date.now()}`,
        createdAt: new Date().toISOString(),
        clientMessage,
        requestSummary: rawAnalysis.requestSummary,
        items: rawAnalysis.items || [],
        clarificationQuestionsToAsk: rawAnalysis.clarificationQuestionsToAsk || [],
        changeRequestSummary: rawAnalysis.changeRequestSummary || '',
        clientMessageDraft: rawAnalysis.clientMessageDraft || '',
        suggestedExtraLineItems: rawAnalysis.suggestedExtraLineItems || [],
        modelUsed: data.modelUsed,
      };

      setCurrentAnalysis(newAnalysis);

      // Save to project history
      const updatedProject: SavedProject = {
        ...currentProject,
        scopeAnalyses: [newAnalysis, ...(currentProject.scopeAnalyses || [])],
      };
      onUpdateProject(updatedProject);
    } catch (err: any) {
      console.error('Scope change analysis error:', err);
      setAnalysisError(
        err.message || 'Error communicating with Gemma 4 server endpoint. Check API key configuration.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyDraft = () => {
    if (!currentAnalysis) return;
    navigator.clipboard.writeText(currentAnalysis.clientMessageDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handleOverrideClassification = (itemId: string, newClass: ScopeClassification) => {
    if (!currentAnalysis) return;
    const updatedItems = currentAnalysis.items.map((item) =>
      item.id === itemId ? { ...item, classification: newClass, userOverride: newClass } : item
    );
    const updatedAnalysis: ScopeChangeAnalysis = {
      ...currentAnalysis,
      items: updatedItems,
    };
    setCurrentAnalysis(updatedAnalysis);

    if (currentProject) {
      const updatedAnalyses = currentProject.scopeAnalyses.map((a) =>
        a.id === updatedAnalysis.id ? updatedAnalysis : a
      );
      onUpdateProject({ ...currentProject, scopeAnalyses: updatedAnalyses });
    }
  };

  const handleAddExtraItemsToQuote = () => {
    if (!currentProject || !currentAnalysis || !currentAnalysis.suggestedExtraLineItems) return;

    const extraItems = currentAnalysis.suggestedExtraLineItems.map((item) => ({
      ...item,
      id: `addon-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isAdditional: true,
    }));

    const nextQuoteItems = [...currentProject.quoteItems, ...extraItems];

    const updatedProject: SavedProject = {
      ...currentProject,
      quoteItems: nextQuoteItems,
    };

    onUpdateProject(updatedProject);
    setAddedItemsNotice(true);
    setTimeout(() => setAddedItemsNotice(false), 4000);
  };

  if (!currentProject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[#64748B]">
          <GitCompare className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-base font-bold text-[#1E293B]">
          No Active Project Selected
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          To run a scope change audit, select an existing proposal or create a new one first.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
          Scope Change Analyzer
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Evaluate new client messages against approved baseline deliverables and exclusions to classify what’s included, what’s extra, and draft a response.
        </p>

        {/* Project Selector Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-[#1E293B]">Project Baseline:</span>
          <select
            value={currentProject.id}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              const found = projects.find((p) => p.id === e.target.value);
              if (found) {
                onSelectProject(found);
                if (found.scopeAnalyses && found.scopeAnalyses.length > 0) {
                  setCurrentAnalysis(found.scopeAnalyses[0]);
                } else {
                  setCurrentAnalysis(null);
                }
              }
            }}
            className="rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#0F766E] focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brief.projectName} {p.isSample ? '(Sample)' : ''}
              </option>
            ))}
          </select>

          <span className="text-xs text-[#64748B]">
            ({currentProject.proposal.deliverables?.length || 0} Deliverables,{' '}
            {currentProject.proposal.explicitExclusions?.length || 0} Exclusions in active scope)
          </span>
        </div>
      </div>

      {/* Main Grid: Input Form vs Output Audit */}
      <div className="mt-6 space-y-6">
        {/* Input Box */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
              1. Client Message or Change Request
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#64748B]">Example:</span>
              <button
                type="button"
                onClick={() =>
                  setClientMessage(
                    "Hey! Can we quickly add Dark Mode support across the portal, and also hook up an automated daily email digest to send reports every morning?"
                  )
                }
                className="rounded bg-slate-50 border border-[#E2E8F0] px-2 py-0.5 text-[11px] font-medium text-[#1E293B] hover:bg-slate-100"
              >
                Dark Mode & Email Digest
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            placeholder="Paste the email, Slack message, or meeting transcript where the client requested extra work..."
            className="mt-3 w-full rounded-md border border-[#E2E8F0] bg-white p-3 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
          />

          {analysisError && (
            <div className="mt-3 flex items-center space-x-2 rounded-md bg-red-50 p-2.5 text-xs text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-[#64748B]">
              Analyzed with Gemma 4 open-weight model
            </span>

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#115E59] disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Auditing with Gemma 4...</span>
                </>
              ) : (
                <>
                  <GitCompare className="h-3.5 w-3.5" />
                  <span>Audit Scope Change</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Results View */}
        {currentAnalysis && (
          <div className="space-y-6">
            {/* Summary Banner */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-[#F0FDFA] px-2 py-0.5 text-[11px] font-semibold text-[#0F766E]">
                  Audit Summary
                </span>
                <span className="font-mono text-xs text-[#64748B]">
                  {new Date(currentAnalysis.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-bold text-[#1E293B]">
                {currentAnalysis.requestSummary}
              </h3>
              <p className="mt-1 text-xs text-[#64748B]">
                {currentAnalysis.changeRequestSummary}
              </p>
            </div>

            {/* Categorized Item Breakdown */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
                  2. Scope Classification
                </h3>
                <span className="text-[11px] text-[#64748B]">
                  Override classification if needed
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {currentAnalysis.items.map((item) => {
                  const effectiveClass = item.userOverride || item.classification;
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[#E2E8F0] bg-white p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          {effectiveClass === 'likely_included' && (
                            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                              Likely Included
                            </span>
                          )}
                          {effectiveClass === 'potential_scope_change' && (
                            <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                              Scope Change
                            </span>
                          )}
                          {effectiveClass === 'needs_clarification' && (
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                              Needs Clarification
                            </span>
                          )}
                          <h4 className="font-semibold text-xs text-[#1E293B]">{item.title}</h4>
                        </div>

                        {/* Override buttons */}
                        <div className="flex items-center space-x-1 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleOverrideClassification(item.id, 'likely_included')}
                            className={`rounded px-2 py-0.5 text-[10px] font-medium transition ${
                              effectiveClass === 'likely_included'
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            Included
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOverrideClassification(item.id, 'potential_scope_change')}
                            className={`rounded px-2 py-0.5 text-[10px] font-medium transition ${
                              effectiveClass === 'potential_scope_change'
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            Scope Change
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOverrideClassification(item.id, 'needs_clarification')}
                            className={`rounded px-2 py-0.5 text-[10px] font-medium transition ${
                              effectiveClass === 'needs_clarification'
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            Clarification
                          </button>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div className="mt-2.5 text-xs space-y-1">
                        <p className="text-[11px] text-[#64748B]">
                          <strong className="text-[#1E293B]">Referenced Baseline:</strong> {item.originalReference}
                        </p>
                        <p className="text-[#1E293B] text-xs leading-relaxed">{item.reasoning}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#64748B] pt-2 border-t border-slate-100">
                          {item.estimatedHoursImpact !== undefined && (
                            <span className="font-mono">Effort Impact: ~{item.estimatedHoursImpact} hrs</span>
                          )}
                          {item.estimatedTimelineImpact && (
                            <span>Timeline Impact: {item.estimatedTimelineImpact}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clarification questions */}
              {currentAnalysis.clarificationQuestionsToAsk?.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 text-xs">
                  <h4 className="font-semibold text-amber-900 flex items-center space-x-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-700" />
                    <span>Clarification Questions to Ask Client:</span>
                  </h4>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-amber-950/80 text-[11px]">
                    {currentAnalysis.clarificationQuestionsToAsk.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Suggested Extra Line Items */}
            {currentAnalysis.suggestedExtraLineItems &&
              currentAnalysis.suggestedExtraLineItems.length > 0 && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
                        3. Suggested Additional Line Items
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Attach priced extras directly to your project's quote calculator
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddExtraItemsToQuote}
                      className="flex items-center space-x-1.5 rounded-lg bg-[#0F766E] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#115E59]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Extra Items to Quote</span>
                    </button>
                  </div>

                  {addedItemsNotice && (
                    <div className="mt-3 flex items-center justify-between rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                      <div className="flex items-center space-x-1.5">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Extra line items added to project quote!</span>
                      </div>
                      <button
                        onClick={() => onOpenQuoteEditor(currentProject)}
                        className="font-bold underline"
                      >
                        Open Quote
                      </button>
                    </div>
                  )}

                  <div className="mt-3 divide-y divide-[#E2E8F0] text-xs">
                    {currentAnalysis.suggestedExtraLineItems.map((extra, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[#1E293B]">{extra.title}</span>
                          <p className="text-[11px] text-[#64748B]">{extra.description}</p>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[#64748B]">{extra.quantity} hrs × {extra.unitRate} = </span>
                          <span className="font-bold text-[#1E293B]">
                            {formatCurrency(extra.quantity * extra.unitRate, currentProject.quoteConfig.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Client Response Email Draft */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
                    4. Professional Client Response Draft
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Diplomatic message explaining scope boundaries and clear options
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="flex items-center space-x-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] hover:bg-slate-50"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#64748B]" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={8}
                value={currentAnalysis.clientMessageDraft}
                onChange={(e) => {
                  const updated: ScopeChangeAnalysis = {
                    ...currentAnalysis,
                    clientMessageDraft: e.target.value,
                  };
                  setCurrentAnalysis(updated);
                  if (currentProject) {
                    const nextAnalyses = currentProject.scopeAnalyses.map((a) =>
                      a.id === updated.id ? updated : a
                    );
                    onUpdateProject({ ...currentProject, scopeAnalyses: nextAnalyses });
                  }
                }}
                className="mt-3 w-full rounded-md border border-[#E2E8F0] bg-slate-50 p-3 text-xs leading-relaxed text-[#1E293B] focus:border-[#0F766E] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
