import React, { useState } from 'react';
import {
  Cpu,
  Lock,
  HardDrive,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface AboutOpenAIProps {
  onClearAll: () => void;
  savedCount: number;
}

export const AboutOpenAI: React.FC<AboutOpenAIProps> = ({ onClearAll, savedCount }) => {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    onClearAll();
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
          AI Integration & Privacy Architecture
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Information regarding model architecture, data flows, and local storage retention.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Card 1: Open-Weight Model */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F0FDFA] text-[#0F766E]">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Google Gemma 4 Integration
              </h2>
              <p className="mt-0.5 text-xs font-mono text-[#64748B]">
                Configured Model Identifier: <span className="font-semibold text-[#1E293B]">gemma-4-26b-a4b-it</span>
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#64748B]">
            <p>
              ScopeMate uses Google's open-weight <strong>Gemma 4</strong> model to interpret client briefs,
              propose deliverables, formulate acceptance criteria, and evaluate scope change requests.
            </p>

            <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 p-4">
              <h4 className="font-semibold text-[#1E293B] mb-2">Why Open-Weight Models for Freelancers:</h4>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Portability:</strong> Workflows and prompt structures engineered for Gemma can be hosted
                  on private servers or self-hosted GPU clusters without redesigning business logic.
                </li>
                <li>
                  <strong>Auditability:</strong> Open weights and published safety benchmarks provide transparency
                  compared to closed black-box models.
                </li>
                <li>
                  <strong>Independence:</strong> Mitigates reliance on proprietary model pricing structures.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card 2: Hosted Inference & Data Privacy */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Inference Protocol & Privacy Boundaries
              </h2>
              <p className="mt-0.5 text-xs text-[#64748B]">
                Hosted API inference disclosure (Requires internet connectivity)
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#64748B]">
            <p>
              <strong>Hosted API Inference:</strong> In this deployment, Gemma 4 is hosted via Google AI Studio’s
              server-side runtime. Inference requires internet access. When you generate a proposal or audit a scope
              change, submitted brief text is transmitted securely over TLS from ScopeMate’s Node.js backend to the
              model provider endpoint.
            </p>

            <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3.5 text-amber-900">
              <div className="flex items-center space-x-1.5 font-semibold text-xs">
                <AlertCircle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span>Client Confidentiality Best Practice</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
                Do not enter passwords, secret tokens, database credentials, live payment keys, or legally confidential
                materials into client brief input fields.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Local Storage */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F0FDFA] text-[#0F766E]">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Browser LocalStorage & Zero Tracking
              </h2>
              <p className="mt-0.5 text-xs text-[#64748B]">
                Proposals and quotes are saved strictly on your device
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#64748B]">
            <p>
              Saved scopes, quotes, and audit records are persisted in your browser’s <strong>localStorage</strong>.
              ScopeMate does not use tracking cookies, advertising analytics, or external user databases.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
              <div>
                <span className="font-semibold text-[#1E293B]">
                  Currently Stored Projects: {savedCount}
                </span>
                <p className="text-[11px] text-[#64748B]">
                  Clearing will purge all saved proposals and change audits from this browser.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={savedCount === 0}
                className="flex items-center space-x-1.5 rounded-lg border border-red-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{cleared ? 'Cleared!' : 'Purge All Local Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
