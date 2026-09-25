import React, { useState, useRef } from 'react';
import {
  Camera,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Dog,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  AlertOctagon,
  CreditCard,
  Building,
  Edit2,
  RefreshCw,
  Info
} from 'lucide-react';
import { TradeCategory, UserLocation, DispatchBooking } from '../types';
import { SAVED_LOCATIONS, MOCK_TECHNICIANS } from '../data/constants';

interface BookingWizardProps {
  category: TradeCategory;
  onCancel: () => void;
  onBookingConfirmed: (booking: DispatchBooking) => void;
  onOpenTriage: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  category,
  onCancel,
  onBookingConfirmed,
  onOpenTriage,
}) => {
  // Wizard steps: 1 (CAMERA), 2 (ACCESS & PETS), 3 (LOCATION), 4 (PRE-AUTH ESCROW)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Camera Diagnostic State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sha256Seal, setSha256Seal] = useState<string>('');
  const [photoTimestamp, setPhotoTimestamp] = useState<string>('');
  const [isPhotoSkipped, setIsPhotoSkipped] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Access & Pets
  const [gatePasscode, setGatePasscode] = useState('8492');
  const [hasPets, setHasPets] = useState(false);
  const [petDetails, setPetDetails] = useState('Golden Retriever (secured indoors)');

  // Step 3: Location
  const [selectedLocation, setSelectedLocation] = useState<UserLocation>(SAVED_LOCATIONS[0]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Step 4: Pre-Auth Escrow
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [preAuthDisclaimerAgreed, setPreAuthDisclaimerAgreed] = useState(true);

  // Preset sample hazard photos for quick one-tap testing if device camera is busy
  const sampleHazardImages: Record<string, string> = {
    electrical: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80',
    plumbing: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    'mobile-tech': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    automotive: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    default: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
  };

  const generateSha256Stamp = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    const stamp = `SHA256:${hash.substring(0, 16)}...${hash.substring(48)}`;
    setSha256Seal(stamp);
    setPhotoTimestamp(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC+05:30');
  };

  const handleCapturePhoto = (imageUrl: string) => {
    setIsCapturing(true);
    setTimeout(() => {
      setPhotoPreview(imageUrl);
      setIsPhotoSkipped(false);
      generateSha256Stamp();
      setIsCapturing(false);
    }, 400);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCapturePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkipPhotoForEmergency = () => {
    setIsPhotoSkipped(true);
    setPhotoPreview(null);
    setCurrentStep(2);
  };

  const handleCompleteEscrowPreAuth = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      const tech = MOCK_TECHNICIANS[category.id === 'plumbing' ? 1 : 0];
      const newBooking: DispatchBooking = {
        id: `ZAP-${Math.floor(100000 + Math.random() * 900000)}`,
        category,
        status: 'LIVE_TELEMETRY',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        beforePhotoUrl: photoPreview || undefined,
        beforePhotoSha256: sha256Seal || undefined,
        beforePhotoTimestamp: photoTimestamp || undefined,
        skippedPhoto: isPhotoSkipped,
        gatePasscode,
        petsOnPremises: hasPets,
        petType: hasPets ? petDetails : undefined,
        location: selectedLocation,
        preAuthAmount: 75.0,
        escrowStatus: 'HOLD_AUTHORIZED',
        preAuthHoldId: `ESCROW_HOLD_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        technician: tech,
        etaMinutes: 11,
        etaSecondsRemaining: 680,
        distanceKm: 2.4,
        gateAlertTriggered: false,
        proposedParts: [
          {
            id: 'part-1',
            name: category.id === 'plumbing' ? 'Heavy-Duty 3/4" PEX Compression Valve' : 'Industrial 40A Thermal Surge Breaker Module',
            price: 42.0,
            approved: true,
            partNumber: 'ZP-IND-9022',
            warranty: '24 Months Replacement',
          },
          {
            id: 'part-2',
            name: category.id === 'plumbing' ? 'High-Pressure Hydraulic Sealing Flange' : 'Copper Grounding Busbar Terminal & Clamp',
            price: 18.5,
            approved: false,
            partNumber: 'ZP-FL-108',
            warranty: '12 Months Replacement',
          },
        ],
      };
      setIsAuthorizing(false);
      onBookingConfirmed(newBooking);
    }, 1200);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      
      {/* Top Flow Progress Header */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as any);
              else onCancel();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep > 1 ? 'Back' : 'Cancel'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              Step {currentStep} of 4:
            </span>
            <span className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {currentStep === 1 && 'Diagnostic Camera'}
              {currentStep === 2 && 'Access & Pets'}
              {currentStep === 3 && 'Location Verification'}
              {currentStep === 4 && '$75 Pre-Auth Escrow'}
            </span>
          </div>

          <button
            onClick={onOpenTriage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30 hover:bg-cyan-500/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Triage
          </button>
        </div>

        {/* 4-Step Indicator Bars */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep >= step
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: IMMEDIATE DAMAGE CAMERA DIAGNOSTIC */}
      {currentStep === 1 && (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              Immediate Hazard Diagnostic
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Snap Hazard for Pro Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Diagnostic photos are stamped with a cryptographic SHA-256 seal for insurance &amp; audit proof.
            </p>
          </div>

          {/* Camera Viewfinder / Preview Box */}
          <div className="relative aspect-4/3 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 overflow-hidden flex flex-col items-center justify-center text-center p-4">
            {photoPreview ? (
              <div className="relative w-full h-full">
                <img
                  src={photoPreview}
                  alt="Captured Hazard"
                  className="w-full h-full object-cover rounded-xl"
                />
                {/* Official SHA-256 Stamp Overlay */}
                <div className="absolute top-2 left-2 right-2 bg-black/80 backdrop-blur-md p-2 rounded-lg text-left border border-white/20">
                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> BEFORE PHOTO • AUDIT SEALED
                    </span>
                    <span className="text-purple-400">GPS: 18.4839° N, 73.9532° E</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 truncate mt-0.5">
                    {sha256Seal}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Timestamp: {photoTimestamp}
                  </div>
                </div>

                {/* Retake Button */}
                <button
                  onClick={() => setPhotoPreview(null)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-lg border border-white/30 backdrop-blur-sm flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                  <Camera className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Native Camera Scanner Ready
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Snap cracked screen, pipe spray, breaker arc, or flat tire
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCapturing}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:opacity-95"
                  >
                    <Camera className="w-4 h-4" /> Open Camera / Upload
                  </button>

                  {/* Quick Preset Sample Diagnostic */}
                  <button
                    onClick={() =>
                      handleCapturePhoto(
                        sampleHazardImages[category.id] || sampleHazardImages.default
                      )
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Use Sample Hazard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Row & Emergency Skip Button */}
          <div className="space-y-3">
            {photoPreview ? (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 hover:opacity-95"
              >
                <span>Confirm Sealed Photo &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}

            {/* Prominent Emergency Skip Button */}
            <button
              onClick={handleSkipPhotoForEmergency}
              className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-extrabold text-xs border border-rose-200 dark:border-rose-900/50 flex items-center justify-center gap-2 transition-colors"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Skip Photo for Extreme Emergency (Life / Flood Risk)</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ACCESS PASSCODE & PET ALERT */}
      {currentStep === 2 && (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              Perimeter Access Security
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Gate Passcode &amp; Pet Safeguard
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Passcodes are encrypted and dynamically revealed to your pro only within 25 meters.
            </p>
          </div>

          <div className="space-y-5">
            {/* Gate Passcode Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-purple-500" />
                  Ephemeral Gate / Entry PIN
                </label>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Revealed &lt; 25m
                </span>
              </div>
              <input
                type="text"
                value={gatePasscode}
                onChange={(e) => setGatePasscode(e.target.value)}
                placeholder="e.g. #8492 or Call Resident"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-base font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[11px] text-slate-500">
                Technician Rajesh Shinde cannot view this PIN until his vehicle crosses your building geofence.
              </p>
            </div>

            {/* Pet Alert Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Dog className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Pets on Premises Alert
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Warns technician to verify perimeter gates upon entry
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPets}
                    onChange={(e) => setHasPets(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {hasPets && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Animal Notes:
                  </label>
                  <input
                    type="text"
                    value={petDetails}
                    onChange={(e) => setPetDetails(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(3)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 hover:opacity-95"
          >
            <span>Proceed to Address Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 3: LOCATION VERIFICATION & CONFIRMATION (MATCHES ASSET 3) */}
      {currentStep === 3 && (
        <div className="space-y-0">
          {/* Top Illustrative Organic Banner (Asset 3 style) */}
          <div className="relative h-36 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 p-5 flex flex-col justify-end text-white overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 flex items-center justify-end pr-4 pointer-events-none">
              <Building className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-black tracking-widest bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                DOORSTEP RAPID DISPATCH
              </span>
              <h2 className="text-xl font-black mt-1">
                Confirm Emergency Address
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Location Card matching Asset 3 screenshot */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Service at current location:
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                      {selectedLocation.addressLine1}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedLocation.addressLine2}, {selectedLocation.city} - {selectedLocation.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dotted separator line */}
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 my-2" />

              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedLocation.contactName} ({selectedLocation.phone})
                </div>

                {/* Switch Button matching Asset 3 */}
                <button
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 hover:border-purple-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit2 className="w-3 h-3 text-purple-500" />
                  <span>Switch</span>
                </button>
              </div>
            </div>

            {/* Address Switcher Drawer if toggled */}
            {showLocationPicker && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  Select Registered Site:
                </div>
                {SAVED_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationPicker(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                      selectedLocation.id === loc.id
                        ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-400 text-purple-950 dark:text-purple-200'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{loc.label}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {loc.addressLine1}, {loc.city}
                      </div>
                    </div>
                    {selectedLocation.id === loc.id && (
                      <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setCurrentStep(4)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 hover:opacity-95"
            >
              <span>Confirm Location &amp; Open Escrow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: $75.00 PRE-AUTH ESCROW (WITH MANDATORY DISCLAIMER) */}
      {currentStep === 4 && (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Escrow Vault
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              $75.00 Diagnostic Pre-Auth
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero upfront charges until on-site inspection and digital signature approval.
            </p>
          </div>

          {/* Escrow Card Container */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Authorized Hold
                  </span>
                  <div className="text-xl font-black text-cyan-300">
                    $75.00 USD
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Temporary Hold
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Visa •••• 4917</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Immediate Priority Pro Dispatch:</span>
                <span className="font-semibold text-white">Guaranteed</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Assigned Unit:</span>
                <span className="font-semibold text-cyan-400">Rajesh Shinde (Unit #104)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated En-Route ETA:</span>
                <span className="font-semibold text-emerald-400">11 mins</span>
              </div>
            </div>
          </div>

          {/* MANDATORY DISCLAIMER AS REQUESTED IN SPECIFICATION */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Mandatory Escrow Disclaimer:
                </h4>
                <p className="text-xs font-bold leading-relaxed mt-0.5">
                  &ldquo;Diagnostic Fee Pre-Authorization Only — This is a temporary hold, NOT the final bill. Final charges determined on-site based on actual work.&rdquo;
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={preAuthDisclaimerAgreed}
                onChange={(e) => setPreAuthDisclaimerAgreed(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                I understand this $75.00 hold unlocks emergency dispatch and live vehicle telemetry.
              </span>
            </label>
          </div>

          {/* Authorize Button */}
          <button
            onClick={handleCompleteEscrowPreAuth}
            disabled={!preAuthDisclaimerAgreed || isAuthorizing}
            className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-2xl transition-all flex items-center justify-center gap-2 ${
              isAuthorizing || !preAuthDisclaimerAgreed
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:opacity-95 shadow-emerald-500/30'
            }`}
          >
            {isAuthorizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Securing Escrow Pre-Auth Hold...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authorize $75.00 Hold &amp; Track Vehicle Live</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
};
