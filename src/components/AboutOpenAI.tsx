import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Lock,
  HardDrive,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCode2,
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
      <div className="border-b border-[#E5E0D5] pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#21473A]">
          <span>OPEN INNOVATION & ETHICS</span>
          <span>•</span>
          <span>TRANSPARENCY REPORT</span>
        </div>
        <h1 className="mt-2 font-editorial text-3xl font-bold text-[#21473A] sm:text-4xl">
          Open-Weight AI & Privacy Architecture
        </h1>
        <p className="mt-2 text-sm text-[#1F2923]/70 sm:text-base">
          ScopeMate is engineered with open innovation principles. Here is an honest,
          transparent explanation of the model, data flows, and storage mechanisms.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Card 1: Open-Weight Model Architecture */}
        <div className="rounded-xl border border-[#21473A]/20 bg-white p-6 shadow-2xs">
          <div className="flex items-start space-x-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#21473A]/10 text-[#21473A]">
              <Cpu className="h-5 w-5 text-[#21473A]" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#21473A]">
                Powered by Google Gemma 4 (Open-Weight Model)
              </h2>
              <p className="mt-0.5 text-xs font-mono text-[#21473A]/80">
                Active Identifier: <span className="font-bold">gemma-4-26b-a4b-it</span>
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#1F2923]/80">
            <p>
              Unlike closed black-box models, <strong>Gemma</strong> is an open-weight family of models
              built from the same research and technology used to create Gemini. Published with open model
              weights and responsible AI licenses, Gemma gives developers inspection capabilities, research
              transparency, and deployment flexibility.
            </p>

            <div className="rounded-lg border border-[#E5E0D5] bg-[#F7F5EF] p-4">
              <h4 className="font-semibold text-[#21473A] mb-2">Why Open-Weight Models Matter for Freelancers:</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Vendor Lock-in Immunity:</strong> Freelancers and agencies are not trapped in a
                  proprietary provider ecosystem where pricing can double overnight or terms arbitrarily change.
                </li>
                <li>
                  <strong>Inspectable & Auditable:</strong> The architecture and published safety evaluations
                  can be audited by independent engineers rather than trusting opaque enterprise marketing.
                </li>
                <li>
                  <strong>Portability:</strong> Workflows and prompts tuned for Gemma 4 can be migrated to private
                  servers, on-premise GPU clusters, or specialized inference backends (e.g., vLLM, Ollama, TensorRT-LLM)
                  without rewriting application business logic.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card 2: Inference & Data Transfer Reality */}
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-6 shadow-2xs">
          <div className="flex items-start space-x-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E9795C]/15 text-[#E9795C]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#21473A]">
                Inference Protocol & Privacy Boundaries
              </h2>
              <p className="mt-0.5 text-xs text-[#1F2923]/60">
                Hosted API inference disclosure (No false "local-only" claims)
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#1F2923]/80">
            <p>
              <strong>Hosted API Inference:</strong> In this deployment, Gemma 4 is hosted via Google AI Studio’s
              server-side runtime. Inference requires active internet connectivity. When you click "Generate Proposal"
              or "Audit Scope Change", the text of your client brief is securely transmitted over TLS from the ScopeMate
              Node.js backend to the hosted Gemma inference endpoint.
            </p>

            <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3.5 text-amber-900">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <span>Client Confidentiality Best Practice</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                We strongly advise freelancers to anonymize proprietary credentials. <strong>Never</strong> paste
                passwords, database connection strings, live payment tokens, sensitive HIPAA/GDPR personal records,
                or legally confidential NDAs into the brief input fields.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Local Storage & Data Retention */}
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-6 shadow-2xs">
          <div className="flex items-start space-x-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#21473A]/10 text-[#21473A]">
              <HardDrive className="h-5 w-5 text-[#21473A]" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#21473A]">
                Client-Side Storage & Zero Tracking
              </h2>
              <p className="mt-0.5 text-xs text-[#1F2923]/60">
                You own your project data • No ad trackers or cloud user accounts
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#1F2923]/80">
            <p>
              All saved proposals, customized quotes, line items, and scope change audits are stored
              strictly in your browser’s <strong>localStorage</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded border border-[#E5E0D5] p-3 bg-[#F7F5EF]/40">
                <span className="font-semibold text-[#21473A] block">Zero Telemetry or Ad Pixels</span>
                <p className="mt-0.5 text-[#1F2923]/70 text-[11px]">
                  ScopeMate does not embed Google Analytics, Facebook Pixel, Hotjar, or advertising cookies.
                </p>
              </div>

              <div className="rounded border border-[#E5E0D5] p-3 bg-[#F7F5EF]/40">
                <span className="font-semibold text-[#21473A] block">Deterministic Calculations</span>
                <p className="mt-0.5 text-[#1F2923]/70 text-[11px]">
                  Quote subtotals, contingency, and discounts are computed strictly in TypeScript arithmetic,
                  never by model hallucination.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#E5E0D5] pt-4">
              <div>
                <span className="font-semibold text-[#21473A]">
                  Currently Stored Projects: {savedCount}
                </span>
                <p className="text-[11px] text-[#1F2923]/60">
                  Purging will delete all locally saved proposals and change audits from this browser.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={savedCount === 0}
                className="flex items-center space-x-1.5 rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{cleared ? 'Cleared!' : 'Purge All Local ScopeMate Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
