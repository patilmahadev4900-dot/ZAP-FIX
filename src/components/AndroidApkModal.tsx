import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  X,
  Shield,
  Layers,
  Sparkles,
  Terminal,
  ArrowRight,
  Info
} from 'lucide-react';
import { ZapFixLogo } from './ZapFixLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, installPWA } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://zapfix.global';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  const handleInstallClick = async () => {
    const success = await installPWA();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const bubblewrapCommand = `npx @bubblewrap/cli init --manifest="${appUrl}/manifest.json" && npx @bubblewrap/cli build`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(bubblewrapCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  Android APK Package
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> WebAPK &amp; Native Ready
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                Download / Install Android APK
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Status / Explanation Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-transparent border border-purple-500/20 dark:border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <ZapFixLogo size="sm" withText={false} />
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  ZapFix Global Android Client
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Package: <code className="font-mono text-cyan-600 dark:text-cyan-400">global.zapfix.twa</code> • Version 1.0.0
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Android natively supports <strong>WebAPKs</strong>: when installed from your browser, Android's OS automatically mints and installs a standalone <strong>.apk</strong> directly into your phone’s App Drawer with high-speed performance and offline caching.
            </p>
          </div>

          {/* OPTION 1: 1-Tap WebAPK Installation on Android */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>Direct Android WebAPK Install (Recommended)</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Zero Configuration
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Installs directly on any Android smartphone (Samsung, Pixel, OnePlus, Xiaomi) with full-screen experience and hardware camera access.
            </p>

            {isInstalled ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ZapFix WebAPK is already installed on this device!</span>
              </div>
            ) : installSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WebAPK installed successfully! Check your home screen.</span>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Install ZapFix WebAPK onto Android Device</span>
              </button>
            )}

            {!isInstallable && !isInstalled && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                Tip on Android Chrome: You can also tap <strong>⋮ (Menu) &rarr; &ldquo;Add to Home screen&rdquo;</strong> or <strong>&ldquo;Install App&rdquo;</strong> to generate the native APK package.
              </div>
            )}
          </div>

          {/* OPTION 2: 1-Click APK Generator via PWABuilder */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>Compile Standalone .APK File (PWABuilder / Play Store)</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Google Play Ready
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download a standalone unsigned or signed <strong>.apk</strong> / <strong>.aab</strong> bundle file to side-load via Android File Manager or upload to the Google Play Console.
            </p>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Smartphone className="w-4 h-4" />
              <span>Generate Standalone .APK Package (PWABuilder)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* OPTION 3: CLI Command for Developers (Bubblewrap / Capacitor) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>Google Bubblewrap CLI (Command Line Build)</span>
              </div>
              <Terminal className="w-4 h-4 text-slate-400" />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run Google's official CLI tool in your terminal to build the APK directly with JDK and Android SDK:
            </p>

            <div className="relative">
              <pre className="p-3 rounded-xl bg-slate-950 text-cyan-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
                {bubblewrapCommand}
              </pre>
              <button
                onClick={handleCopyCmd}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Android Native Features Included */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Standalone Fullscreen</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Native Camera Hardware</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">GPS Live Telemetry</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">SHA-256 Audit Seal</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span>PWA &amp; Android TWA Compliant</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
