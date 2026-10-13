import React, { useState } from 'react';
import { ClientBrief, Currency, RateType, ServiceType } from '../types/index.ts';
import {
  ArrowRight,
  Code2,
  Palette,
  PenTool,
  Film,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface BriefBuilderProps {
  onSubmit: (brief: ClientBrief) => Promise<void>;
  isLoading: boolean;
  onLoadSample: () => void;
}

export const BriefBuilder: React.FC<BriefBuilderProps> = ({
  onSubmit,
  isLoading,
  onLoadSample,
}) => {
  const [formData, setFormData] = useState<ClientBrief>({
    projectName: '',
    clientName: '',
    serviceType: 'web_development',
    clientBrief: '',
    desiredOutcome: '',
    expectedDeliverables: '',
    timeline: '',
    budgetKnown: false,
    budgetAmount: undefined,
    currency: 'USD',
    rateType: 'hourly',
    hourlyRate: 85,
    fixedBudget: 3500,
    availableHours: 40,
    revisionRounds: 2,
    constraintsAndExclusions: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.projectName.trim()) {
      nextErrors.projectName = 'Project name is required';
    }
    if (!formData.clientBrief.trim() || formData.clientBrief.trim().length < 20) {
      nextErrors.clientBrief = 'Please enter a client brief with at least 20 characters';
    }
    if (formData.rateType === 'hourly' && (!formData.hourlyRate || formData.hourlyRate <= 0)) {
      nextErrors.hourlyRate = 'Please provide a valid hourly rate';
    }
    if (formData.rateType === 'fixed' && (!formData.fixedBudget || formData.fixedBudget <= 0)) {
      nextErrors.fixedBudget = 'Please enter a target fixed budget';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleApplyPreset = (type: ServiceType) => {
    if (type === 'web_development') {
      setFormData({
        ...formData,
        serviceType: 'web_development',
        projectName: 'E-Commerce Storefront & Shopify Integration',
        clientName: 'Nordic Artisan Goods',
        clientBrief:
          'We want to build a headless Next.js / Shopify storefront for our handcrafted ceramics brand. Current WordPress site is sluggish and drops mobile conversions. We need product listing, faceted filters by glaze & clay type, cart drawer, direct Shopify checkout redirect, and an About Our Studio editorial page.',
        desiredOutcome: 'Sub-1-second page loads on mobile, 25% higher checkout completion rate.',
        expectedDeliverables: 'Production Next.js repository, Tailwind components, Shopify Storefront API bridge, mobile QA testing report.',
        timeline: '5 weeks',
        budgetKnown: true,
        budgetAmount: 5000,
        currency: 'USD',
        rateType: 'hourly',
        hourlyRate: 90,
        availableHours: 60,
        revisionRounds: 2,
        constraintsAndExclusions: 'Excludes backend Shopify product catalog data entry and ERP inventory synchronization.',
        additionalNotes: 'Explicitly exclude custom 3D webgl canvas model viewers for Phase 1.',
      });
    } else if (type === 'ui_ux_design') {
      setFormData({
        ...formData,
        serviceType: 'ui_ux_design',
        projectName: 'Logistics Field Technician Mobile App UI',
        clientName: 'FleetPulse Technologies',
        clientBrief:
          'Design an iOS & Android field technician mobile app in Figma. Fleet managers dispatch routes and technicians log vehicle diagnostics. Current interface has 12 nested screens with confusing icons. We need high-fidelity wireframes, interactive prototype, design token documentation, and asset export for engineers.',
        desiredOutcome: 'Intuitive 3-tap workflow for logging maintenance tickets in offline conditions.',
        expectedDeliverables: 'Figma design system, 24 component tokens, 18 high-fi screens, clickable prototype, developer inspection file.',
        timeline: '4 weeks',
        budgetKnown: true,
        budgetAmount: 4200,
        currency: 'EUR',
        rateType: 'fixed',
        fixedBudget: 4200,
        availableHours: 50,
        revisionRounds: 2,
        constraintsAndExclusions: 'Excludes React Native frontend code development and App Store marketing graphics.',
        additionalNotes: 'Requires WCAG AAA contrast ratio due to outdoor tablet usage in bright sunlight.',
      });
    } else if (type === 'content_writing') {
      setFormData({
        ...formData,
        serviceType: 'content_writing',
        projectName: 'Developer Documentation & API Guides',
        clientName: 'CloudMesh Infrastructure',
        clientBrief:
          'We are launching a new distributed vector database and need complete developer documentation: Quickstart tutorial in Python & TypeScript, 4 deep-dive architecture articles, and copy for the SDK developer landing page. We need high-accuracy technical writing with tested code snippets.',
        desiredOutcome: 'Reduce time-to-first-successful-query for new devs to under 5 minutes.',
        expectedDeliverables: 'Markdown documentation files, verified code examples, developer landing page copy doc, SEO meta descriptions.',
        timeline: '3 weeks',
        budgetKnown: false,
        budgetAmount: undefined,
        currency: 'USD',
        rateType: 'hourly',
        hourlyRate: 80,
        availableHours: 35,
        revisionRounds: 2,
        constraintsAndExclusions: 'Excludes ongoing monthly tech support or monitoring GitHub discussion forums.',
        additionalNotes: 'Client will provide dev environment sandbox credentials before Week 1.',
      });
    } else if (type === 'video_editing') {
      setFormData({
        ...formData,
        serviceType: 'video_editing',
        projectName: 'Product Launch Video & Social Teasers',
        clientName: 'Veloce AI Productivity',
        clientBrief:
          'We need a punchy 90-second product demo video for our upcoming product launch, plus three 15-second vertical cuts for social. Client provides raw screen recordings and voiceover audio. We need kinetic typography, clean sound design, pacing, custom zooms, and color correction.',
        desiredOutcome: 'Top product launch engagement with clear demonstration of workflow benefits.',
        expectedDeliverables: '1x 90s 4K master landscape video, 3x 15s 9:16 vertical reels, project source file archive.',
        timeline: '10 business days',
        budgetKnown: true,
        budgetAmount: 2200,
        currency: 'USD',
        rateType: 'fixed',
        fixedBudget: 2200,
        availableHours: 25,
        revisionRounds: 2,
        constraintsAndExclusions: 'Excludes hiring professional voice actors or filming live-action studio footage.',
        additionalNotes: 'Audio files will be delivered in 48kHz WAV format.',
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
          New Proposal & Scope Definition
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Enter the client's brief and commercial parameters. ScopeMate will formulate deliverables,
          acceptance criteria, and explicit exclusions using open-weight Gemma 4.
        </p>

        {/* Quick presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#64748B]">Fill example preset:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('web_development')}
            className="flex items-center space-x-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E293B] hover:bg-slate-50"
          >
            <Code2 className="h-3 w-3 text-[#0F766E]" />
            <span>Web Dev</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('ui_ux_design')}
            className="flex items-center space-x-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E293B] hover:bg-slate-50"
          >
            <Palette className="h-3 w-3 text-[#0F766E]" />
            <span>UI/UX Design</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('content_writing')}
            className="flex items-center space-x-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E293B] hover:bg-slate-50"
          >
            <PenTool className="h-3 w-3 text-[#0F766E]" />
            <span>Content</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('video_editing')}
            className="flex items-center space-x-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#1E293B] hover:bg-slate-50"
          >
            <Film className="h-3 w-3 text-[#0F766E]" />
            <span>Video</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Section 1: Project Details */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
            1. Project Identification
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Client Billing & Analytics Portal"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
              />
              {errors.projectName && (
                <p className="mt-1 text-xs text-red-600">{errors.projectName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">
                Client / Company Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AeroPay Financial Corp"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E293B]">Service Discipline</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-6">
                {[
                  { id: 'web_development', label: 'Web Dev' },
                  { id: 'ui_ux_design', label: 'UI/UX Design' },
                  { id: 'graphic_design', label: 'Graphic Design' },
                  { id: 'content_writing', label: 'Content' },
                  { id: 'video_editing', label: 'Video' },
                  { id: 'other', label: 'Other' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: item.id as ServiceType })}
                    className={`rounded-md border py-2 text-xs font-medium text-center transition ${
                      formData.serviceType === item.id
                        ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] font-semibold'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Brief & Requirements */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
            2. Client Request & Objectives
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#1E293B]">
                  Client's Original Brief or Notes <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#64748B]">Paste raw email, chat, or project notes</span>
              </div>
              <textarea
                rows={4}
                placeholder="Paste what the client wrote or describe what they asked for in their own words..."
                value={formData.clientBrief}
                onChange={(e) => setFormData({ ...formData, clientBrief: e.target.value })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white p-3 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
              />
              {errors.clientBrief && (
                <p className="mt-1 text-xs text-red-600">{errors.clientBrief}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B]">
                  Desired Outcome & Audience <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sub-1s mobile load time; reduce support tickets"
                  value={formData.desiredOutcome}
                  onChange={(e) => setFormData({ ...formData, desiredOutcome: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B]">
                  Expected Deliverables Mentions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js app, Stripe portal, PDF invoice generator"
                  value={formData.expectedDeliverables}
                  onChange={(e) => setFormData({ ...formData, expectedDeliverables: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Rates */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
            3. Commercial Terms & Pricing
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">Billing Mode</label>
              <div className="mt-1.5 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rateType: 'hourly' })}
                  className={`flex-1 rounded-md border py-2 text-xs font-medium ${
                    formData.rateType === 'hourly'
                      ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] font-semibold'
                      : 'border-[#E2E8F0] bg-white text-[#64748B]'
                  }`}
                >
                  Hourly Rate
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rateType: 'fixed' })}
                  className={`flex-1 rounded-md border py-2 text-xs font-medium ${
                    formData.rateType === 'fixed'
                      ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] font-semibold'
                      : 'border-[#E2E8F0] bg-white text-[#64748B]'
                  }`}
                >
                  Fixed Fee
                </button>
              </div>
            </div>

            <div>
              {formData.rateType === 'hourly' ? (
                <>
                  <label className="block text-xs font-semibold text-[#1E293B]">
                    Hourly Rate ({formData.currency}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
                  />
                  {errors.hourlyRate && <p className="mt-1 text-xs text-red-600">{errors.hourlyRate}</p>}
                </>
              ) : (
                <>
                  <label className="block text-xs font-semibold text-[#1E293B]">
                    Target Fixed Budget ({formData.currency}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.fixedBudget || ''}
                    onChange={(e) => setFormData({ ...formData, fixedBudget: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
                  />
                  {errors.fixedBudget && <p className="mt-1 text-xs text-red-600">{errors.fixedBudget}</p>}
                </>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">Available Hours</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 40"
                value={formData.availableHours || ''}
                onChange={(e) => setFormData({ ...formData, availableHours: Number(e.target.value) })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">Target Timeline</label>
              <input
                type="text"
                placeholder="e.g. 4 to 6 weeks, or Nov 15"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">Revision Rounds</label>
              <select
                value={formData.revisionRounds}
                onChange={(e) => setFormData({ ...formData, revisionRounds: Number(e.target.value) })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] focus:border-[#0F766E] focus:outline-none"
              >
                <option value={1}>1 Consolidated Round</option>
                <option value={2}>2 Consolidated Rounds (Standard)</option>
                <option value={3}>3 Consolidated Rounds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Exclusions & Boundaries */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">
              4. Known Exclusions & Constraints
            </h2>
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Crucial for scope defense
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            Specify work you will not perform, so ScopeMate can formulate explicit exclusions.
          </p>

          <div className="mt-3 space-y-4">
            <textarea
              rows={3}
              placeholder="e.g. Backend DB migrations out of scope; client provides all copy; no native iOS app; no translation into languages other than English."
              value={formData.constraintsAndExclusions}
              onChange={(e) => setFormData({ ...formData, constraintsAndExclusions: e.target.value })}
              className="w-full rounded-md border border-[#E2E8F0] bg-white p-3 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
            />

            <div>
              <label className="block text-xs font-semibold text-[#1E293B]">
                Additional Context or Risks <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Client frequently changes requirements; need firm milestone sign-offs."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="mt-1.5 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#1E293B] placeholder-slate-400 focus:border-[#0F766E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:p-5">
          <div className="text-xs text-[#64748B]">
            Outputs structured deliverables, acceptance criteria, exclusions, and quote line items.
          </div>

          <div className="flex w-full items-center justify-end space-x-3 sm:w-auto">
            <button
              type="button"
              onClick={onLoadSample}
              className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-medium text-[#1E293B] hover:bg-slate-50"
            >
              Cancel & View Sample
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 rounded-lg bg-[#0F766E] px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#115E59] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing with Gemma 4...</span>
                </>
              ) : (
                <>
                  <span>Generate Proposal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
