export type ServiceStatus =
  | 'SELECT_SERVICE'
  | 'DIAGNOSTIC_CAMERA'
  | 'ACCESS_AND_PETS'
  | 'LOCATION_CONFIRM'
  | 'ESCROW_PREAUTH'
  | 'LIVE_TELEMETRY'
  | 'ARRIVED_ON_SITE'
  | 'WORKING_ON_SITE'
  | 'AFTER_PHOTO_SIGNATURE'
  | 'SETTLED_INVOICE';

export interface TradeCategory {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  eta: string;
  baseDiagnosticFee: number;
  iconName: string;
  gradient: string;
  badge?: string;
  description: string;
  sampleHazards: string[];
}

export interface ProposedPart {
  id: string;
  name: string;
  price: number;
  approved: boolean;
  partNumber: string;
  warranty: string;
}

export interface TechnicianInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalJobs: number;
  vehicleModel: string;
  vehiclePlate: string;
  avatar: string;
  certifications: string[];
  lat: number;
  lng: number;
}

export interface UserLocation {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  contactName: string;
  phone: string;
  isDefault?: boolean;
}

export interface DispatchBooking {
  id: string;
  category: TradeCategory;
  status: ServiceStatus;
  createdAt: string;
  
  // Step 1: Camera Diagnostic
  beforePhotoUrl?: string;
  beforePhotoSha256?: string;
  beforePhotoTimestamp?: string;
  skippedPhoto?: boolean;
  hazardDescription?: string;

  // Step 2: Access & Pets
  gatePasscode: string;
  petsOnPremises: boolean;
  petType?: string;

  // Step 3: Location
  location: UserLocation;

  // Step 4: Escrow Pre-Auth
  preAuthAmount: number; // 75.00
  escrowStatus: 'HOLD_AUTHORIZED' | 'CHARGED_FINAL' | 'CANCELLED';
  preAuthHoldId: string;

  // Step 5 & 6: Live Telemetry & On-Site
  technician: TechnicianInfo;
  etaMinutes: number;
  etaSecondsRemaining: number;
  distanceKm: number;
  gateAlertTriggered: boolean;
  arrivedAt?: string;

  // Step 6 & 7: Parts & After photo & Signature
  proposedParts: ProposedPart[];
  afterPhotoUrl?: string;
  afterPhotoSha256?: string;
  afterPhotoTimestamp?: string;
  signatureDataUrl?: string;
  signedAt?: string;

  // Step 8: Invoice
  invoice?: {
    invoiceNumber: string;
    date: string;
    diagnosticFee: number;
    partsTotal: number;
    laborFee: number;
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
    taxId: string;
    sha256VerificationSeal: string;
  };
}

export interface SafetyTriage {
  severityLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  estimatedResponsePriority: string;
  immediateActionTitle: string;
  stepByStepContainment: string[];
  criticalWarnings: string[];
  doNotTouchList: string[];
  transitPrepChecklist: string[];
  summaryGuidance: string;
}

export interface BannerAdConfig {
  productDescription: string;
  productUrl: string;
  category: string;
  bannerType: string;
  aspectRatio: string;
  resolution: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  badgeText: string;
  accentColor: string;
  gradient: { from: string; to: string };
  keyBenefitPoints: string[];
  imageCreativePrompt: string;
  designStyle: string;
}
