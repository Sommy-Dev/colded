export type ParcelStatus = 'Out for Delivery' | 'In Transit' | 'Delivered' | 'Exception';
export type ParcelDirection = 'Incoming' | 'Outgoing' | 'Archived';

export interface TrackingCheckpoint {
  id: string;
  title: string;
  location: string;
  postalCode: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface ParcelShipment {
  id: string;
  trackingNumber: string;
  nickname: string;
  carrierService: string;
  status: ParcelStatus;
  direction: ParcelDirection;
  etaWindow: string;
  etaDate: string;
  origin: string;
  destination: string;
  weightKg: number;
  dimensionsCm: string;
  pieces: number;
  signatureRequired: boolean;
  signedBy?: string;
  dutyAmountUsd?: number;
  exceptionReason?: string;
  deliveryInstructions?: string;
  pinned?: boolean;
  checkpoints: TrackingCheckpoint[];
}

export type ColdChainStatus = 'Nominal' | 'Reefer Active' | 'Defrost Warning' | 'Excursion Alarm';

export interface ColdChainUnit {
  id: string;
  unitCode: string;
  manifestTitle: string;
  cargoClass: string;
  corridor: string;
  originHub: string;
  destinationHub: string;
  currentTempC: number;
  setpointTempC: number;
  minSafeTempC: number;
  maxSafeTempC: number;
  humidityPct: number;
  weightKg: number;
  elapsedTime: string;
  gpsCoords: string;
  status: ColdChainStatus;
  statusLabel: string;
  doorIntegrity: 'SEALED' | 'AJAR ALERT';
  sealHash: string;
  sealTimestamp: string;
  sparklineHistory: number[];
  compressorRpm: number;
  batteryVoltage: number;
}

export const INITIAL_PARCELS: ParcelShipment[] = [
  {
    id: 'pkg-1',
    trackingNumber: '7749 2810 4492',
    nickname: 'Precision Avionics Sensor Array',
    carrierService: 'Priority Overnight Express',
    status: 'Out for Delivery',
    direction: 'Incoming',
    etaWindow: '10:30 AM – 12:15 PM',
    etaDate: 'Today, Nov 2',
    origin: 'Memphis, TN 38118',
    destination: 'Boston, MA 02110',
    weightKg: 6.4,
    dimensionsCm: '48 × 34 × 22 cm',
    pieces: 1,
    signatureRequired: true,
    pinned: true,
    deliveryInstructions: 'Deliver to Receiving Dock B — Call ext. 402 upon arrival',
    checkpoints: [
      {
        id: 'cp-1',
        title: 'Shipment Information Sent to Carrier',
        location: 'Memphis, TN',
        postalCode: '38118',
        timestamp: 'Nov 1 · 04:12 PM',
        completed: true,
      },
      {
        id: 'cp-2',
        title: 'Arrived at Sort Facility',
        location: 'Memphis SuperHub, TN',
        postalCode: '38118',
        timestamp: 'Nov 1 · 11:45 PM',
        completed: true,
      },
      {
        id: 'cp-3',
        title: 'Departed National Hub',
        location: 'East Boston Ramp, MA',
        postalCode: '02128',
        timestamp: 'Nov 2 · 05:18 AM',
        completed: true,
      },
      {
        id: 'cp-4',
        title: 'On Vehicle for Delivery',
        location: 'Boston Seaport Station, MA',
        postalCode: '02110',
        timestamp: 'Nov 2 · 07:54 AM',
        completed: true,
        current: true,
      },
      {
        id: 'cp-5',
        title: 'Final Delivery & Signature Capture',
        location: 'Boston, MA',
        postalCode: '02110',
        timestamp: 'Est. by 12:15 PM',
        completed: false,
      },
    ],
  },
  {
    id: 'pkg-2',
    trackingNumber: '9012 3381 0940',
    nickname: 'Customs Clearance — Optical Lithography Lens',
    carrierService: 'International Priority Freight',
    status: 'Exception',
    direction: 'Incoming',
    etaWindow: 'Action Required · Duty Hold',
    etaDate: 'Pending Clearance',
    origin: 'Eindhoven, NL 5657',
    destination: 'Boston, MA 02110',
    weightKg: 19.8,
    dimensionsCm: '65 × 50 × 45 cm',
    pieces: 2,
    signatureRequired: true,
    dutyAmountUsd: 148.50,
    exceptionReason: 'Import customs duty & regulatory clearance fee ($148.50 USD) required prior to final dispatch.',
    pinned: true,
    checkpoints: [
      {
        id: 'cp-21',
        title: 'Picked Up from Origin Cleanroom',
        location: 'Eindhoven, NL',
        postalCode: '5657 BX',
        timestamp: 'Oct 31 · 06:20 PM',
        completed: true,
      },
      {
        id: 'cp-22',
        title: 'Export Scan Completed',
        location: 'Cologne Bonn Hub, DE',
        postalCode: '51147',
        timestamp: 'Nov 1 · 02:10 AM',
        completed: true,
      },
      {
        id: 'cp-23',
        title: 'Clearance Delay — Import Duty Due',
        location: 'Newark Port of Entry, NJ',
        postalCode: '07114',
        timestamp: 'Nov 2 · 06:05 AM',
        completed: true,
        current: true,
      },
      {
        id: 'cp-24',
        title: 'Release to Local Courier',
        location: 'Boston, MA',
        postalCode: '02110',
        timestamp: 'Awaiting Payment',
        completed: false,
      },
    ],
  },
  {
    id: 'pkg-3',
    trackingNumber: '4421 8890 1205',
    nickname: 'Industrial Robotics Actuator Kit (Batch 4)',
    carrierService: '2Day Air AM',
    status: 'In Transit',
    direction: 'Outgoing',
    etaWindow: 'By 10:30 AM',
    etaDate: 'Tomorrow, Nov 3',
    origin: 'Boston, MA 02110',
    destination: 'Austin, TX 78701',
    weightKg: 12.2,
    dimensionsCm: '55 × 40 × 30 cm',
    pieces: 3,
    signatureRequired: true,
    checkpoints: [
      {
        id: 'cp-31',
        title: 'Picked Up by Courier',
        location: 'Boston Seaport, MA',
        postalCode: '02110',
        timestamp: 'Nov 1 · 05:30 PM',
        completed: true,
      },
      {
        id: 'cp-32',
        title: 'In Transit — Departed Regional Hub',
        location: 'Indianapolis Sort Facility, IN',
        postalCode: '46241',
        timestamp: 'Nov 2 · 04:42 AM',
        completed: true,
        current: true,
      },
      {
        id: 'cp-33',
        title: 'Arrival at Destination Ramp',
        location: 'Austin Bergstrom Hub, TX',
        postalCode: '78719',
        timestamp: 'Scheduled Nov 2 · 09:00 PM',
        completed: false,
      },
      {
        id: 'cp-34',
        title: 'Final Delivery',
        location: 'Austin, TX',
        postalCode: '78701',
        timestamp: 'Scheduled Nov 3 · 10:30 AM',
        completed: false,
      },
    ],
  },
  {
    id: 'pkg-4',
    trackingNumber: '6104 5529 8831',
    nickname: 'Cleanroom Telemetry Calibration Terminals',
    carrierService: 'Standard Ground Freight',
    status: 'In Transit',
    direction: 'Incoming',
    etaWindow: '01:00 PM – 04:30 PM',
    etaDate: 'Wed, Nov 4',
    origin: 'Chicago, IL 60607',
    destination: 'Boston, MA 02110',
    weightKg: 8.5,
    dimensionsCm: '42 × 38 × 28 cm',
    pieces: 1,
    signatureRequired: false,
    checkpoints: [
      {
        id: 'cp-41',
        title: 'Origin Scan',
        location: 'Chicago Metro Hub, IL',
        postalCode: '60607',
        timestamp: 'Nov 1 · 08:15 PM',
        completed: true,
      },
      {
        id: 'cp-42',
        title: 'In Transit via Linehaul Network',
        location: 'Toledo Waypoint, OH',
        postalCode: '43612',
        timestamp: 'Nov 2 · 06:30 AM',
        completed: true,
        current: true,
      },
      {
        id: 'cp-43',
        title: 'Destination Sort Facility',
        location: 'Shrewsbury, MA',
        postalCode: '01545',
        timestamp: 'Est. Nov 3',
        completed: false,
      },
    ],
  },
  {
    id: 'pkg-5',
    trackingNumber: '3319 7042 6518',
    nickname: 'Titanium Manifold Prototype Cases',
    carrierService: 'First Overnight',
    status: 'Delivered',
    direction: 'Archived',
    etaWindow: 'Delivered at 08:14 AM',
    etaDate: 'Nov 1',
    origin: 'Seattle, WA 98108',
    destination: 'Boston, MA 02110',
    weightKg: 14.0,
    dimensionsCm: '60 × 45 × 35 cm',
    pieces: 2,
    signatureRequired: true,
    signedBy: 'M. CHEN (DOCK B)',
    checkpoints: [
      {
        id: 'cp-51',
        title: 'Picked Up',
        location: 'Seattle Boeing Field, WA',
        postalCode: '98108',
        timestamp: 'Oct 31 · 04:50 PM',
        completed: true,
      },
      {
        id: 'cp-52',
        title: 'Arrived at Destination Station',
        location: 'Boston, MA',
        postalCode: '02110',
        timestamp: 'Nov 1 · 06:20 AM',
        completed: true,
      },
      {
        id: 'cp-53',
        title: 'Delivered — Signed by M. CHEN',
        location: 'Boston, MA',
        postalCode: '02110',
        timestamp: 'Nov 1 · 08:14 AM',
        completed: true,
        current: true,
      },
    ],
  },
];

export const SCANNABLE_SAMPLE_WAYBILLS = [
  {
    code: '5591 0024 7712',
    nickname: 'Sub-Zero Cryo Valve Assembly #9',
    carrierService: 'Priority Overnight Express',
    origin: 'San Jose, CA 95110',
    destination: 'Boston, MA 02110',
    weightKg: 5.2,
  },
  {
    code: '8834 1920 5501',
    nickname: 'Sterile Pharmaceutical Vial Trays (40x)',
    carrierService: 'ColdChain Custom Critical',
    origin: 'Raleigh, NC 27601',
    destination: 'Boston, MA 02110',
    weightKg: 11.6,
  },
];

export const INITIAL_COLD_CHAIN_UNITS: ColdChainUnit[] = [
  {
    id: 'cx-1',
    unitCode: 'CX-CRYO-088',
    manifestTitle: 'mRNA Biologics Bulk Drug Substance #409',
    cargoClass: 'Ultra-Low Cryogenic (-80 °C)',
    corridor: 'I-95 NE Pharma Corridor',
    originHub: 'Cambridge BioVault, MA',
    destinationHub: 'Newark Air Cargo ColdHub, NJ',
    currentTempC: -78.4,
    setpointTempC: -80.0,
    minSafeTempC: -84.0,
    maxSafeTempC: -75.0,
    humidityPct: 18.2,
    weightKg: 1420.5,
    elapsedTime: '04:42:18',
    gpsCoords: '41.3083° N, 72.9279° W',
    status: 'Nominal',
    statusLabel: 'COLD STABLE',
    doorIntegrity: 'SEALED',
    sealHash: '0x8F4A·9C2E·71B0',
    sealTimestamp: '05:10 UTC',
    sparklineHistory: [-79.8, -79.6, -79.5, -79.2, -79.0, -78.9, -79.1, -78.8, -78.6, -78.5, -78.7, -78.4],
    compressorRpm: 3420,
    batteryVoltage: 28.4,
  },
  {
    id: 'cx-2',
    unitCode: 'CX-REEFER-104',
    manifestTitle: 'Monoclonal Antibody Clinical Lot #18B',
    cargoClass: 'Chilled Biologics (+2 °C to +8 °C)',
    corridor: 'Midwest Air-Surface Link',
    originHub: 'Indianapolis BioPark, IN',
    destinationHub: 'Boston Seaport ColdDock, MA',
    currentTempC: 9.6,
    setpointTempC: 4.0,
    minSafeTempC: 2.0,
    maxSafeTempC: 8.0,
    humidityPct: 64.8,
    weightKg: 2890.0,
    elapsedTime: '11:15:04',
    gpsCoords: '42.2626° N, 71.8023° W',
    status: 'Excursion Alarm',
    statusLabel: 'EXCURSION ALARM',
    doorIntegrity: 'AJAR ALERT',
    sealHash: '0x3E19·F04D·BROKEN',
    sealTimestamp: '09:48 UTC',
    sparklineHistory: [3.9, 4.1, 4.0, 4.2, 4.5, 5.1, 6.4, 7.8, 8.5, 9.1, 9.4, 9.6],
    compressorRpm: 4180,
    batteryVoltage: 27.1,
  },
  {
    id: 'cx-3',
    unitCode: 'CX-FROZEN-511',
    manifestTitle: 'Diagnostic Reagent Enzyme Cartridges',
    cargoClass: 'Deep Frozen (-20 °C)',
    corridor: 'Pacific Northwest Express',
    originHub: 'Seattle CryoPort, WA',
    destinationHub: 'Denver Logistics Center, CO',
    currentTempC: -20.4,
    setpointTempC: -20.0,
    minSafeTempC: -25.0,
    maxSafeTempC: -18.0,
    humidityPct: 24.5,
    weightKg: 4150.0,
    elapsedTime: '16:08:52',
    gpsCoords: '43.6150° N, 116.2023° W',
    status: 'Reefer Active',
    statusLabel: 'REEFER ACTIVE',
    doorIntegrity: 'SEALED',
    sealHash: '0x7C91·A402·E88F',
    sealTimestamp: '01:15 UTC',
    sparklineHistory: [-20.1, -20.3, -20.5, -20.2, -20.0, -19.9, -20.2, -20.4, -20.5, -20.3, -20.4, -20.4],
    compressorRpm: 2950,
    batteryVoltage: 28.6,
  },
  {
    id: 'cx-4',
    unitCode: 'CX-PHARMA-219',
    manifestTitle: 'Insulin Glargine Prefilled Pens (Pallet 1-6)',
    cargoClass: 'Controlled Cold (+2 °C to +8 °C)',
    corridor: 'Trans-Atlantic Air Feeder',
    originHub: 'Frankfurt CoolCenter, DE',
    destinationHub: 'JFK Pharma Gate 4, NY',
    currentTempC: 6.8,
    setpointTempC: 4.5,
    minSafeTempC: 2.0,
    maxSafeTempC: 8.0,
    humidityPct: 58.0,
    weightKg: 3640.2,
    elapsedTime: '07:54:11',
    gpsCoords: '40.6413° N, 73.7781° W',
    status: 'Defrost Warning',
    statusLabel: 'DEFROST WARNING',
    doorIntegrity: 'SEALED',
    sealHash: '0x5A12·D903·11C4',
    sealTimestamp: '03:30 UTC',
    sparklineHistory: [4.4, 4.5, 4.6, 4.5, 4.8, 5.2, 5.9, 6.3, 6.7, 7.1, 6.9, 6.8],
    compressorRpm: 1850,
    batteryVoltage: 27.8,
  },
  {
    id: 'cx-5',
    unitCode: 'CX-VACC-012',
    manifestTitle: 'Lyophilized Viral Vector Vaccine Lot #92',
    cargoClass: 'Deep Frozen (-25 °C)',
    corridor: 'Southern BioCorridor',
    originHub: 'Research Triangle, NC',
    destinationHub: 'Atlanta ColdVault, GA',
    currentTempC: -24.8,
    setpointTempC: -25.0,
    minSafeTempC: -30.0,
    maxSafeTempC: -22.0,
    humidityPct: 21.0,
    weightKg: 1980.0,
    elapsedTime: '05:21:40',
    gpsCoords: '34.8526° N, 82.3940° W',
    status: 'Nominal',
    statusLabel: 'COLD STABLE',
    doorIntegrity: 'SEALED',
    sealHash: '0x9D04·B771·63FA',
    sealTimestamp: '04:00 UTC',
    sparklineHistory: [-25.1, -25.0, -24.9, -25.2, -25.0, -24.8, -24.9, -25.1, -25.0, -24.9, -24.8, -24.8],
    compressorRpm: 3100,
    batteryVoltage: 28.5,
  },
  {
    id: 'cx-6',
    unitCode: 'CX-BIO-402',
    manifestTitle: 'Autologous CAR-T Cryo-Shipper Dewars (12x)',
    cargoClass: 'Vapor Phase LN2 (-150 °C)',
    corridor: 'West Coast Clinical Express',
    originHub: 'South San Francisco, CA',
    destinationHub: 'Los Angeles Medical Center, CA',
    currentTempC: -152.1,
    setpointTempC: -150.0,
    minSafeTempC: -165.0,
    maxSafeTempC: -140.0,
    humidityPct: 11.4,
    weightKg: 840.8,
    elapsedTime: '03:19:05',
    gpsCoords: '35.3733° N, 119.0187° W',
    status: 'Reefer Active',
    statusLabel: 'REEFER ACTIVE',
    doorIntegrity: 'SEALED',
    sealHash: '0x2B88·E190·44D2',
    sealTimestamp: '06:45 UTC',
    sparklineHistory: [-151.8, -152.0, -152.2, -151.9, -152.1, -152.3, -152.0, -151.9, -152.2, -152.1, -152.0, -152.1],
    compressorRpm: 3600,
    batteryVoltage: 28.7,
  },
];
