import { TradeCategory, UserLocation, TechnicianInfo } from '../types';

export const TRADE_CATEGORIES: TradeCategory[] = [
  {
    id: 'electrical',
    name: 'Electrical Emergency',
    shortName: 'Electrical',
    tag: 'Sparking / Outage',
    eta: '8-12 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Zap',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    badge: 'Code Red',
    description: 'Arcing breakers, panel sparks, main blackout, exposed live conduits & burning outlets.',
    sampleHazards: ['Main breaker sparking violently', 'Burning plastic smell from bedroom wall outlet', 'Total house blackout with buzzing fuse board']
  },
  {
    id: 'plumbing',
    name: 'Plumbing & Pipe Burst',
    shortName: 'Plumbing',
    tag: 'Active Flood / Burst',
    eta: '10-15 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Droplets',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    badge: 'High Priority',
    description: 'High-pressure pipe fractures, indoor flooding, sewage backflow, seized shutoff valves.',
    sampleHazards: ['Kitchen sink line severed, spraying 40 PSI', 'Ceiling drywall collapsing from upstairs bathroom leak', 'Main shutoff valve rusted open during leak']
  },
  {
    id: 'hvac',
    name: 'HVAC & AC Climate Failure',
    shortName: 'HVAC & AC',
    tag: 'Heatwave / Freezing',
    eta: '15-20 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Flame',
    gradient: 'from-rose-500 via-purple-500 to-cyan-500',
    badge: '24/7 Crew',
    description: 'Furnace gas lockout, AC compressor seizure during heatwaves, refrigerant leaks.',
    sampleHazards: ['AC unit smoking and rattling loudly', 'Furnace blowing cold air during sub-zero night', 'Refrigerant hissing sound near indoor coil']
  },
  {
    id: 'automotive',
    name: 'Automotive Roadside Rescue',
    shortName: 'Roadside Auto',
    tag: 'Stranded / Breakdown',
    eta: '12-18 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Car',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    badge: 'GPS Mobile Unit',
    description: 'Dead 12V/EV battery jump, highway blowout tire change, lockout, coolant overheat.',
    sampleHazards: ['EV 12V auxiliary system bricked in parking basement', 'Blown tire on shoulder of express highway', 'Keys locked inside running vehicle']
  },
  {
    id: 'mobile-tech',
    name: 'Mobile & Tech Hardware Repair',
    shortName: 'Mobile & Tech',
    tag: 'Broken Screen / Liquid',
    eta: '15-25 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Smartphone',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    badge: 'Mobile Lab Van',
    description: 'Crushed OLED displays, liquid submersion revival, micro-soldering, emergency data rescue.',
    sampleHazards: ['Phone dropped in water, battery expanding', 'Shattered glass cutting fingertips, digitizer unresponsive', 'Tablet USB-C port burnt with smoke']
  },
  {
    id: 'gas-leak',
    name: 'Gas Leak & Odor Hazard',
    shortName: 'Gas Hazard',
    tag: 'Methane / Propane',
    eta: '6-10 min',
    baseDiagnosticFee: 75.0,
    iconName: 'AlertTriangle',
    gradient: 'from-red-500 via-amber-600 to-yellow-500',
    badge: 'Life Safety',
    description: 'Rotten egg sulfur odors, stove line rupture, pilot light failure, meter hissing.',
    sampleHazards: ['Strong rotten egg sulfur odor in basement', 'Gas meter whistling behind house', 'Furnace manifold gas smell after ignition click']
  },
  {
    id: 'locksmith',
    name: 'Locksmith & Security Breach',
    shortName: 'Locksmith',
    tag: 'Locked Out / Damaged',
    eta: '10-15 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Key',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    badge: 'Verified ID',
    description: 'Broken key extraction, smart lock lockouts, damaged deadbolts after forced entry.',
    sampleHazards: ['Key snapped clean inside front deadbolt cylinder', 'Smart lock electronic keypad dead, locked outside at night', 'Door jamb splintered and lock mechanism seized']
  },
  {
    id: 'appliance',
    name: 'Appliance Emergency Breakdown',
    shortName: 'Appliances',
    tag: 'Fridge / Washer',
    eta: '20-30 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Wrench',
    gradient: 'from-blue-500 via-indigo-500 to-sky-400',
    badge: 'Parts On-Board',
    description: 'Commercial/residential refrigerator thermal runaway, washing machine drum floods.',
    sampleHazards: ['Commercial walk-in cooler temp climbing above 55°F', 'Washing machine spewing soapy water across laundry room floor', 'Oven interior element flashing blinding white spark']
  },
  {
    id: 'flood-extraction',
    name: 'Flood & Sump Extraction',
    shortName: 'Flood Extraction',
    tag: 'Submersible Pumps',
    eta: '15-20 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Waves',
    gradient: 'from-cyan-500 via-teal-600 to-blue-700',
    badge: 'Heavy Rig',
    description: 'Basement flood evacuation, failed sump pump, rainwater ingress, structural drying.',
    sampleHazards: ['Basement has 5 inches of rising stormwater', 'Sump pump humming but not moving water, float stuck', 'Patio French drains overflowing into living room']
  },
  {
    id: 'roofing',
    name: 'Roofing & Storm Shield',
    shortName: 'Roof & Storm',
    tag: 'Tarping / Wind Damage',
    eta: '25-35 min',
    baseDiagnosticFee: 75.0,
    iconName: 'ShieldAlert',
    gradient: 'from-slate-600 via-zinc-700 to-stone-800',
    badge: 'Weather Pro',
    description: 'Emergency waterproof tarping, blown ridge shingles, fallen branch puncture.',
    sampleHazards: ['Tree limb punctured roof above master bedroom', 'High wind ripped shingles, rain pouring into attic insulation', 'Skylight glass seal shattered during hail storm']
  },
  {
    id: 'solar-battery',
    name: 'Solar & Battery Storage Fault',
    shortName: 'Solar Storage',
    tag: 'Inverter / Thermal',
    eta: '20-30 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Sun',
    gradient: 'from-yellow-400 via-orange-500 to-amber-600',
    badge: 'Clean Energy',
    description: 'High-voltage inverter trip, lithium battery fault warning, DC isolator arcing.',
    sampleHazards: ['Home battery warning alarm beeping with high-temp red LED', 'Rooftop solar DC rapid shutdown failed', 'Solar inverter emitting buzzing buzz and hot smell']
  },
  {
    id: 'commercial-kitchen',
    name: 'Commercial Kitchen & Cold Storage',
    shortName: 'Comm. Kitchen',
    tag: 'Restaurant Emergency',
    eta: '15-25 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Utensils',
    gradient: 'from-rose-600 via-red-600 to-orange-600',
    badge: 'HACCP Pro',
    description: 'Commercial fryers, walk-in blast freezers, exhaust hood motor failures.',
    sampleHazards: ['Restaurant walk-in freezer compressor seized with $15,000 food inventory', 'Kitchen grease hood exhaust fan motor died before dinner rush', 'Commercial gas range regulator locked shut']
  },
  {
    id: 'glass-breach',
    name: 'Glass & Glazing Breach',
    shortName: 'Glass & Glazing',
    tag: 'Board-up / Security',
    eta: '15-20 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Maximize2',
    gradient: 'from-sky-400 via-blue-600 to-slate-700',
    badge: 'Security Shield',
    description: 'Storefront window shatter, sliding glass door derailment, emergency board-up.',
    sampleHazards: ['Front double-pane glass shattered by impact', 'Balcony sliding glass door fallen out of frame', 'Storefront tempered glass spiderwebbed and unstable']
  },
  {
    id: 'sewer-biohazard',
    name: 'Sewer & Biohazard Remediation',
    shortName: 'Sewer & Bio',
    tag: 'Hydro-Jetting',
    eta: '15-25 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Biohazard',
    gradient: 'from-stone-700 via-neutral-800 to-zinc-900',
    badge: 'HazMat Certified',
    description: 'Main sewer line backup, hazardous drain regurgitation, commercial grease trap burst.',
    sampleHazards: ['Raw sewage backing up into ground floor bathtub and floor drain', 'Main line clogged with tree roots, multiple toilets overflowing', 'Grease interceptor overflowing into commercial corridor']
  },
  {
    id: 'generator',
    name: 'Generator & Backup Power',
    shortName: 'Generators',
    tag: 'Transfer Switch Fail',
    eta: '20-30 min',
    baseDiagnosticFee: 75.0,
    iconName: 'Cpu',
    gradient: 'from-teal-500 via-cyan-600 to-blue-800',
    badge: 'Critical Power',
    description: 'Automatic Transfer Switch (ATS) lockout, standby diesel governor fault, phase drop.',
    sampleHazards: ['Whole-home standby generator cranking but failing to ignite during grid blackout', 'Automatic transfer switch stuck between grid and generator', 'Industrial diesel genset tripping on low oil pressure sensor']
  }
];

export const SAVED_LOCATIONS: UserLocation[] = [
  {
    id: 'loc-1',
    label: 'Primary Residence (Current)',
    addressLine1: 'Lane No 2, Phadtare Complex, near Pmpl Bus Depo',
    addressLine2: 'Phursungi, Hadapsar',
    city: 'Pune, Maharashtra',
    pincode: '412308',
    contactName: 'Vishnu Patil',
    phone: '+91 9322421917',
    isDefault: true
  },
  {
    id: 'loc-2',
    label: 'College (ABC Trainings)',
    addressLine1: 'ABC Trainings, Besides Lohiya Nagar',
    addressLine2: 'Magarpatta City Rd, Hadapsar',
    city: 'Pune, Maharashtra',
    pincode: '411028',
    contactName: 'Vishnu Patil',
    phone: '+91 9322421917'
  },
  {
    id: 'loc-3',
    label: 'Authorized ABC IT Trainings Pune',
    addressLine1: 'Pune - Solapur Rd, near Savli Corner',
    addressLine2: 'Laxmi Colony, Hadapsar',
    city: 'Pune, Maharashtra',
    pincode: '411028',
    contactName: 'Vishnu Patil',
    phone: '+91 9322421917'
  },
  {
    id: 'loc-4',
    label: 'Seasons Mall Tech Lab',
    addressLine1: 'Magarpatta, Hadapsar',
    addressLine2: 'Tower 4 Commercial Office',
    city: 'Pune, Maharashtra',
    pincode: '411028',
    contactName: 'Vishnu Patil',
    phone: '+91 9322421917'
  }
];

export const MOCK_TECHNICIANS: TechnicianInfo[] = [
  {
    id: 'tech-1',
    name: 'Rajesh Shinde',
    phone: '+91 98201 44821',
    rating: 4.98,
    totalJobs: 1420,
    vehicleModel: 'ZapFix Rapid Response Utility Van (Unit #104)',
    vehiclePlate: 'MH 12 QX 4902',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    certifications: ['Master Electrician A-Grade', 'Red Cross First Aid', 'OSHA 30 Safety'],
    lat: 18.5089,
    lng: 73.9260
  },
  {
    id: 'tech-2',
    name: 'Amit Deshmukh',
    phone: '+91 94220 18239',
    rating: 4.95,
    totalJobs: 980,
    vehicleModel: 'ZapFix Hydro-Pneumatic Rig (#208)',
    vehiclePlate: 'MH 14 BG 7104',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    certifications: ['Master Plumbing License', 'Backflow Prevention Certified'],
    lat: 18.4980,
    lng: 73.9350
  }
];

export const USER_PROFILE_DEFAULT = {
  name: 'Vishnu Patil',
  phone: '+91 9322421917',
  email: 'vishnu.patil@zapfix.global',
  gender: 'Male',
  dob: '14 October 1994',
  memberSince: 'March 2023',
  emergencyContact: '+91 9881123456 (Dr. Patil / Sister)',
  rating: 5.0,
  preAuthBalanceHold: 75.0,
  tpaInsuranceStatus: 'Active Pre-Cleared ($5,000 Coverage)',
  preconfiguredApiKey: 'AQ.Ab8RN6J8pLQD7hmYYxvck1oZlP6C-8YRhs2O1ZBM6fv88zHhqg'
};

export const BANNER_AD_PRESETS = [
  {
    id: 'rect-300-250',
    name: 'Medium Rectangle (IAB Standard)',
    dimensions: '300x250',
    aspectRatio: '6:5',
    category: 'Display / Sidebar',
    recommendedUse: 'Highest click-through rate across Google Display Network & desktop sidebars'
  },
  {
    id: 'leader-728-90',
    name: 'Leaderboard Banner',
    dimensions: '728x90',
    aspectRatio: '8:1',
    category: 'Display Top / Header',
    recommendedUse: 'Prime header banner placement above website fold'
  },
  {
    id: 'sky-160-600',
    name: 'Wide Skyscraper',
    dimensions: '160x600',
    aspectRatio: '1:4',
    category: 'Sidebar Vertical',
    recommendedUse: 'Sticky vertical banner beside articles and web portals'
  },
  {
    id: 'half-300-600',
    name: 'Half Page Monster',
    dimensions: '300x600',
    aspectRatio: '1:2',
    category: 'High Impact',
    recommendedUse: 'Maximum visual engagement for high-ticket emergency conversions'
  },
  {
    id: 'square-1080',
    name: 'Square Ad (1:1 Social / GDN)',
    dimensions: '1080x1080',
    aspectRatio: '1:1',
    category: 'Instagram / Feed',
    recommendedUse: 'Universal square standard for Meta, LinkedIn, and responsive ads'
  },
  {
    id: 'story-1080-1920',
    name: 'Vertical Story / Reel (9:16)',
    dimensions: '1080x1920',
    aspectRatio: '9:16',
    category: 'Stories / TikTok',
    recommendedUse: 'Full-screen mobile immersive emergency booking stories'
  },
  {
    id: 'billboard-970-250',
    name: 'Billboard Ultra (16:9 / 21:9)',
    dimensions: '970x250',
    aspectRatio: '16:9',
    category: 'Hero Display',
    recommendedUse: 'Massive top-of-page brand showcase with high visibility'
  }
];
