import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Sparkles, X, Volume2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { SafetyTriage } from '../types';

interface GeminiGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
  onProceedToDispatch?: () => void;
  customApiKey?: string;
}

export const GeminiGuardianModal: React.FC<GeminiGuardianModalProps> = ({
  isOpen,
  onClose,
  categoryName = 'Electrical Emergency',
  onProceedToDispatch,
  customApiKey,
}) => {
  const [hazardInput, setHazardInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [triageData, setTriageData] = useState<SafetyTriage | null>(null);
  const [activeTab, setActiveTab] = useState<'containment' | 'danger' | 'transit'>('containment');

  if (!isOpen) return null;

  const handleRunTriage = async (customCategory?: string) => {
    setIsLoading(true);
    const targetCat = customCategory || categoryName;
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: targetCat,
          description: hazardInput,
          customApiKey,
          urgency: 'critical',
        }),
      });
      const data = await response.json();
      if (data && data.triage) {
        setTriageData(data.triage);
      }
    } catch (e) {
      console.error('Triage call error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-load default triage if none loaded yet
  if (!triageData && !isLoading) {
    handleRunTriage(categoryName);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header with High-Impact Gradient */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white relative">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-20 -bottom-8 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                    Dual-Point AI Guardian
                  </span>
                  <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Gemini 1.5 Flash
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                  Emergency Safety Triage
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

          {/* Quick Hazard Switcher Chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {['Electrical Arcing', 'Burst Water Pipe', 'Gas Odor', 'AC Burning', 'Basement Flood'].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setHazardInput(chip);
                  handleRunTriage(chip);
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all font-medium"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Gemini AI analyzing hazard parameters &amp; synthesizing isolation protocol...
              </p>
              <p className="text-xs text-slate-500">Retrieving certified life-safety guidelines</p>
            </div>
          ) : triageData ? (
            <div className="space-y-5">
              {/* Severity Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        {triageData.severityLevel}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {triageData.immediateActionTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Response: {triageData.estimatedResponsePriority}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <Volume2 className="w-4 h-4" /> Siren Armed
                </div>
              </div>

              {/* Tabs */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/60 p-1">
                <button
                  onClick={() => setActiveTab('containment')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'containment'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Step-by-Step Containment
                </button>
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'danger'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-rose-500'
                  }`}
                >
                  Do NOT Touch / Danger
                </button>
                <button
                  onClick={() => setActiveTab('transit')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'transit'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Transit Prep
                </button>
              </div>

              {/* Tab 1: Step-by-Step Containment */}
              {activeTab === 'containment' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Follow immediately while technician travels:
                  </div>
                  <div className="space-y-2.5">
                    {triageData.stepByStepContainment?.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {step}
                        </p>
                      </div>
                    )) || (
                      <p className="text-sm text-slate-500">Containment protocol active.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Do Not Touch & Critical Warnings */}
              {activeTab === 'danger' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                      <XCircle className="w-4 h-4 text-rose-500" /> Critical Life-Safety Warnings
                    </div>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      {triageData.criticalWarnings?.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                    Prohibited Actions (Do Not Touch):
                  </div>
                  <div className="space-y-2">
                    {triageData.doNotTouchList?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                      >
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Transit Prep */}
              {activeTab === 'transit' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Prepare for Arrival of Master Pro:
                  </div>
                  <div className="space-y-2">
                    {triageData.transitPrepChecklist?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Guidance */}
              <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-800/30 p-3 rounded-xl">
                &ldquo;{triageData.summaryGuidance}&rdquo;
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>AI Verified Hazard Triage</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Dismiss
            </button>
            {onProceedToDispatch && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToDispatch();
                }}
                className="px-5 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 shadow-md shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>Dispatch Master Pro Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
