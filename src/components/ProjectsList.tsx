import React, { useState } from 'react';
import { SavedProject } from '../types/index.ts';
import { calculateQuoteTotals, formatCurrency } from '../utils/calculator.ts';
import { exportProjectsJson } from '../utils/storage.ts';
import {
  FolderKanban,
  Search,
  Plus,
  GitCompare,
  Trash2,
  Download,
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
      <div className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
            My Projects & Scopes
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Stored locally in browser localStorage ({projects.length} saved)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadBackup}
            disabled={projects.length === 0}
            className="flex items-center space-x-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#1E293B] shadow-2xs hover:bg-slate-50 disabled:opacity-40"
            title="Download JSON backup of all projects"
          >
            <Download className="h-3.5 w-3.5 text-[#64748B]" />
            <span>Export Backup</span>
          </button>

          {confirmClear ? (
            <div className="flex items-center space-x-1 rounded-md border border-red-200 bg-red-50 p-1">
              <span className="text-[11px] font-medium text-red-700 px-1">Erase all?</span>
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
                className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-[#1E293B]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={projects.length === 0}
              className="flex items-center space-x-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#64748B] hover:text-red-700 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Data</span>
            </button>
          )}

          <button
            onClick={onNewProposal}
            className="flex items-center space-x-1.5 rounded-md bg-[#0F766E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#115E59]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Proposal</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-5 flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-2xs">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by project name, client, or discipline..."
          className="ml-2 w-full text-xs text-[#1E293B] focus:outline-none placeholder-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-[#1E293B]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[#64748B]">
            <FolderKanban className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-[#1E293B]">
            {searchTerm ? 'No matching projects found' : 'No projects saved yet'}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-[#64748B]">
            {searchTerm
              ? `No saved projects matched "${searchTerm}". Clear the filter to view all.`
              : 'Create your first project scope, or load the sample to explore ScopeMate.'}
          </p>

          {!searchTerm && (
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
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredProjects.map((proj) => {
            const totals = calculateQuoteTotals(proj.quoteItems || [], proj.quoteConfig);
            return (
              <div
                key={proj.id}
                className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-2xs transition hover:border-[#CBD5E1] sm:flex-row sm:items-center"
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
                    <span>Updated {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}</span>
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
                      Open Scope
                    </button>

                    <button
                      onClick={() => onOpenScopeChange(proj)}
                      className="rounded-md bg-[#F0FDFA] px-2.5 py-1 text-xs font-medium text-[#0F766E] hover:bg-[#CCFBF1]"
                      title="Analyze scope change"
                    >
                      <GitCompare className="h-3.5 w-3.5 inline mr-1" />
                      Audit
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
  );
};
