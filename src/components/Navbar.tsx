import React from 'react';
import { FileText, GitCompare, FolderKanban, ShieldCheck, Plus, Sparkles } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'builder' | 'editor' | 'scope_change' | 'projects' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  onNewProposal: () => void;
  onLoadSample: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onNewProposal,
  onLoadSample,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E0D5] bg-[#F7F5EF]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#21473A] text-white shadow-sm">
              <span className="font-editorial text-xl font-bold tracking-tight">S</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#21473A]">
                  ScopeMate
                </span>
                <span className="hidden rounded border border-[#21473A]/20 bg-[#DCE7DC]/60 px-1.5 py-0.5 text-[10px] font-semibold text-[#21473A] sm:inline-block">
                  Gemma 4
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#1F2923]/60">Freelance Scope & Quote Engine</p>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden items-center space-x-1 md:flex">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#21473A] text-[#F7F5EF]'
                : 'text-[#1F2923]/80 hover:bg-[#E5E0D5]/50 hover:text-[#1F2923]'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={onNewProposal}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'builder'
                ? 'bg-[#21473A] text-[#F7F5EF]'
                : 'text-[#1F2923]/80 hover:bg-[#E5E0D5]/50 hover:text-[#1F2923]'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>New Proposal</span>
          </button>

          <button
            onClick={() => setActiveTab('scope_change')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'scope_change'
                ? 'bg-[#21473A] text-[#F7F5EF]'
                : 'text-[#1F2923]/80 hover:bg-[#E5E0D5]/50 hover:text-[#1F2923]'
            }`}
          >
            <GitCompare className="h-4 w-4" />
            <span>Scope Change</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-[#21473A] text-[#F7F5EF]'
                : 'text-[#1F2923]/80 hover:bg-[#E5E0D5]/50 hover:text-[#1F2923]'
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            <span>My Projects</span>
            {savedCount > 0 && (
              <span className="rounded-full bg-[#DCE7DC] px-1.5 py-0.2 text-[10px] font-semibold text-[#21473A]">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-[#21473A] text-[#F7F5EF]'
                : 'text-[#1F2923]/80 hover:bg-[#E5E0D5]/50 hover:text-[#1F2923]'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Open AI & Privacy</span>
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1.5 rounded-md border border-[#21473A]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#21473A] shadow-xs hover:bg-[#DCE7DC]/40"
            title="Load sample AeroPay project"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#E9795C]" />
            <span className="hidden sm:inline">Try Sample Project</span>
            <span className="sm:hidden">Sample</span>
          </button>

          <button
            onClick={onNewProposal}
            className="flex items-center space-x-1.5 rounded-md bg-[#21473A] px-3.5 py-1.5 text-xs font-semibold text-[#F7F5EF] shadow-xs hover:bg-[#18362C]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Scope</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="flex overflow-x-auto border-t border-[#E5E0D5] px-2 py-1.5 md:hidden">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'dashboard' ? 'bg-[#21473A] text-white' : 'text-[#1F2923]/80'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={onNewProposal}
          className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'builder' ? 'bg-[#21473A] text-white' : 'text-[#1F2923]/80'
          }`}
        >
          New Scope
        </button>
        <button
          onClick={() => setActiveTab('scope_change')}
          className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'scope_change' ? 'bg-[#21473A] text-white' : 'text-[#1F2923]/80'
          }`}
        >
          Scope Change
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'projects' ? 'bg-[#21473A] text-white' : 'text-[#1F2923]/80'
          }`}
        >
          Projects ({savedCount})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'about' ? 'bg-[#21473A] text-white' : 'text-[#1F2923]/80'
          }`}
        >
          Privacy & AI
        </button>
      </div>
    </header>
  );
};
