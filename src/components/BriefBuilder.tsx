import React, { useState } from 'react';
import { ClientBrief, Currency, RateType, ServiceType } from '../types/index.ts';
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Code2,
  Palette,
  PenTool,
  Film,
  Layers,
  CheckCircle2,
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
        projectName: 'E-Commerce Headless Storefront & Checkout',
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
        additionalNotes: 'Client frequently asks for custom 3D webgl model viewers; explicitly exclude 3D canvas rendering for phase 1.',
      });
    } else if (type === 'ui_ux_design') {
      setFormData({
        ...formData,
        serviceType: 'ui_ux_design',
        projectName: 'B2B Logistics SaaS Mobile App Design System',
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
        projectName: 'Developer Documentation & API Onboarding Guides',
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
        projectName: 'Product Hunt Launch Video & Social Teasers',
        clientName: 'Veloce AI Productivity',
        clientBrief:
          'We need a punchy 90-second product demo video for our upcoming Product Hunt launch, plus three 15-second vertical cuts for X/LinkedIn. Client provides raw screen recordings and voiceover audio. We need kinetic typography, clean sound design, pacing, custom zooms, and color correction.',
        desiredOutcome: 'Top 3 Product of the Day finish on Product Hunt with engaging social hooks.',
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
      <div className="border-b border-[#E5E0D5] pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#21473A]">
          <span>STEP 1 OF 3</span>
          <span>•</span>
          <span>CLIENT BRIEF BUILDER</span>
        </div>
        <h1 className="mt-2 font-editorial text-3xl font-bold text-[#21473A] sm:text-4xl">
          Define the Project Boundaries
        </h1>
        <p className="mt-2 text-sm text-[#1F2923]/70 sm:text-base">
          Fill out what you know about the project. Gemma 4 will extrapolate deliverables,
          clarify ambiguities, outline explicit exclusions, and draft your professional proposal.
        </p>

        {/* Preset quick buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#1F2923]/60">Quick Preset:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('web_development')}
            className="flex items-center space-x-1 rounded-md border border-[#21473A]/20 bg-white px-2.5 py-1 text-xs font-medium text-[#21473A] hover:bg-[#DCE7DC]/40"
          >
            <Code2 className="h-3 w-3 text-[#21473A]" />
            <span>Web Dev</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('ui_ux_design')}
            className="flex items-center space-x-1 rounded-md border border-[#21473A]/20 bg-white px-2.5 py-1 text-xs font-medium text-[#21473A] hover:bg-[#DCE7DC]/40"
          >
            <Palette className="h-3 w-3 text-[#21473A]" />
            <span>UI/UX Design</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('content_writing')}
            className="flex items-center space-x-1 rounded-md border border-[#21473A]/20 bg-white px-2.5 py-1 text-xs font-medium text-[#21473A] hover:bg-[#DCE7DC]/40"
          >
            <PenTool className="h-3 w-3 text-[#21473A]" />
            <span>Content & Docs</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('video_editing')}
            className="flex items-center space-x-1 rounded-md border border-[#21473A]/20 bg-white px-2.5 py-1 text-xs font-medium text-[#21473A] hover:bg-[#DCE7DC]/40"
          >
            <Film className="h-3 w-3 text-[#21473A]" />
            <span>Video & Motion</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Section 1: Core Project Info */}
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
          <h2 className="font-editorial text-lg font-bold text-[#21473A]">1. Project Identification</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">
                Project Name <span className="text-[#E9795C]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Fintech Customer Billing Portal"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
              {errors.projectName && (
                <p className="mt-1 text-xs text-[#E9795C]">{errors.projectName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">
                Client / Company Name <span className="text-xs text-[#1F2923]/50">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AeroPay Financial Corp"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1F2923]">Service Discipline</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-6">
                {[
                  { id: 'web_development', label: 'Web Dev' },
                  { id: 'ui_ux_design', label: 'UI/UX Design' },
                  { id: 'graphic_design', label: 'Graphic Design' },
                  { id: 'content_writing', label: 'Content Writing' },
                  { id: 'video_editing', label: 'Video Editing' },
                  { id: 'other', label: 'Other Service' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: item.id as ServiceType })}
                    className={`rounded-md border px-2.5 py-2 text-xs font-medium text-center transition ${
                      formData.serviceType === item.id
                        ? 'border-[#21473A] bg-[#21473A] text-white'
                        : 'border-[#E5E0D5] bg-[#F7F5EF]/30 text-[#1F2923]/80 hover:bg-[#DCE7DC]/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: The Brief */}
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
          <h2 className="font-editorial text-lg font-bold text-[#21473A]">2. The Client's Request & Needs</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#1F2923]">
                  Client's Original Brief or Message <span className="text-[#E9795C]">*</span>
                </label>
                <span className="text-[11px] text-[#1F2923]/60">Paste raw email, Slack, or brief notes</span>
              </div>
              <textarea
                rows={5}
                placeholder="Paste what the client wrote or describe what they asked for in their own words..."
                value={formData.clientBrief}
                onChange={(e) => setFormData({ ...formData, clientBrief: e.target.value })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 p-3 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
              {errors.clientBrief && (
                <p className="mt-1 text-xs text-[#E9795C]">{errors.clientBrief}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#1F2923]">
                  Desired Outcome & Target Audience <span className="text-xs text-[#1F2923]/50">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50% fewer invoice support tickets; target: SMB finance leads"
                  value={formData.desiredOutcome}
                  onChange={(e) => setFormData({ ...formData, desiredOutcome: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2923]">
                  Expected Deliverables Mentions <span className="text-xs text-[#1F2923]/50">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js app, Stripe portal link, PDF invoice generator"
                  value={formData.expectedDeliverables}
                  onChange={(e) => setFormData({ ...formData, expectedDeliverables: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Commercial Terms & Pricing */}
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
          <h2 className="font-editorial text-lg font-bold text-[#21473A]">3. Commercial Terms & Pricing Preferences</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Billing Mode</label>
              <div className="mt-1 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rateType: 'hourly' })}
                  className={`flex-1 rounded-md border py-2 text-xs font-medium ${
                    formData.rateType === 'hourly'
                      ? 'border-[#21473A] bg-[#21473A] text-white'
                      : 'border-[#E5E0D5] bg-[#F7F5EF]/30 text-[#1F2923]'
                  }`}
                >
                  Hourly Rate
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rateType: 'fixed' })}
                  className={`flex-1 rounded-md border py-2 text-xs font-medium ${
                    formData.rateType === 'fixed'
                      ? 'border-[#21473A] bg-[#21473A] text-white'
                      : 'border-[#E5E0D5] bg-[#F7F5EF]/30 text-[#1F2923]'
                  }`}
                >
                  Fixed Fee
                </button>
              </div>
            </div>

            <div>
              {formData.rateType === 'hourly' ? (
                <>
                  <label className="block text-xs font-semibold text-[#1F2923]">
                    Your Hourly Rate ({formData.currency}) <span className="text-[#E9795C]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                  />
                  {errors.hourlyRate && <p className="mt-1 text-xs text-[#E9795C]">{errors.hourlyRate}</p>}
                </>
              ) : (
                <>
                  <label className="block text-xs font-semibold text-[#1F2923]">
                    Target Fixed Budget ({formData.currency}) <span className="text-[#E9795C]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.fixedBudget || ''}
                    onChange={(e) => setFormData({ ...formData, fixedBudget: Number(e.target.value) })}
                    className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
                  />
                  {errors.fixedBudget && <p className="mt-1 text-xs text-[#E9795C]">{errors.fixedBudget}</p>}
                </>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Estimated Available Hours</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 40"
                value={formData.availableHours || ''}
                onChange={(e) => setFormData({ ...formData, availableHours: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Target Timeline</label>
              <input
                type="text"
                placeholder="e.g. 4 to 6 weeks, or Nov 15"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">Included Revision Rounds</label>
              <select
                value={formData.revisionRounds}
                onChange={(e) => setFormData({ ...formData, revisionRounds: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              >
                <option value={1}>1 Consolidated Round</option>
                <option value={2}>2 Consolidated Rounds (Standard)</option>
                <option value={3}>3 Consolidated Rounds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Boundaries & Exclusions */}
        <div className="rounded-xl border border-[#E5E0D5] bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex items-center space-x-2">
            <h2 className="font-editorial text-lg font-bold text-[#21473A]">
              4. Known Constraints & Exclusions
            </h2>
            <span className="rounded bg-[#E9795C]/15 px-2 py-0.5 text-[10px] font-bold text-[#E9795C]">
              Crucial
            </span>
          </div>
          <p className="mt-1 text-xs text-[#1F2923]/70">
            Tell ScopeMate what you will NOT do, so it can formulate explicit contractual exclusions.
          </p>

          <div className="mt-3 space-y-4">
            <div>
              <textarea
                rows={3}
                placeholder="e.g. Backend DB migration is out of scope; client supplies all copy; no native iOS app; no translation into languages other than English."
                value={formData.constraintsAndExclusions}
                onChange={(e) => setFormData({ ...formData, constraintsAndExclusions: e.target.value })}
                className="w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 p-3 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2923]">
                Additional Context or Risks <span className="text-xs text-[#1F2923]/50">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Client stakeholders change minds often; need firm milestone sign-offs."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="mt-1 w-full rounded-md border border-[#E5E0D5] bg-[#F7F5EF]/40 px-3 py-2 text-sm text-[#1F2923] focus:border-[#21473A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit action */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#21473A]/20 bg-[#ECE7DC]/60 p-4 sm:flex-row sm:p-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#21473A]">
              <Sparkles className="h-4 w-4 text-[#E9795C]" />
              <span>Gemma 4 (26B-A4B-IT) Open-Weight Inference</span>
            </div>
            <p className="mt-0.5 text-xs text-[#1F2923]/70">
              Structures deliverables, formulates acceptance criteria, and generates line item estimates.
            </p>
          </div>

          <div className="flex w-full items-center justify-end space-x-3 sm:w-auto">
            <button
              type="button"
              onClick={onLoadSample}
              className="rounded-lg border border-[#21473A]/30 bg-white px-4 py-2.5 text-xs font-semibold text-[#21473A] hover:bg-[#DCE7DC]/40"
            >
              Cancel & View Sample
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 rounded-lg bg-[#21473A] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#18362C] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing with Gemma 4...</span>
                </>
              ) : (
                <>
                  <span>Generate Proposal & Scope</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
