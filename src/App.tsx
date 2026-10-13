import React, { useState, useEffect } from 'react';
import { ClientBrief, SavedProject, QuoteConfig, QuoteLineItem } from './types/index.ts';
import { getSavedProjects, saveProject, deleteProject, clearAllProjects } from './utils/storage.ts';
import { SAMPLE_PROJECT } from './utils/sampleData.ts';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { BriefBuilder } from './components/BriefBuilder.tsx';
import { ProposalEditor } from './components/ProposalEditor.tsx';
import { ScopeChangeAnalyzer } from './components/ScopeChangeAnalyzer.tsx';
import { ProjectsList } from './components/ProjectsList.tsx';
import { AboutOpenAI } from './components/AboutOpenAI.tsx';
import { PrintDocument } from './components/PrintDocument.tsx';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [activeProject, setActiveProject] = useState<SavedProject | null>(null);
  const [isLoadingProposal, setIsLoadingProposal] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Initialize and load saved projects
  useEffect(() => {
    const saved = getSavedProjects();
    if (saved.length === 0) {
      saveProject(SAMPLE_PROJECT);
      setProjects([SAMPLE_PROJECT]);
      setActiveProject(SAMPLE_PROJECT);
    } else {
      setProjects(saved);
      setActiveProject(saved[0]);
    }
  }, []);

  const refreshProjects = () => {
    const list = getSavedProjects();
    setProjects(list);
  };

  const handleCreateProposalFromBrief = async (brief: ClientBrief) => {
    setIsLoadingProposal(true);
    setApiErrorMessage(null);

    try {
      const response = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.message || 'Server error while generating proposal with Gemma 4 model.'
        );
      }

      const proposal = data.proposal;

      // Deterministically create initial quote line items based on generated deliverables
      const initialQuoteItems: QuoteLineItem[] = (proposal.deliverables || []).map(
        (del: any, idx: number) => ({
          id: `line-${Date.now()}-${idx}`,
          title: del.title,
          description: del.description,
          quantity: del.estimatedHours || (brief.rateType === 'hourly' ? 10 : 1),
          unitRate:
            brief.rateType === 'hourly'
              ? brief.hourlyRate || 75
              : del.estimatedPrice || (brief.fixedBudget ? Math.round(brief.fixedBudget / (proposal.deliverables?.length || 1)) : 1000),
        })
      );

      const quoteConfig: QuoteConfig = {
        currency: brief.currency,
        rateType: brief.rateType,
        contingencyPercent: 10,
        discountType: 'percentage',
        discountValue: 0,
        taxPercent: 0,
        validityDays: 14,
        paymentSchedule: proposal.suggestedPaymentSchedule || [
          {
            id: 'pay-1',
            phase: 'Kickoff Deposit',
            percentage: 40,
            trigger: 'Due upon proposal approval',
          },
          {
            id: 'pay-2',
            phase: 'Interim Milestone',
            percentage: 30,
            trigger: 'Due upon milestone review',
          },
          {
            id: 'pay-3',
            phase: 'Final Delivery',
            percentage: 30,
            trigger: 'Due upon code handoff',
          },
        ],
        notes: `Estimate valid for 14 days. Includes ${brief.revisionRounds || 2} consolidated revision rounds. Taxes excluded.`,
      };

      const newProject: SavedProject = {
        id: `proj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        brief,
        proposal,
        quoteItems: initialQuoteItems,
        quoteConfig,
        scopeAnalyses: [],
      };

      saveProject(newProject);
      refreshProjects();
      setActiveProject(newProject);
      setActiveTab('editor');
    } catch (err: any) {
      console.error('Failed to generate proposal:', err);
      setApiErrorMessage(
        err.message || 'Failed to communicate with the Gemma 4 server endpoint.'
      );
    } finally {
      setIsLoadingProposal(false);
    }
  };

  const handleLoadSample = () => {
    saveProject(SAMPLE_PROJECT);
    refreshProjects();
    setActiveProject(SAMPLE_PROJECT);
    setActiveTab('editor');
  };

  const handleOpenProjectInEditor = (project: SavedProject) => {
    setActiveProject(project);
    setActiveTab('editor');
  };

  const handleOpenProjectInScopeChange = (project: SavedProject) => {
    setActiveProject(project);
    setActiveTab('scope_change');
  };

  const handleSaveProjectFromEditor = (updated: SavedProject) => {
    saveProject(updated);
    refreshProjects();
    setActiveProject(updated);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    refreshProjects();
    if (activeProject?.id === id) {
      const remaining = getSavedProjects();
      setActiveProject(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleClearAll = () => {
    clearAllProjects();
    setProjects([]);
    setActiveProject(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col justify-between selection:bg-[#F0FDFA] selection:text-[#0F766E]">
      {/* Top Navbar */}
      <div className="no-print">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={projects.length}
          onNewProposal={() => setActiveTab('builder')}
          onLoadSample={handleLoadSample}
        />

        {/* Global Error Notice */}
        {apiErrorMessage && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-2.5 sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{apiErrorMessage}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLoadSample}
                  className="rounded border border-red-300 bg-white px-2 py-0.5 text-xs font-medium text-red-800 hover:bg-red-50"
                >
                  Explore Sample
                </button>
                <button
                  onClick={() => setApiErrorMessage(null)}
                  className="text-red-500 hover:text-red-800 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard
            projects={projects}
            onNewProposal={() => setActiveTab('builder')}
            onOpenProject={handleOpenProjectInEditor}
            onOpenScopeChange={handleOpenProjectInScopeChange}
            onDeleteProject={handleDeleteProject}
            onLoadSample={handleLoadSample}
          />
        )}

        {activeTab === 'builder' && (
          <BriefBuilder
            onSubmit={handleCreateProposalFromBrief}
            isLoading={isLoadingProposal}
            onLoadSample={handleLoadSample}
          />
        )}

        {activeTab === 'editor' && activeProject && (
          <ProposalEditor
            project={activeProject}
            onSave={handleSaveProjectFromEditor}
            onOpenScopeChange={handleOpenProjectInScopeChange}
          />
        )}

        {activeTab === 'scope_change' && (
          <ScopeChangeAnalyzer
            projects={projects}
            activeProject={activeProject}
            onSelectProject={(p) => setActiveProject(p)}
            onUpdateProject={handleSaveProjectFromEditor}
            onOpenQuoteEditor={(p) => {
              setActiveProject(p);
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsList
            projects={projects}
            onOpenProject={handleOpenProjectInEditor}
            onOpenScopeChange={handleOpenProjectInScopeChange}
            onDeleteProject={handleDeleteProject}
            onClearAll={handleClearAll}
            onNewProposal={() => setActiveTab('builder')}
            onLoadSample={handleLoadSample}
          />
        )}

        {activeTab === 'about' && (
          <AboutOpenAI onClearAll={handleClearAll} savedCount={projects.length} />
        )}
      </main>

      {/* Hidden print element that receives print styles */}
      <div className="hidden print:block print:w-full print:m-0 print:p-0">
        {activeProject && <PrintDocument project={activeProject} />}
      </div>

      {/* Footer */}
      <footer className="no-print mt-12 border-t border-[#E2E8F0] bg-white py-6 text-xs text-[#64748B]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#1E293B]">ScopeMate</span>
            <span>•</span>
            <span>Scope & Quote Engine for Freelancers</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[11px] text-slate-400">Powered by open-weight Gemma 4</span>
            <button
              onClick={() => setActiveTab('about')}
              className="text-[#64748B] hover:text-[#0F766E] underline"
            >
              Privacy & AI Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
