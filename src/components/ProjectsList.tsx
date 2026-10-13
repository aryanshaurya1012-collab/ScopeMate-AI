import React, { useState } from 'react';
import { SavedProject } from '../types/index.ts';
import { calculateQuoteTotals, formatCurrency } from '../utils/calculator.ts';
import { exportProjectsJson } from '../utils/storage.ts';
import {
  FolderKanban,
  Search,
  Plus,
  ArrowRight,
  GitCompare,
  Trash2,
  Download,
  AlertTriangle,
  Sparkles,
  FileText,
} from 'lucide-react';

interface ProjectsListProps {
  projects: SavedProject[];
  onOpenProject: (project: SavedProject) => void;
  onOpenScopeChange: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onClearAll: () => void;
  onNewProposal: () => void;
  onLoadSample: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onOpenProject,
  onOpenScopeChange,
  onDeleteProject,
  onClearAll,
  onNewProposal,
  onLoadSample,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const filteredProjects = projects.filter((p) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = p.brief.projectName.toLowerCase().includes(q);
    const clientMatch = (p.brief.clientName || '').toLowerCase().includes(q);
    const serviceMatch = p.brief.serviceType.toLowerCase().includes(q);
    return nameMatch || clientMatch || serviceMatch;
  });

  const handleDownloadBackup = () => {
    const jsonStr = exportProjectsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scopemate-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5E0D5] pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-[#21473A] sm:text-4xl">
            My Projects & Scopes
          </h1>
          <p className="mt-1 text-sm text-[#1F2923]/70">
            Stored locally in your browser’s localStorage • Total: {projects.length}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadBackup}
            disabled={projects.length === 0}
            className="flex items-center space-x-1.5 rounded-md border border-[#21473A]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#21473A] shadow-2xs hover:bg-[#DCE7DC]/40 disabled:opacity-40"
            title="Download JSON backup of all projects"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Backup</span>
          </button>

          {confirmClear ? (
            <div className="flex items-center space-x-1 rounded-md border border-red-200 bg-red-50 p-1">
              <span className="text-[11px] font-semibold text-red-700 px-1">Erase all?</span>
              <button
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-red-700"
              >
                Yes, Purge
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1F2923]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={projects.length === 0}
              className="flex items-center space-x-1.5 rounded-md border border-[#E5E0D5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2923]/70 hover:border-red-300 hover:text-red-700 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Local Data</span>
            </button>
          )}

          <button
            onClick={onNewProposal}
            className="flex items-center space-x-1.5 rounded-md bg-[#21473A] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#18362C]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Scope</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex items-center rounded-lg border border-[#E5E0D5] bg-white px-3 py-2 shadow-2xs">
        <Search className="h-4 w-4 text-[#1F2923]/40" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by project name, client, or discipline..."
          className="ml-2 w-full text-xs text-[#1F2923] focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-[#1F2923]/40 hover:text-[#1F2923]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Projects List Grid */}
      {filteredProjects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-[#21473A]/25 bg-white/70 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DCE7DC]">
            <FolderKanban className="h-6 w-6 text-[#21473A]" />
          </div>
          <h3 className="mt-4 font-editorial text-xl font-bold text-[#21473A]">
            {searchTerm ? 'No matching projects found' : 'No projects stored yet'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs text-[#1F2923]/70">
            {searchTerm
              ? `No saved projects matched "${searchTerm}". Try a different term or clear the filter.`
              : 'Create your first project scope, or load the AeroPay sample to test out features.'}
          </p>

          {!searchTerm && (
            <div className="mt-6 flex justify-center space-x-3">
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
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((proj) => {
            const totals = calculateQuoteTotals(proj.quoteItems || [], proj.quoteConfig);
            return (
              <div
                key={proj.id}
                className="flex flex-col justify-between rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs hover:border-[#21473A]/40 hover:shadow-xs transition"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="rounded bg-[#DCE7DC] px-2 py-0.5 text-[11px] font-semibold text-[#21473A]">
                        {proj.brief.serviceType.replace('_', ' ').toUpperCase()}
                      </span>
                      {proj.isSample && (
                        <span className="rounded bg-[#E9795C]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#E9795C]">
                          Sample
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-[#1F2923]/50">
                      {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mt-3 font-editorial text-lg font-bold text-[#21473A]">
                    {proj.brief.projectName}
                  </h3>
                  {proj.brief.clientName && (
                    <p className="text-xs text-[#1F2923]/70">{proj.brief.clientName}</p>
                  )}

                  <p className="mt-2 text-xs text-[#1F2923]/70 line-clamp-2">
                    {proj.proposal.projectSummary}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E5E0D5]/70 pt-2.5 text-xs">
                    <span className="text-[#1F2923]/60">Calculated Quote:</span>
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
                    <span>Open Scope</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onOpenScopeChange(proj)}
                      className="flex items-center space-x-1 rounded bg-[#DCE7DC]/60 px-2 py-1 text-[11px] font-semibold text-[#21473A] hover:bg-[#DCE7DC]"
                      title="Analyze scope change for this project"
                    >
                      <GitCompare className="h-3 w-3" />
                      <span>Audit</span>
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
  );
};
