import React, { useState } from 'react';
import {
  FileText,
  GitCompare,
  FolderKanban,
  ShieldCheck,
  Plus,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'New Proposal', icon: Plus },
    { id: 'scope_change', label: 'Scope Change', icon: GitCompare },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'about', label: 'AI & Privacy', icon: ShieldCheck },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    if (tab === 'builder') {
      onNewProposal();
    } else {
      setActiveTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center space-x-2.5 text-left focus:outline-none"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0F766E] text-white">
              <span className="text-sm font-bold tracking-tight">S</span>
            </div>
            <span className="text-base font-bold tracking-tight text-[#1E293B]">
              ScopeMate
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center space-x-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F0FDFA] text-[#0F766E]'
                      : 'text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                  {item.id === 'projects' && savedCount > 0 && (
                    <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-[#64748B]">
                      {savedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadSample}
            className="hidden text-xs font-medium text-[#64748B] hover:text-[#0F766E] sm:inline-block"
          >
            Try sample
          </button>

          <button
            onClick={onNewProposal}
            className="flex items-center space-x-1.5 rounded-md bg-[#0F766E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#115E59]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Proposal</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-[#1E293B]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E2E8F0] bg-white px-4 py-3 md:hidden">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#F0FDFA] text-[#0F766E]'
                      : 'text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'projects' && savedCount > 0 && (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-[#64748B]">
                      {savedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 border-t border-[#E2E8F0] pt-2">
            <button
              onClick={() => {
                onLoadSample();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F766E]"
            >
              Try sample project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
