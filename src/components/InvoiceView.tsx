import React from 'react';
import {
  FileText,
  Printer,
  Share2,
  CheckCircle,
  ShieldCheck,
  Download,
  ArrowLeft,
  Lock,
  ExternalLink
} from 'lucide-react';
import { DispatchBooking } from '../types';
import { ZapFixLogo } from './ZapFixLogo';

interface InvoiceViewProps {
  booking: DispatchBooking;
  onBackToHome: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ booking, onBackToHome }) => {
  const inv = booking.invoice || {
    invoiceNumber: 'INV-2026-88194',
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    diagnosticFee: 75.0,
    partsTotal: 42.0,
    laborFee: 45.0,
    subtotal: 162.0,
    vatAmount: 12.96,
    totalAmount: 174.96,
    taxId: 'GSTIN27AABCP9012K1Z9',
    sha256VerificationSeal: 'ZAP-AUDIT-SEAL-8F3A79C24B10E659',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `ZapFix Official Invoice #${inv.invoiceNumber}`,
        text: `Official Repair Audit & VAT Invoice for ${booking.category.name} ($${inv.totalAmount.toFixed(2)})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      // Fallback WhatsApp intent share
      const text = encodeURIComponent(
        `ZapFix Global Official Tax Invoice ${inv.invoiceNumber}\nService: ${booking.category.name}\nAmount: $${inv.totalAmount.toFixed(2)}\nAudit Seal: ${inv.sha256VerificationSeal}\nCustomer: Vishnu Patil`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share (WhatsApp / PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Tax Invoice Container */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <ZapFixLogo size="md" withText={true} />
            <p className="text-[11px] text-slate-400 mt-2">
              ZapFix Global Emergency Trade Network Inc.
              <br />
              Reg No: 2026-MH-PUNE-9021 • VAT/GST: {inv.taxId}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs uppercase font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ESCROW SETTLED ✓
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {inv.invoiceNumber}
            </div>
            <p className="text-xs text-slate-400">Date: {inv.date}</p>
          </div>
        </div>

        {/* Client & Dispatch Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Billed To Customer:
            </span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {booking.location.contactName}
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {booking.location.addressLine1}
              <br />
              {booking.location.addressLine2}, {booking.location.city} - {booking.location.pincode}
            </p>
            <p className="text-slate-500 font-mono pt-1">Phone: {booking.location.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Emergency Dispatch Unit:
            </span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {booking.technician.name}
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {booking.technician.vehicleModel}
              <br />
              Reg: {booking.technician.vehiclePlate}
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              Escrow Hold ID: {booking.preAuthHoldId}
            </p>
          </div>
        </div>

        {/* Side-by-Side Audit Photos (Before & After) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              Cryptographic Before &amp; After Photo Audit Proof
            </span>
            <span className="text-[10px] font-mono text-purple-500">
              Tamper-Proof SHA-256 Stamped
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-rose-500 uppercase">1. Before Repair</span>
                <span className="text-slate-400">Diagnostic</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                {booking.beforePhotoUrl ? (
                  <img
                    src={booking.beforePhotoUrl}
                    alt="Before Repair"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-slate-400 italic">
                    Skipped (Extreme Emergency)
                  </div>
                )}
              </div>
              <p className="text-[9px] font-mono text-slate-500 truncate">
                {booking.beforePhotoSha256 || 'SHA256: 4fa9...8c21'}
              </p>
            </div>

            {/* After Photo */}
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-emerald-500 uppercase">2. After Repair</span>
                <span className="text-emerald-600">Certified Fixed</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/40">
                {booking.afterPhotoUrl ? (
                  <img
                    src={booking.afterPhotoUrl}
                    alt="After Repair"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-slate-400 italic">
                    Work Complete Proof
                  </div>
                )}
              </div>
              <p className="text-[9px] font-mono text-slate-500 truncate">
                {booking.afterPhotoSha256 || 'SHA256: 9e3c...7f04'}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Charge Breakdown */}
        <div className="space-y-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider text-left">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Type</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr>
                <td className="py-3 font-semibold text-slate-900 dark:text-white">
                  Emergency Diagnostic Dispatch Fee (Pre-Auth)
                </td>
                <td className="py-3 text-center text-slate-500">Fixed Escrow</td>
                <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                  ${inv.diagnosticFee.toFixed(2)}
                </td>
              </tr>
              {booking.proposedParts
                ?.filter((p) => p.approved)
                .map((part) => (
                  <tr key={part.id}>
                    <td className="py-3 text-slate-800 dark:text-slate-200">
                      Approved OEM Part: {part.name}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        PN: {part.partNumber} • {part.warranty}
                      </span>
                    </td>
                    <td className="py-3 text-center text-slate-500">Approved Hardware</td>
                    <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                      ${part.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              <tr>
                <td className="py-3 text-slate-800 dark:text-slate-200">
                  On-Site Certified Master Trade Labor &amp; Pressure Testing
                </td>
                <td className="py-3 text-center text-slate-500">Labor</td>
                <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                  ${inv.laborFee.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col items-end space-y-1.5 text-xs">
            <div className="flex justify-between w-64 text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${inv.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between w-64 text-slate-600 dark:text-slate-400">
              <span>VAT / Service Tax (8%):</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${inv.vatAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between w-64 text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Total Settled:</span>
              <span className="text-purple-600 dark:text-purple-400">
                ${inv.totalAmount.toFixed(2)} USD
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Pre-Auth Hold ($75) Applied • Balance Charged to Visa 4917
            </span>
          </div>
        </div>

        {/* Digital Signature Audit Seal */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Customer Electronic Signature Verification:
            </span>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Signer: {booking.location.contactName} ({booking.location.phone})
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Audit Seal: {inv.sha256VerificationSeal}
            </div>
          </div>

          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 h-16 w-44 flex items-center justify-center">
            {booking.signatureDataUrl ? (
              <img
                src={booking.signatureDataUrl}
                alt="Customer Signature"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="font-serif italic text-purple-600 font-bold text-sm">
                Vishnu Patil
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
