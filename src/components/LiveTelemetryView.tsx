import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MessageSquare,
  Navigation,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Camera,
  PenTool,
  Send,
  X,
  Sparkles,
  RefreshCw,
  FileText,
  Volume2,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { DispatchBooking, ProposedPart } from '../types';

interface LiveTelemetryViewProps {
  booking: DispatchBooking;
  onUpdateBooking: (updated: DispatchBooking) => void;
  onViewInvoice: () => void;
  onOpenGuardian: () => void;
  onCancelDispatch: (result: {
    fee: number;
    refund: number;
    distanceMiles: number;
    reason: string;
  }) => void;
}

export const LiveTelemetryView: React.FC<LiveTelemetryViewProps> = ({
  booking,
  onUpdateBooking,
  onViewInvoice,
  onOpenGuardian,
  onCancelDispatch,
}) => {
  // Telemetry animation state
  const [distanceKm, setDistanceKm] = useState(booking.distanceKm || 2.4);
  const [etaSeconds, setEtaSeconds] = useState(booking.etaSecondsRemaining || 680);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  
  // Proximity-based Cancellation State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Conversion: 1 km = 0.621371 miles
  const distanceMiles = Number((distanceKm * 0.621371).toFixed(2));
  const isProximityLate = distanceMiles <= 0.5;
  const cancellationFee = isProximityLate ? 25.0 : 0.0;
  const refundAmount = Number((75.0 - cancellationFee).toFixed(2));
  const [smsMessages, setSmsMessages] = useState<Array<{ sender: 'user' | 'tech'; text: string; time: string }>>([
    { sender: 'tech', text: `Hello Vishnu, this is Rajesh from ZapFix. I've accepted your emergency dispatch and I'm en route with full diagnostic gear. ETA ~11 mins.`, time: '10:20 AM' },
  ]);
  const [newSmsInput, setNewSmsInput] = useState('');
  
  // Gate notification banner
  const [gateNotification, setGateNotification] = useState<string | null>(null);

  // Parts proposal state
  const [parts, setParts] = useState<ProposedPart[]>(booking.proposedParts || []);
  
  // Step 7: After Photo & Signature
  const [afterPhotoPreview, setAfterPhotoPreview] = useState<string | null>(booking.afterPhotoUrl || null);
  const [afterSha256, setAfterSha256] = useState<string>(booking.afterPhotoSha256 || '');
  const [signatureCanvasData, setSignatureCanvasData] = useState<string | null>(booking.signatureDataUrl || null);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Telemetry vehicle progress ratio (0 = start, 1 = arrived)
  const progressRatio = Math.max(0, Math.min(1, 1 - distanceKm / 2.4));

  // Live timer tick effect
  useEffect(() => {
    if (booking.status === 'LIVE_TELEMETRY' && distanceKm > 0) {
      const interval = setInterval(() => {
        setDistanceKm((prev) => {
          const next = Math.max(0, +(prev - 0.05).toFixed(2));
          if (next === 0) {
            handleTriggerArrival();
          }
          return next;
        });

        setEtaSeconds((prev) => Math.max(0, prev - 15));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [booking.status, distanceKm]);

  // Call simulation timer
  useEffect(() => {
    let callTimer: NodeJS.Timeout;
    if (isCalling) {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [isCalling]);

  // STEP 6: TRIGGER ARRIVAL ON 0 DISTANCE OR BUTTON CLICK
  const handleTriggerArrival = () => {
    setDistanceKm(0);
    setEtaSeconds(0);
    
    // Arrival Alert SMS & notification
    const alertMsg = `Technician Rajesh Shinde has arrived at your gate! Ephemeral PIN [${booking.gatePasscode}] revealed to technician.`;
    setGateNotification(alertMsg);
    setSmsMessages((prev) => [
      ...prev,
      {
        sender: 'tech',
        text: `I've pulled up to the front entrance gate. Entering gate passcode now. See you in a minute!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    const updated: DispatchBooking = {
      ...booking,
      status: 'ARRIVED_ON_SITE',
      distanceKm: 0,
      etaSecondsRemaining: 0,
      gateAlertTriggered: true,
      arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onUpdateBooking(updated);

    // Auto shift to WORKING_ON_SITE after 2.5 seconds
    setTimeout(() => {
      const workingUpdated: DispatchBooking = {
        ...updated,
        status: 'WORKING_ON_SITE',
      };
      onUpdateBooking(workingUpdated);
    }, 2500);
  };

  const handleTogglePart = (partId: string) => {
    const updatedParts = parts.map((p) =>
      p.id === partId ? { ...p, approved: !p.approved } : p
    );
    setParts(updatedParts);
  };

  const handleCaptureAfterPhoto = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    const stamp = `SHA256:${hash.substring(0, 16)}...${hash.substring(48)}`;
    const photo = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80';
    setAfterPhotoPreview(photo);
    setAfterSha256(stamp);

    onUpdateBooking({
      ...booking,
      afterPhotoUrl: photo,
      afterPhotoSha256: stamp,
      afterPhotoTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC+05:30',
    });
  };

  // Canvas drawing handlers for Touch Digital Signature Pad
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsSigning(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#9B51E0';
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isSigning && signatureCanvasRef.current) {
      setIsSigning(false);
      setSignatureCanvasData(signatureCanvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureCanvasData(null);
    }
  };

  // Settle Escrow & Finalize Invoice
  const handleFinalizeWorkAndInvoice = () => {
    const diagnosticFee = 75.0;
    const partsTotal = parts
      .filter((p) => p.approved)
      .reduce((sum, p) => sum + p.price, 0);
    const laborFee = 45.0;
    const subtotal = diagnosticFee + partsTotal + laborFee;
    const vatAmount = +(subtotal * 0.08).toFixed(2);
    const totalAmount = +(subtotal + vatAmount).toFixed(2);

    const chars = '0123456789ABCDEF';
    let seal = 'ZAP-AUDIT-SEAL-';
    for (let i = 0; i < 16; i++) {
      seal += chars[Math.floor(Math.random() * chars.length)];
    }

    const settledBooking: DispatchBooking = {
      ...booking,
      status: 'SETTLED_INVOICE',
      escrowStatus: 'CHARGED_FINAL',
      proposedParts: parts,
      afterPhotoUrl: afterPhotoPreview || undefined,
      afterPhotoSha256: afterSha256 || undefined,
      signatureDataUrl: signatureCanvasData || undefined,
      signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      invoice: {
        invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        diagnosticFee,
        partsTotal,
        laborFee,
        subtotal,
        vatAmount,
        totalAmount,
        taxId: 'GSTIN27AABCP9012K1Z9',
        sha256VerificationSeal: seal,
      },
    };

    onUpdateBooking(settledBooking);
    onViewInvoice();
  };

  const handleSendSms = () => {
    if (!newSmsInput.trim()) return;
    const userMsg = {
      sender: 'user' as const,
      text: newSmsInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setSmsMessages((prev) => [...prev, userMsg]);
    setNewSmsInput('');

    // Simulate pro auto reply
    setTimeout(() => {
      setSmsMessages((prev) => [
        ...prev,
        {
          sender: 'tech',
          text: `Got it Vishnu! I have the spare parts loaded in the van and I'm watching the road navigation.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  const formatEta = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      {/* Gate Arrival Push Notification Banner */}
      {gateNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-black tracking-wider">Gate Geofence Alert</div>
              <p className="text-xs font-semibold">{gateNotification}</p>
            </div>
          </div>
          <button
            onClick={() => setGateNotification(null)}
            className="p-1 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP LIVE STATUS BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {booking.status === 'LIVE_TELEMETRY' && 'LIVE VEHICLE TELEMETRY'}
              {booking.status === 'ARRIVED_ON_SITE' && 'PRO ARRIVED AT GATE'}
              {booking.status === 'WORKING_ON_SITE' && 'ON-SITE DIAGNOSTIC & WORK'}
              {booking.status === 'AFTER_PHOTO_SIGNATURE' && 'REPAIR COMPLETE • SIGN OFF'}
              {booking.status === 'SETTLED_INVOICE' && 'ESCROW SETTLED • TAX INVOICE'}
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {booking.category.name}
          </h2>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-purple-500" />
            {booking.location.addressLine1}, {booking.location.city}
          </p>
        </div>

        <button
          onClick={onOpenGuardian}
          className="px-3 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span>Safety Triage</span>
        </button>
      </div>

      {/* STEP 5: INTERACTIVE LIVE MAP ROUTE TELEMETRY */}
      <div className="relative rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl h-80 sm:h-96">
        
        {/* SVG Live Map Graphic */}
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mapGrid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#9B51E0" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Street Grid */}
          <rect width="600" height="400" fill="url(#mapGrid)" />
          
          {/* Subtle City Blocks */}
          <path d="M 50 40 L 160 40 L 150 120 L 40 120 Z" fill="#141C36" />
          <path d="M 190 30 L 320 30 L 310 110 L 180 110 Z" fill="#141C36" />
          <path d="M 350 40 L 550 40 L 540 140 L 340 140 Z" fill="#141C36" />
          <path d="M 50 170 L 180 170 L 170 280 L 40 280 Z" fill="#141C36" />
          <path d="M 390 170 L 560 170 L 550 330 L 380 330 Z" fill="#141C36" />
          <path d="M 80 320 L 260 320 L 250 380 L 70 380 Z" fill="#141C36" />

          {/* Secondary streets */}
          <line x1="0" y1="140" x2="600" y2="140" stroke="#253257" strokeWidth="3" />
          <line x1="0" y1="300" x2="600" y2="300" stroke="#253257" strokeWidth="3" />
          <line x1="180" y1="0" x2="180" y2="400" stroke="#253257" strokeWidth="3" />
          <line x1="360" y1="0" x2="360" y2="400" stroke="#253257" strokeWidth="3" />

          {/* Glowing Dispatch Route Path */}
          <path
            d="M 100 80 Q 220 90 280 190 T 480 320"
            stroke="url(#roadGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            strokeDasharray="8 6"
          />

          {/* Destination Pin (Vishnu's Residence in Pune) */}
          <g transform="translate(480, 320)">
            <circle r="18" fill="rgba(155, 81, 224, 0.25)" className="animate-ping" />
            <circle r="10" fill="#9B51E0" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="14" y="5" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              Service Location
            </text>
          </g>

          {/* Origin / Depot */}
          <g transform="translate(100, 80)">
            <circle r="6" fill="#38BDF8" opacity="0.6" />
            <text x="-70" y="-8" fill="#94A3B8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
              ZapFix Hub #12
            </text>
          </g>

          {/* Moving Pro Vehicle Marker based on progressRatio */}
          {(() => {
            // Parametric curve position
            const t = progressRatio;
            const px = 100 + (480 - 100) * t;
            const py = 80 + (320 - 80) * t + Math.sin(t * Math.PI) * 45;

            return (
              <g transform={`translate(${px}, ${py})`}>
                <circle r="22" fill="rgba(0, 210, 255, 0.2)" />
                <circle r="14" fill="#00D2FF" stroke="#FFFFFF" strokeWidth="2.5" className="shadow-lg" />
                {/* Vehicle icon inside */}
                <path
                  d="M -6 -2 L -3 -6 L 3 -6 L 6 -2 L 6 3 L -6 3 Z"
                  fill="#0B132B"
                />
                <circle cx="-3" cy="4" r="1.5" fill="#0B132B" />
                <circle cx="3" cy="4" r="1.5" fill="#0B132B" />

                {/* Floating label */}
                <rect x="-42" y="-32" width="84" height="20" rx="10" fill="#0F172A" stroke="#00D2FF" strokeWidth="1" />
                <text x="0" y="-18" fill="#00D2FF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  Unit #104 ({distanceKm} km)
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Overlay Telemetry HUD Floating Card */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-80 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {booking.status === 'LIVE_TELEMETRY' ? 'En Route Navigation' : 'On Site Telemetry'}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-purple-400">
              GPS • RTK Lock
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-slate-800">
            <div className="p-2 rounded-xl bg-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining ETA</span>
              <div className="text-base font-black text-cyan-400">
                {distanceKm === 0 ? 'ARRIVED' : formatEta(etaSeconds)}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Distance</span>
              <div className="text-base font-black text-white">
                {distanceMiles} mi
              </div>
              <span className="text-[9px] text-slate-400 block -mt-0.5">({distanceKm} km)</span>
            </div>
          </div>

          {/* Outlined "Cancel Dispatch" button below the ETA card */}
          {booking.status === 'LIVE_TELEMETRY' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-rose-500/50 hover:border-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 text-xs font-black tracking-wide flex items-center justify-between transition-all shadow-md active:scale-98"
            >
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Cancel Dispatch</span>
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  isProximityLate
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {isProximityLate ? '$25 Transit Fee' : '$0 Free Cancel'}
              </span>
            </button>
          )}

          {/* Quick Proximity Distance Simulators to easily test Case A & Case B */}
          {booking.status === 'LIVE_TELEMETRY' && (
            <div className="pt-1 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[9px] uppercase font-bold text-slate-400 px-0.5">
                <span>Distance Simulator:</span>
                <span className={isProximityLate ? 'text-amber-400' : 'text-emerald-400'}>
                  {isProximityLate ? 'Case B (≤ 0.5 mi)' : 'Case A (> 0.5 mi)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setDistanceKm(0.6); // 0.6 km = 0.37 miles <= 0.5 mi (Case B)
                    setEtaSeconds(90);
                  }}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    isProximityLate
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                      : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                  title="Test Case B: Proximity <= 0.5 miles ($25 transit fee)"
                >
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Test ≤ 0.5 mi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDistanceKm(2.4); // 2.4 km = 1.49 miles > 0.5 mi (Case A)
                    setEtaSeconds(680);
                  }}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    !isProximityLate
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                      : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                  title="Test Case A: Distance > 0.5 miles ($0 free cancellation)"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Test &gt; 0.5 mi</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleTriggerArrival}
                className="w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Navigation className="w-3 h-3" />
                <span>Simulate Arrival (0 mi)</span>
              </button>
            </div>
          )}
        </div>

        {/* Technician Micro Badge at bottom */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={booking.technician.avatar}
              alt={booking.technician.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{booking.technician.name}</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">
                  ★ {booking.technician.rating}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {booking.technician.vehicleModel} • {booking.technician.vehiclePlate}
              </p>
            </div>
          </div>

          {/* Direct Call & SMS Pro Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCalling(true)}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Pro</span>
            </button>

            <button
              onClick={() => setIsSmsOpen(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send SMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* OUTLINED CANCEL DISPATCH BAR BELOW MAP CONTAINER */}
      {booking.status === 'LIVE_TELEMETRY' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
              isProximityLate
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  Dispatch Cancellation Policy
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isProximityLate
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {isProximityLate ? '≤ 0.5 mi (Late Proximity)' : '> 0.5 mi (100% Free)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Live Distance: <strong>{distanceMiles} miles</strong> ({distanceKm} km) • {isProximityLate ? '$25 transit compensation applies' : 'Full $75.00 escrow refund with $0 fee'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2.5 rounded-2xl border-2 border-rose-500/40 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shrink-0 active:scale-98 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Cancel Dispatch</span>
            <span className="text-[10px] opacity-80">
              ({isProximityLate ? '$25 fee' : '$0 fee'})
            </span>
          </button>
        </div>
      )}

      {/* STEP 6 & 7: ON-SITE WORK & PARTS PROPOSAL */}
      {(booking.status === 'ARRIVED_ON_SITE' ||
        booking.status === 'WORKING_ON_SITE' ||
        booking.status === 'AFTER_PHOTO_SIGNATURE') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" /> STEP 6: On-Site Inspection
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Technician Parts &amp; Work Proposal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pro proposes required parts. Toggle items to approve or decline before final sign-off.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Pre-Auth Hold:</span>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">$75.00</div>
            </div>
          </div>

          {/* Interactive Parts List */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic &amp; Replacement Components:
            </div>
            
            {parts.map((part) => (
              <div
                key={part.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  part.approved
                    ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {part.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {part.partNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Warranty: {part.warranty} • OEM Certified
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ${part.price.toFixed(2)}
                  </span>
                  
                  {/* Toggle Part Approval */}
                  <button
                    onClick={() => handleTogglePart(part.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      part.approved
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {part.approved ? 'Approved ✓' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Disclaimer as requested */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>No immediate payment deduction.</strong> Final amount settled via escrow upon your touchscreen signature below.
              </span>
            </div>
          </div>

          {/* STEP 7: AFTER PHOTO & TOUCH SIGNATURE PAD */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" /> STEP 7: Work Completion &amp; Sign-Off
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Completed Work Proof &amp; Customer Signature
              </h3>
            </div>

            {/* After Photo Capture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Photo Review */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  BEFORE PHOTO (Initial Diagnostic)
                </span>
                {booking.beforePhotoUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600">
                    <img
                      src={booking.beforePhotoUrl}
                      alt="Before Repair"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 truncate max-w-[90%]">
                      {booking.beforePhotoSha256 || 'SHA-256 Verified'}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500 italic">
                    Skipped for Emergency Life-Safety
                  </div>
                )}
              </div>

              {/* After Photo Capture */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-2">
                  AFTER PHOTO (Repair Completed Proof)
                </span>
                {afterPhotoPreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-400">
                    <img
                      src={afterPhotoPreview}
                      alt="After Repair"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-300 truncate max-w-[90%]">
                      {afterSha256}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleCaptureAfterPhoto}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex flex-col items-center justify-center gap-1.5 transition-all"
                  >
                    <Camera className="w-6 h-6 animate-pulse" />
                    <span className="text-xs font-bold">Capture AFTER Repair Photo</span>
                    <span className="text-[10px] text-slate-400">Generates instant SHA-256 seal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Touch Digital Signature Pad */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-purple-500" />
                  Customer Electronic Signature (Sign with finger or mouse)
                </label>
                <button
                  onClick={clearSignature}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Clear Pad
                </button>
              </div>

              <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-hidden shadow-inner">
                <canvas
                  ref={signatureCanvasRef}
                  width={560}
                  height={130}
                  className="w-full h-32 cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!signatureCanvasData && !isSigning && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
                    Draw signature here: Vishnu Patil • {new Date().toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Settle Escrow & Finalize Invoice Button */}
            <button
              onClick={handleFinalizeWorkAndInvoice}
              disabled={!afterPhotoPreview}
              className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-2xl flex items-center justify-center gap-2 transition-all ${
                afterPhotoPreview
                  ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-600 hover:opacity-95 shadow-purple-500/30'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Settle Escrow, Apply Signature &amp; Generate VAT Invoice</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

      {/* AUDIO PHONE CALL SIMULATION MODAL */}
      {isCalling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white text-center space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                ZapFix Encrypted Telephony
              </span>
              <h4 className="text-xl font-black">{booking.technician.name}</h4>
              <p className="text-xs text-slate-400">{booking.technician.phone}</p>
            </div>

            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <img
                src={booking.technician.avatar}
                alt={booking.technician.name}
                className="w-full h-full rounded-full object-cover border-4 border-emerald-500 relative z-10"
              />
            </div>

            {/* Animated Audio Wave Bars */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[40, 75, 100, 60, 90, 45, 80, 55, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-emerald-400 rounded-full transition-all duration-300"
                  style={{ height: `${h}%`, animation: 'pulse 1s infinite alternate' }}
                />
              ))}
            </div>

            <div className="font-mono text-sm text-slate-300">
              00:{callDuration < 10 ? `0${callDuration}` : callDuration}
            </div>

            <button
              onClick={() => setIsCalling(false)}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/40 transition-transform active:scale-95"
            >
              <Phone className="w-6 h-6 rotate-135" />
            </button>
          </div>
        </div>
      )}

      {/* SMS DIRECT MESSAGING DRAWER */}
      {isSmsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={booking.technician.avatar}
                  alt={booking.technician.name}
                  className="w-9 h-9 rounded-full object-cover border border-cyan-400"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{booking.technician.name}</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    En Route Dispatch Active
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSmsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950">
              {smsMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick SMS templates */}
            <div className="p-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px]">
              {['Building gate is open', 'Power is shut off at breaker', 'Pets are in bedroom'].map((q) => (
                <button
                  key={q}
                  onClick={() => setNewSmsInput(q)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap hover:bg-purple-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={newSmsInput}
                onChange={(e) => setNewSmsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSms()}
                placeholder="Type safety note or entry direction..."
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendSms}
                className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROXIMITY-BASED CANCELLATION CONFIRMATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden space-y-0">
            {/* Dynamic Modal Header */}
            <div
              className={`p-5 text-white ${
                isProximityLate
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600'
                  : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900'
              } relative`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isProximityLate
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {isProximityLate ? 'CASE B • PROXIMITY CANCELLATION' : 'CASE A • EARLY CANCELLATION'}
                    </span>
                    <h3 className="text-base font-black text-white mt-0.5">
                      Confirm Dispatch Cancellation?
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Distance Display Callout */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-500 font-medium">Technician Current Distance:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {distanceMiles} miles away ({distanceKm} km)
                </span>
              </div>

              {/* Exact required modal message */}
              <div
                className={`p-4 rounded-2xl border ${
                  isProximityLate
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                <p className="text-xs font-bold leading-relaxed">
                  {isProximityLate
                    ? '⚠️ Technician is within 0.5 miles of your location. A $25.00 transit compensation fee will be deducted for the technician, and the remaining $50.00 will be refunded.'
                    : 'Technician is still far en route. Your full $75.00 escrow pre-auth hold will be released with $0 penalty.'}
                </p>
              </div>

              {/* Financial Escrow Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Escrow Pre-Auth Hold:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">$75.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>
                    {isProximityLate ? 'Technician Transit Protection Fee:' : 'Cancellation Penalty:'}
                  </span>
                  <span
                    className={`font-bold ${
                      isProximityLate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isProximityLate ? '-$25.00 USD' : '$0.00 (Free)'}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                  <span>Net Refund to Customer:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ${refundAmount.toFixed(2)} USD
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  Credit applied immediately back to Visa •••• 4917
                </div>
              </div>

              {/* Action Buttons: Keep Dispatch and Confirm Cancellation */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                  className="py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all shadow-sm"
                >
                  Keep Dispatch
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCancelling(true);
                    setTimeout(() => {
                      setIsCancelling(false);
                      setShowCancelModal(false);
                      onCancelDispatch({
                        fee: cancellationFee,
                        refund: refundAmount,
                        distanceMiles,
                        reason: isProximityLate
                          ? 'Proximity Cancellation (<= 0.5 miles)'
                          : 'Early Cancellation (> 0.5 miles)',
                      });
                    }, 400);
                  }}
                  disabled={isCancelling}
                  className={`py-3 rounded-2xl font-black text-xs text-white shadow-lg transition-all flex items-center justify-center gap-1.5 ${
                    isProximityLate
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:opacity-95 shadow-amber-600/25'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  }`}
                >
                  {isCancelling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Releasing Hold...</span>
                    </>
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
