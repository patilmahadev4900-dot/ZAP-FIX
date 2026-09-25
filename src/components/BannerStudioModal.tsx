import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Layers,
  Download,
  Code,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Palette,
  Eye,
  RefreshCw,
  Maximize2,
  Tv,
  Smartphone,
  Monitor
} from 'lucide-react';
import { BANNER_AD_PRESETS } from '../data/constants';
import { ZapFixLogo } from './ZapFixLogo';

interface BannerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  customApiKey?: string;
}

export const BannerStudioModal: React.FC<BannerStudioModalProps> = ({
  isOpen,
  onClose,
  customApiKey,
}) => {
  // Product description & URL
  const [productDescription, setProductDescription] = useState(
    'ZapFix Global 24/7 Rapid Emergency Trade Dispatch — Certified Master Electricians, Plumbers & HVAC Pros with 15-Minute Guaranteed Response & Escrow Protection'
  );
  const [productUrl, setProductUrl] = useState('https://zapfix.global');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');
  const [selectedResolution, setSelectedResolution] = useState<'1K' | '2K' | '4K'>('2K');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rect-300-250');
  
  // AI Generated Banner Content
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [bannerContent, setBannerContent] = useState({
    headline: '15-Minute Emergency Trade Dispatch',
    subheadline: 'Certified Master Electricians & Plumbers • Escrow Protected',
    ctaText: 'Dispatch Master Pro Now',
    badgeText: '5.0 ★ Rated • 24/7 Verified',
    accentColor: '#00D2FF',
    gradient: { from: '#00D2FF', to: '#9B51E0' },
    keyBenefitPoints: ['15-Min Guaranteed Arrival', 'Zero Surprises Upfront Escrow', 'Live GPS Vehicle Telemetry'],
    imageCreativePrompt: '3D glossy luxury ribbon Z emblem with vibrant cyan and purple laser neon accents on obsidian slate, studio lighting',
    designStyle: 'High-Gloss Luxury Commercial',
  });

  if (!isOpen) return null;

  const aspectRatios = [
    { label: '1:1', name: 'Square Feed', icon: '■' },
    { label: '2:3', name: 'Portrait Classic', icon: '▮' },
    { label: '3:2', name: 'Landscape Standard', icon: '▬' },
    { label: '3:4', name: 'Mobile Card', icon: '▯' },
    { label: '4:3', name: 'Classic Display', icon: '▭' },
    { label: '9:16', name: 'Story / Reel', icon: '📱' },
    { label: '16:9', name: 'Widescreen Billboard', icon: '📺' },
    { label: '21:9', name: 'Ultrawide Banner', icon: '⚡' },
  ];

  const resolutions: Array<'1K' | '2K' | '4K'> = ['1K', '2K', '4K'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDescription,
          productUrl,
          aspectRatio: selectedAspectRatio,
          resolution: selectedResolution,
          bannerType: selectedPresetId,
          customApiKey,
        }),
      });
      const data = await res.json();
      if (data && data.banner) {
        setBannerContent(data.banner);
      }
    } catch (e) {
      console.error('Banner generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEmbedCode = () => {
    const embedHtml = `<!-- ZapFix High-Converting Responsive Banner -->
<div style="background: linear-gradient(135deg, ${bannerContent.gradient.from}, ${bannerContent.gradient.to}); padding: 24px; border-radius: 20px; font-family: sans-serif; color: #fff; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
  <span style="background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${bannerContent.badgeText}</span>
  <h2 style="font-size: 22px; font-weight: 900; margin: 12px 0 6px 0;">${bannerContent.headline}</h2>
  <p style="font-size: 13px; opacity: 0.9; margin-bottom: 16px;">${bannerContent.subheadline}</p>
  <a href="${productUrl}" target="_blank" style="display: inline-block; background: #fff; color: #0f172a; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 13px; text-decoration: none;">${bannerContent.ctaText} &rarr;</a>
</div>`;

    navigator.clipboard.writeText(embedHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  AI Creative Studio
                </span>
                <span className="text-xs font-semibold text-purple-300">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                Standard Size Banner Ad Generator
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Product Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Product / Trade Description</span>
                <span className="text-[10px] text-slate-400 font-normal">Source copy</span>
              </label>
              <textarea
                rows={3}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe product or emergency service..."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Product URL & Generation Settings */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Destination URL
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Resolution Affordance (1K, 2K, 4K) as explicitly mandated */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Resolution Output (gemini-3-pro-image-preview)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {resolutions.map((res) => (
                    <button
                      key={res}
                      onClick={() => setSelectedResolution(res)}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        selectedResolution === res
                          ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {res} Ultra-HQ
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Aspect Ratio Affordance (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) as explicitly mandated */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Aspect Ratio Control (Standard IAB &amp; Social Ratios):
              </label>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                Active: {selectedAspectRatio}
              </span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.label}
                  onClick={() => setSelectedAspectRatio(ar.label)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedAspectRatio === ar.label
                      ? 'bg-gradient-to-br from-cyan-500 to-purple-600 border-transparent text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-sm font-bold">{ar.label}</div>
                  <div className="text-[9px] truncate opacity-80">{ar.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* IAB Standard Preset Sizes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Standard IAB Display Sizes:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BANNER_AD_PRESETS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPresetId(p.id);
                    setSelectedAspectRatio(p.aspectRatio);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPresetId === p.id
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{p.dimensions}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini Synthesizing High-Impact Ad Creative &amp; Layout...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate High-Quality Banner Ads in All Sizes</span>
              </>
            )}
          </button>

          {/* LIVE BANNER PREVIEW STAGE */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Live Generated Ad Preview ({selectedAspectRatio} • {selectedResolution})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmbedCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied HTML!' : 'Copy Embed Code'}</span>
                </button>
              </div>
            </div>

            {/* Responsive Banner Card Visual */}
            <div className="flex justify-center p-4 overflow-x-auto">
              <div
                className="relative rounded-3xl overflow-hidden p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 w-full max-w-lg min-h-[260px]"
                style={{
                  background: `linear-gradient(135deg, ${bannerContent.gradient.from} 0%, #1e1b4b 60%, ${bannerContent.gradient.to} 100%)`,
                  boxShadow: '0 20px 40px -15px rgba(0, 210, 255, 0.3)',
                }}
              >
                {/* Background Specular Art */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <ZapFixLogo size="sm" withText={true} />
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-cyan-300 border border-cyan-400/30">
                      {bannerContent.badgeText}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                      {bannerContent.headline}
                    </h2>
                    <p className="text-xs text-slate-200 font-medium mt-1">
                      {bannerContent.subheadline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bannerContent.keyBenefitPoints.map((pt, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-white/10"
                      >
                        ✓ {pt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/15 mt-3">
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs shadow-lg hover:bg-slate-100 flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>{bannerContent.ctaText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-[10px] font-mono text-slate-300 opacity-80 truncate max-w-[150px]">
                    {productUrl.replace('https://', '')}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Export ready in 1K, 2K, 4K resolution formats
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90"
          >
            Done &amp; Return
          </button>
        </div>

      </div>
    </div>
  );
};
