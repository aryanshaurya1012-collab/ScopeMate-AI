import React, { useState } from 'react';
import {
  SavedProject,
  ScopeChangeAnalysis,
  ScopeChangeItem,
  ScopeClassification,
  QuoteLineItem,
} from '../types/index.ts';
import { formatCurrency } from '../utils/calculator.ts';
import {
  GitCompare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Clock,
  Send,
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

  const handleApplyPresetMessage = (msg: string) => {
    setClientMessage(msg);
  };

  if (!currentProject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DCE7DC]">
          <GitCompare className="h-6 w-6 text-[#21473A]" />
        </div>
        <h2 className="mt-4 font-editorial text-2xl font-bold text-[#21473A]">
          No Active Project to Compare Against
        </h2>
        <p className="mt-2 text-sm text-[#1F2923]/70">
          To run a scope change audit, you need an agreed project scope. Create a new proposal or explore the AeroPay sample project first.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="border-b border-[#E5E0D5] pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#21473A]">
          <span>SIGNATURE FEATURE</span>
          <span>•</span>
          <span>SCOPE CHANGE ANALYZER</span>
        </div>
        <h1 className="mt-2 font-editorial text-3xl font-bold text-[#21473A] sm:text-4xl">
          Evaluate New Requests Against Approved Scope
        </h1>
        <p className="mt-2 text-sm text-[#1F2923]/70 sm:text-base">
          Client asked for “just a quick addition”? Paste their email or Slack message. Gemma 4 cross-references
          it against your original deliverables and exclusions to classify what’s included, what’s extra,
          and draft a polite, diplomatic response.
        </p>

        {/* Project Selector Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-[#1F2923]">Compare against Project:</span>
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
            className="rounded-md border border-[#E5E0D5] bg-white px-3 py-1.5 text-xs font-medium text-[#21473A] shadow-2xs focus:border-[#21473A] focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brief.projectName} {p.isSample ? '(Sample)' : ''}
              </option>
            ))}
          </select>

          <span className="text-xs text-[#1F2923]/50">
            ({currentProject.proposal.deliverables?.length || 0} Deliverables,{' '}
            {currentProject.proposal.explicitExclusions?.length || 0} Exclusions in active baseline)
          </span>
        </div>
      </div>

      {/* Main Grid: Input Form vs Output Audit */}
      <div className="mt-6 space-y-8">
        {/* Input Box */}
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-lg font-bold text-[#21473A]">
              1. Paste Client's Request
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#1F2923]/60">Preset Scenarios:</span>
              <button
                type="button"
                onClick={() =>
                  handleApplyPresetMessage(
                    "Hey! Can we quickly add Dark Mode support across the portal, and also hook up an automated daily email digest to send reports every morning?"
                  )
                }
                className="rounded bg-[#F7F5EF] px-2 py-0.5 text-[11px] font-medium text-[#21473A] hover:bg-[#DCE7DC]"
              >
                Dark Mode & Email Digest
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPresetMessage(
                    "Could we fix the alignment on the invoice download button, and also could you build a complete multi-tenant role permission system with 5 different admin levels before next Wednesday?"
                  )
                }
                className="rounded bg-[#F7F5EF] px-2 py-0.5 text-[11px] font-medium text-[#21473A] hover:bg-[#DCE7DC]"
              >
                Minor Tweak vs Multi-Tenant Roles
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            placeholder="Paste the email, Slack message, or meeting transcript where the client requested extra work..."
            className="mt-3 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 p-3 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
          />

          {analysisError && (
            <div className="mt-3 flex items-center space-x-2 rounded-md bg-red-50 p-2.5 text-xs text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-[#1F2923]/60">
              Analyzed with Google Gemma 4 open-weight model
            </span>

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 rounded-lg bg-[#21473A] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#18362C] disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Auditing with Gemma 4...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-[#E9795C]" />
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
            <div className="rounded-xl border border-[#21473A]/20 bg-[#F7F5EF] p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="rounded bg-[#21473A] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                    Scope Audit Completed
                  </span>
                  <span className="font-mono text-xs text-[#1F2923]/60">
                    {new Date(currentAnalysis.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {currentAnalysis.modelUsed && (
                  <span className="rounded border border-[#21473A]/20 bg-white px-2 py-0.5 text-[11px] font-medium text-[#21473A]">
                    {currentAnalysis.modelUsed}
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-editorial text-xl font-bold text-[#21473A]">
                {currentAnalysis.requestSummary}
              </h3>
              <p className="mt-1 text-xs text-[#1F2923]/75">
                {currentAnalysis.changeRequestSummary}
              </p>
            </div>

            {/* Categorized Item Breakdown */}
            <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-lg font-bold text-[#21473A]">
                  2. Item-by-Item Scope Classification
                </h3>
                <span className="text-xs text-[#1F2923]/60">
                  Click badges to override classification
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {currentAnalysis.items.map((item) => {
                  const effectiveClass = item.userOverride || item.classification;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-4 transition ${
                        effectiveClass === 'likely_included'
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : effectiveClass === 'potential_scope_change'
                          ? 'border-[#E9795C]/40 bg-[#E9795C]/5'
                          : 'border-amber-200 bg-amber-50/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          {effectiveClass === 'likely_included' && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          )}
                          {effectiveClass === 'potential_scope_change' && (
                            <AlertTriangle className="h-4 w-4 text-[#E9795C] shrink-0" />
                          )}
                          {effectiveClass === 'needs_clarification' && (
                            <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                          )}
                          <h4 className="font-semibold text-sm text-[#21473A]">{item.title}</h4>
                        </div>

                        {/* Interactive override selector */}
                        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() =>
                              handleOverrideClassification(item.id, 'likely_included')
                            }
                            className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                              effectiveClass === 'likely_included'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            Likely Included
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleOverrideClassification(item.id, 'potential_scope_change')
                            }
                            className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                              effectiveClass === 'potential_scope_change'
                                ? 'bg-[#E9795C] text-white'
                                : 'bg-white border border-[#E9795C]/40 text-[#E9795C] hover:bg-red-50'
                            }`}
                          >
                            Scope Change
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleOverrideClassification(item.id, 'needs_clarification')
                            }
                            className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                              effectiveClass === 'needs_clarification'
                                ? 'bg-amber-600 text-white'
                                : 'bg-white border border-amber-300 text-amber-700 hover:bg-amber-50'
                            }`}
                          >
                            Clarification
                          </button>
                        </div>
                      </div>

                      {/* Reference and Reasoning */}
                      <div className="mt-3 text-xs space-y-1.5">
                        <div className="flex items-baseline space-x-1 text-[#1F2923]/60">
                          <span className="font-semibold text-[#21473A]">Referenced Baseline:</span>
                          <span>{item.originalReference}</span>
                        </div>
                        <p className="text-[#1F2923]/80 leading-relaxed">{item.reasoning}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#1F2923]/70 pt-1 border-t border-[#E5E0D5]/60">
                          {item.estimatedHoursImpact !== undefined && (
                            <div className="flex items-center space-x-1 font-mono">
                              <Clock className="h-3 w-3 text-[#21473A]" />
                              <span>Effort Impact: ~{item.estimatedHoursImpact} hrs</span>
                            </div>
                          )}
                          {item.estimatedTimelineImpact && (
                            <div className="flex items-center space-x-1">
                              <span className="font-semibold text-[#21473A]">Timeline Impact:</span>
                              <span>{item.estimatedTimelineImpact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clarification questions to ask */}
              {currentAnalysis.clarificationQuestionsToAsk?.length > 0 && (
                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/40 p-4 text-xs">
                  <h4 className="font-semibold text-amber-900 flex items-center space-x-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-700" />
                    <span>Questions Freelancer Should Ask Before Committing:</span>
                  </h4>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-amber-950/80">
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
                <div className="rounded-xl border border-[#21473A]/20 bg-white p-5 shadow-2xs sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-editorial text-lg font-bold text-[#21473A]">
                        3. Suggested Additional Line Items
                      </h3>
                      <p className="text-xs text-[#1F2923]/70">
                        Priced extras you can attach directly to your project's quote calculator
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddExtraItemsToQuote}
                      className="flex items-center space-x-1.5 rounded-lg bg-[#21473A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#18362C]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Extra Items to Project Quote</span>
                    </button>
                  </div>

                  {addedItemsNotice && (
                    <div className="mt-3 flex items-center justify-between rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                      <div className="flex items-center space-x-1.5">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Extra items added to quote! Open Quote Calculator to view recalculations.</span>
                      </div>
                      <button
                        onClick={() => onOpenQuoteEditor(currentProject)}
                        className="font-bold underline"
                      >
                        Open Quote
                      </button>
                    </div>
                  )}

                  <div className="mt-4 divide-y divide-[#E5E0D5] text-xs">
                    {currentAnalysis.suggestedExtraLineItems.map((extra, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[#21473A]">{extra.title}</span>
                          <p className="text-[11px] text-[#1F2923]/60">{extra.description}</p>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[#1F2923]/70">{extra.quantity} hrs × {extra.unitRate} = </span>
                          <span className="font-bold text-[#21473A]">
                            {formatCurrency(extra.quantity * extra.unitRate, currentProject.quoteConfig.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Diplomatic Client Email Draft */}
            <div className="rounded-xl border border-[#21473A]/25 bg-white p-5 shadow-2xs sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#21473A]">
                    4. Professional Client Response Message Draft
                  </h3>
                  <p className="text-xs text-[#1F2923]/70">
                    Diplomatic, respectful, and firm response protecting boundaries and offering clear options
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="flex items-center space-x-1.5 rounded-md border border-[#21473A]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#21473A] hover:bg-[#DCE7DC]/40"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={9}
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
                className="mt-3 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/30 p-3 font-sans text-xs leading-relaxed text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
