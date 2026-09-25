import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Shield,
  ShieldAlert,
  Sparkles,
  Zap,
  Droplets,
  Flame,
  Car,
  Smartphone,
  AlertTriangle,
  Key,
  Wrench,
  Waves,
  Sun,
  Utensils,
  Maximize2,
  Biohazard,
  Cpu,
  ChevronRight,
  ArrowRight,
  Heart,
  Navigation,
  FileText,
  User,
  Layers,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

import { ZapFixLogo } from './components/ZapFixLogo';
import { GeminiGuardianModal } from './components/GeminiGuardianModal';
import { BookingWizard } from './components/BookingWizard';
import { LiveTelemetryView } from './components/LiveTelemetryView';
import { InvoiceView } from './components/InvoiceView';
import { ProfileView } from './components/ProfileView';
import { BannerStudioModal } from './components/BannerStudioModal';

import { TRADE_CATEGORIES, SAVED_LOCATIONS, USER_PROFILE_DEFAULT } from './data/constants';
import { TradeCategory, DispatchBooking } from './types';

export default function App() {
  // Navigation tabs: 'services' | 'live-track' | 'invoices' | 'profile'
  const [activeTab, setActiveTab] = useState<'services' | 'live-track' | 'invoices' | 'profile'>('services');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(SAVED_LOCATIONS[0]);

  // Booking Flow State
  const [activeCategory, setActiveCategory] = useState<TradeCategory | null>(null);
  const [currentBooking, setCurrentBooking] = useState<DispatchBooking | null>(null);

  // Modals
  const [isGuardianOpen, setIsGuardianOpen] = useState(false);
  const [guardianCategory, setGuardianCategory] = useState('Electrical Emergency');
  const [isBannerStudioOpen, setIsBannerStudioOpen] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Runtime API Key from Profile/Settings (Point B)
  const [runtimeApiKey, setRuntimeApiKey] = useState(USER_PROFILE_DEFAULT.preconfiguredApiKey);

  // Icon mapping helper for 15 categories
  const renderCategoryIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-white' };
    switch (iconName) {
      case 'Zap': return <Zap {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'AlertTriangle': return <AlertTriangle {...props} />;
      case 'Key': return <Key {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Maximize2': return <Maximize2 {...props} />;
      case 'Biohazard': return <Biohazard {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      default: return <Wrench {...props} />;
    }
  };

  const filteredCategories = TRADE_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCategory = (cat: TradeCategory) => {
    setActiveCategory(cat);
  };

  const handleBookingConfirmed = (booking: DispatchBooking) => {
    setCurrentBooking(booking);
    setActiveCategory(null);
    setActiveTab('live-track');
  };

  const handleOpenGuardian = (catName?: string) => {
    if (catName) setGuardianCategory(catName);
    setIsGuardianOpen(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div
            onClick={() => {
              setActiveCategory(null);
              setActiveTab('services');
            }}
            className="cursor-pointer"
          >
            <ZapFixLogo size="md" withText={true} />
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Banner Ad Studio Button */}
            <button
              onClick={() => setIsBannerStudioOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Generate standard banner ads in all sizes from product/URL"
            >
              <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Ad Banner Studio</span>
              <span className="text-[10px] font-black uppercase bg-purple-600 text-white px-1.5 py-0.2 rounded">
                1K-4K
              </span>
            </button>

            {/* Safety Guardian AI Header Button */}
            <button
              onClick={() => handleOpenGuardian('General Emergency')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span className="hidden md:inline">Safety Guardian</span>
            </button>

            {/* Profile Avatar / Quick Link */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[11px] font-bold text-white">
                  VP
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">
                Vishnu
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Main App Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 sm:pb-12">
        
        {/* VIEW 1: ACTIVE BOOKING WIZARD */}
        {activeCategory ? (
          <BookingWizard
            category={activeCategory}
            onCancel={() => setActiveCategory(null)}
            onBookingConfirmed={handleBookingConfirmed}
            onOpenTriage={() => handleOpenGuardian(activeCategory.name)}
          />
        ) : activeTab === 'live-track' ? (
          /* VIEW 2: LIVE TELEMETRY */
          currentBooking ? (
            <LiveTelemetryView
              booking={currentBooking}
              onUpdateBooking={(updated) => setCurrentBooking(updated)}
              onViewInvoice={() => setActiveTab('invoices')}
              onOpenGuardian={() => handleOpenGuardian(currentBooking.category.name)}
            />
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Navigation className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  No Active Telemetry Dispatch
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Select an emergency trade service from the dashboard to initiate diagnostic camera verification and track technician en route.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('services')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
              >
                Browse Emergency Trades
              </button>
            </div>
          )
        ) : activeTab === 'invoices' ? (
          /* VIEW 3: INVOICES */
          currentBooking && currentBooking.invoice ? (
            <InvoiceView
              booking={currentBooking}
              onBackToHome={() => setActiveTab('services')}
            />
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  No Completed Work Invoices Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Complete an emergency repair booking with electronic signature to view cryptographic before &amp; after photo audit proof and tax invoices.
                </p>
              </div>
              {currentBooking && (
                <button
                  onClick={() => setActiveTab('live-track')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs"
                >
                  Return to Active Dispatch ({currentBooking.category.name})
                </button>
              )}
            </div>
          )
        ) : activeTab === 'profile' ? (
          /* VIEW 4: PROFILE & SETTINGS SUITE */
          <ProfileView
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onOpenGuardian={() => handleOpenGuardian('Emergency Protocol')}
            runtimeApiKey={runtimeApiKey}
            onUpdateApiKey={(k) => setRuntimeApiKey(k)}
          />
        ) : (
          /* VIEW 5: SERVICES DASHBOARD (DEFAULT HOME) */
          <div className="space-y-6">
            
            {/* POINT A: PROMINENT GEMINI 1.5 FLASH SAFETY GUARDIAN BANNER */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white p-6 shadow-2xl border border-cyan-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                      POINT A • SAFETY GUARDIAN
                    </span>
                    <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      Gemini 1.5 Flash Triage
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    Emergency Hazard Isolation in Seconds
                  </h1>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Experiencing active sparking, gas leaks, or pipe ruptures? Launch instant AI containment instructions to safeguard life and property while your master technician travels.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenGuardian('Electrical Emergency')}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 hover:opacity-95 flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <ShieldAlert className="w-4 h-4 text-slate-950" />
                    <span>Launch Safety Triage</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>

                  <button
                    onClick={() => setIsBannerStudioOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-300" />
                    <span>Pro Marketing Banner Studio</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TOP SEARCH BAR (ASSET 2: ROUNDED PILL CONTAINER) */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emergency hazard or trade specialist (e.g. Electrical, Plumbing, HVAC)..."
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* SAVED ADDRESSES & QUICK PINS (MATCHING ASSET 2) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Recent Location Shortcuts:</span>
                <span className="text-purple-500 cursor-pointer hover:underline">Pune Hub</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAVED_LOCATIONS.slice(0, 3).map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                      selectedLocation.id === loc.id
                        ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-400 text-purple-900 dark:text-purple-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">{loc.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {loc.addressLine1}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 15 HIGH-DEMAND EMERGENCY TRADE CATEGORIES GRID */}
            {/* UX DIRECTIVE: 100% CLICKABLE CONTAINER SURFACE (NO TINY CLICK TARGETS) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Emergency Trade Dispatch
                  </h3>
                  <p className="text-xs text-slate-500">
                    15 certified specialties • Full card container is 100% clickable
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  ⚡ 15-Min Guaranteed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
                  >
                    {/* Top Row: Icon & ETA Badge */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                        {renderCategoryIcon(cat.iconName)}
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                          ETA {cat.eta}
                        </span>
                        {cat.badge && (
                          <span className="block text-[9px] font-bold text-purple-600 dark:text-purple-400 mt-1">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category Title & Description */}
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* Bottom Row: Pre-auth & Dispatch Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Pre-Auth Hold:</span>
                        <div className="font-black text-slate-900 dark:text-white">
                          ${cat.baseDiagnosticFee.toFixed(2)} USD
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-purple-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                        <span>Dispatch</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BAR (MATCHING ASSET 2 & 4) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto grid grid-cols-4 h-16">
          
          {/* Tab 1: Services */}
          <button
            onClick={() => {
              setActiveCategory(null);
              setActiveTab('services');
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'services' && !activeCategory
                ? 'text-purple-600 dark:text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Services</span>
          </button>

          {/* Tab 2: Live Track */}
          <button
            onClick={() => setActiveTab('live-track')}
            className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'live-track'
                ? 'text-purple-600 dark:text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Live Track</span>
            {currentBooking && currentBooking.status === 'LIVE_TELEMETRY' && (
              <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          {/* Tab 3: Invoices */}
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'invoices'
                ? 'text-purple-600 dark:text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Invoices</span>
          </button>

          {/* Tab 4: Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'profile'
                ? 'text-purple-600 dark:text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Profile</span>
          </button>

        </div>
      </nav>

      {/* Gemini AI Safety Guardian Modal (Dual-Point Integration) */}
      <GeminiGuardianModal
        isOpen={isGuardianOpen}
        onClose={() => setIsGuardianOpen(false)}
        categoryName={guardianCategory}
        customApiKey={runtimeApiKey}
        onProceedToDispatch={() => {
          const match = TRADE_CATEGORIES.find((c) =>
            guardianCategory.toLowerCase().includes(c.shortName.toLowerCase())
          ) || TRADE_CATEGORIES[0];
          handleSelectCategory(match);
        }}
      />

      {/* Banner Ad Generator Studio Modal */}
      <BannerStudioModal
        isOpen={isBannerStudioOpen}
        onClose={() => setIsBannerStudioOpen(false)}
        customApiKey={runtimeApiKey}
      />

    </div>
  );
}
