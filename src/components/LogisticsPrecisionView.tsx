import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ScanLine,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  MapPin,
  PenTool,
  ShieldCheck,
  SlidersHorizontal,
  Plus,
  X,
  ChevronRight,
  CreditCard,
  Smartphone,
  Monitor,
  Clock,
  FileCheck2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import {
  ParcelShipment,
  ParcelDirection,
  ParcelStatus,
  SCANNABLE_SAMPLE_WAYBILLS,
} from '../data/logisticsData';

interface LogisticsPrecisionViewProps {
  parcels: ParcelShipment[];
  onUpdateParcel: (updated: ParcelShipment) => void;
  onAddParcel: (newParcel: ParcelShipment) => void;
  externalOpenNewModal?: boolean;
  onCloseExternalNewModal?: () => void;
}

export const LogisticsPrecisionView: React.FC<LogisticsPrecisionViewProps> = ({
  parcels,
  onUpdateParcel,
  onAddParcel,
  externalOpenNewModal,
  onCloseExternalNewModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | ParcelDirection>('All');
  const [selectedParcelId, setSelectedParcelId] = useState<string>(parcels[0]?.id || 'pkg-1');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'handheld'>('desktop');
  const [mobileBottomTab, setMobileBottomTab] = useState<'track' | 'shipments' | 'scan' | 'schedule'>('track');

  // Modals & Overlays (Level 3 elevation: 0 12px 32px rgba(51, 51, 51, 0.16))
  const [scannerOpen, setScannerOpen] = useState(false);
  const [signatureParcel, setSignatureParcel] = useState<ParcelShipment | null>(null);
  const [dutyParcel, setDutyParcel] = useState<ParcelShipment | null>(null);
  const [manageParcel, setManageParcel] = useState<ParcelShipment | null>(null);
  const [newShipmentOpen, setNewShipmentOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Signature pad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [signerName, setSignerName] = useState('R. VANCE (OPS LEAD)');

  // New Shipment Form state
  const [newNickname, setNewNickname] = useState('');
  const [newOrigin, setNewOrigin] = useState('Boston, MA 02110');
  const [newDestination, setNewDestination] = useState('San Diego, CA 92101');
  const [newService, setNewService] = useState('Priority Overnight Express');
  const [newWeight, setNewWeight] = useState('7.5');

  // Manage delivery instructions state
  const [customInstructions, setCustomInstructions] = useState('');
  const [holdAtHub, setHoldAtHub] = useState(false);

  useEffect(() => {
    if (externalOpenNewModal) {
      setNewShipmentOpen(true);
      onCloseExternalNewModal?.();
    }
  }, [externalOpenNewModal, onCloseExternalNewModal]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered shipments
  const filteredParcels = parcels.filter((p) => {
    const matchesFilter = selectedFilter === 'All' || p.direction === selectedFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.trackingNumber.toLowerCase().includes(q) ||
      p.nickname.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.destination.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const activeSelectedParcel =
    parcels.find((p) => p.id === selectedParcelId) || filteredParcels[0] || parcels[0];

  // Signature Canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.strokeStyle = '#330066';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setHasDrawnSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const handleConfirmSignature = () => {
    if (!signatureParcel) return;
    const updatedCheckpoints = signatureParcel.checkpoints.map((cp, idx, arr) => ({
      ...cp,
      completed: true,
      current: idx === arr.length - 1,
      timestamp: idx === arr.length - 1 ? 'Just Now · Verified' : cp.timestamp,
    }));
    const updated: ParcelShipment = {
      ...signatureParcel,
      status: 'Delivered',
      direction: 'Archived',
      etaWindow: `Delivered · Signed by ${signerName.trim() || 'Authorized Recipient'}`,
      signedBy: signerName.trim() || 'Authorized Recipient',
      checkpoints: updatedCheckpoints,
    };
    onUpdateParcel(updated);
    setSignatureParcel(null);
    setHasDrawnSignature(false);
    showToast(`Delivery verified & signed for waybill ${signatureParcel.trackingNumber}`);
  };

  const handlePayDuty = () => {
    if (!dutyParcel) return;
    const updated: ParcelShipment = {
      ...dutyParcel,
      status: 'In Transit',
      etaWindow: 'Cleared Customs · Est. 04:30 PM',
      etaDate: 'Today, Nov 2',
      dutyAmountUsd: undefined,
      exceptionReason: undefined,
      checkpoints: dutyParcel.checkpoints.map((cp, idx) =>
        idx === 2
          ? {
              ...cp,
              title: 'Customs Duty Paid — Released from Bonded Hold',
              timestamp: 'Just Now · Cleared',
              completed: true,
              current: true,
            }
          : cp
      ),
    };
    onUpdateParcel(updated);
    setDutyParcel(null);
    showToast(`Customs duty paid. Waybill ${dutyParcel.trackingNumber} released for dispatch.`);
  };

  const handleScanSampleWaybill = (sample: (typeof SCANNABLE_SAMPLE_WAYBILLS)[0]) => {
    const existing = parcels.find((p) => p.trackingNumber === sample.code);
    if (existing) {
      setSelectedParcelId(existing.id);
      setScannerOpen(false);
      showToast(`Waybill ${sample.code} located in active manifest.`);
      return;
    }
    const newPkg: ParcelShipment = {
      id: `pkg-${Date.now()}`,
      trackingNumber: sample.code,
      nickname: sample.nickname,
      carrierService: sample.carrierService,
      status: 'Out for Delivery',
      direction: 'Incoming',
      etaWindow: '01:15 PM – 03:00 PM',
      etaDate: 'Today, Nov 2',
      origin: sample.origin,
      destination: sample.destination,
      weightKg: sample.weightKg,
      dimensionsCm: '44 × 32 × 24 cm',
      pieces: 1,
      signatureRequired: true,
      pinned: true,
      checkpoints: [
        {
          id: `cp-${Date.now()}-1`,
          title: 'Barcode Scanned at Origin Hub',
          location: sample.origin,
          postalCode: '95110',
          timestamp: 'Nov 1 · 07:10 PM',
          completed: true,
        },
        {
          id: `cp-${Date.now()}-2`,
          title: 'Arrived at Local Distribution Station',
          location: sample.destination,
          postalCode: '02110',
          timestamp: 'Nov 2 · 06:40 AM',
          completed: true,
        },
        {
          id: `cp-${Date.now()}-3`,
          title: 'Out for Delivery via Express Van #412',
          location: sample.destination,
          postalCode: '02110',
          timestamp: 'Just Scanned',
          completed: true,
          current: true,
        },
        {
          id: `cp-${Date.now()}-4`,
          title: 'Final Drop-Off Verification',
          location: sample.destination,
          postalCode: '02110',
          timestamp: 'Est. 03:00 PM',
          completed: false,
        },
      ],
    };
    onAddParcel(newPkg);
    setSelectedParcelId(newPkg.id);
    setScannerOpen(false);
    showToast(`Scanned barcode ${sample.code} added to Active Deliveries`);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(
      1000 + Math.random() * 9000
    )} ${Math.floor(1000 + Math.random() * 9000)}`;
    const created: ParcelShipment = {
      id: `pkg-${Date.now()}`,
      trackingNumber: randomCode,
      nickname: newNickname.trim() || 'Express Commercial Consignment',
      carrierService: newService,
      status: 'In Transit',
      direction: 'Outgoing',
      etaWindow: 'By 10:30 AM',
      etaDate: 'Tomorrow, Nov 3',
      origin: newOrigin,
      destination: newDestination,
      weightKg: parseFloat(newWeight) || 5.0,
      dimensionsCm: '50 × 38 × 26 cm',
      pieces: 1,
      signatureRequired: true,
      pinned: true,
      checkpoints: [
        {
          id: `cp-new-1`,
          title: 'Digital Thermal Waybill Generated',
          location: newOrigin,
          postalCode: '02110',
          timestamp: 'Just Now',
          completed: true,
          current: true,
        },
        {
          id: `cp-new-2`,
          title: 'Courier Pickup Scheduled',
          location: newOrigin,
          postalCode: '02110',
          timestamp: 'Today · 04:00 PM Window',
          completed: false,
        },
        {
          id: `cp-new-3`,
          title: 'Destination Hub Sort & Delivery',
          location: newDestination,
          postalCode: '92101',
          timestamp: 'Tomorrow · 10:30 AM',
          completed: false,
        },
      ],
    };
    onAddParcel(created);
    setSelectedParcelId(created.id);
    setNewNickname('');
    setNewShipmentOpen(false);
    showToast(`Shipment ${randomCode} created and pickup scheduled`);
  };

  const getStatusStyle = (status: ParcelStatus) => {
    switch (status) {
      case 'Out for Delivery':
        return {
          bg: 'rgba(255, 98, 0, 0.12)',
          text: '#FF6200',
          dot: '#FF6200',
        };
      case 'In Transit':
        return {
          bg: 'rgba(77, 20, 140, 0.10)',
          text: '#4D148C',
          dot: '#4D148C',
        };
      case 'Delivered':
        return {
          bg: 'rgba(0, 135, 68, 0.12)',
          text: '#008744',
          dot: '#008744',
        };
      case 'Exception':
        return {
          bg: 'rgba(217, 56, 30, 0.12)',
          text: '#D9381E',
          dot: '#D9381E',
        };
    }
  };

  const countByStatus = {
    outForDelivery: parcels.filter((p) => p.status === 'Out for Delivery').length,
    inTransit: parcels.filter((p) => p.status === 'In Transit').length,
    exception: parcels.filter((p) => p.status === 'Exception').length,
    delivered: parcels.filter((p) => p.status === 'Delivered').length,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1B1C1C]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{ boxShadow: '0 12px 32px rgba(51, 51, 51, 0.16)' }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#330066] text-white px-4 py-3 rounded-lg border border-[#bc89ff]/30"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FF6200] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header Brand Authority Banner (Primary #4D148C) */}
      <div className="bg-[#4D148C] text-white border-b border-[#330066]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#d8b9ff] mb-1">
                <span>Logistics Precision</span>
                <span aria-hidden="true">·</span>
                <span>Express Parcel & Handheld Verification</span>
              </div>
              <h1 className="font-display text-[28px] sm:text-[34px] font-extrabold leading-tight tracking-tight text-white">
                Shipment Summary & Dispatch Control
              </h1>
            </div>

            {/* Viewport & Quick Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Viewport Mode Toggle: Desktop 12-Col vs Mobile Handheld Scanner */}
              <div className="flex items-center bg-[#330066] p-1 rounded-lg border border-white/15">
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    viewportMode === 'desktop'
                      ? 'bg-white text-[#4D148C]'
                      : 'text-[#eedcff] hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Docked Grid (12-Col)</span>
                </button>
                <button
                  onClick={() => setViewportMode('handheld')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    viewportMode === 'handheld'
                      ? 'bg-white text-[#4D148C]'
                      : 'text-[#eedcff] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Handheld Mobile (412px)</span>
                </button>
              </div>

              <button
                onClick={() => setScannerOpen(true)}
                className="h-11 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ScanLine className="w-4 h-4 text-[#FF6200]" />
                <span>Scan Label</span>
              </button>

              <button
                onClick={() => setNewShipmentOpen(true)}
                className="h-11 px-5 rounded-lg bg-[#FF6200] hover:bg-[#e55800] text-white text-sm font-bold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ship Now</span>
              </button>
            </div>
          </div>

          {/* Prominent 52px Barcode & Tracking Search Input */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8 relative">
              <div className="relative flex items-center w-full h-[52px] bg-white rounded-lg border-2 border-transparent focus-within:border-[#FF6200] shadow-sm overflow-hidden">
                <div className="pl-4 pr-3 text-[#4D4D4D] flex items-center">
                  <Search className="w-5 h-5 text-[#4D148C]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter 12-digit tracking ID, parcel nickname, or destination postal code..."
                  className="w-full h-full text-[15px] text-[#1B1C1C] placeholder-[#4D4D4D] focus:outline-none pr-28 font-medium tabular-nums"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-14 p-1.5 text-[#4D4D4D] hover:text-[#1B1C1C]"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setScannerOpen(true)}
                  title="Open Barcode Camera Scanner"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-[#F2F2F2] hover:bg-[#e4e2e1] text-[#4D148C] rounded-md flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#FF6200]" />
                  <span className="hidden sm:inline">Barcode</span>
                </button>
              </div>
            </div>

            {/* Quick Operational Telemetry Strip */}
            <div className="lg:col-span-4 grid grid-cols-4 gap-2 bg-[#330066]/80 rounded-lg p-2.5 border border-white/10">
              <div className="text-center">
                <div className="text-[11px] font-semibold text-[#d8b9ff]">Out Now</div>
                <div className="font-display text-lg font-extrabold text-[#FF6200] tabular-nums">
                  {countByStatus.outForDelivery}
                </div>
              </div>
              <div className="text-center border-l border-white/10">
                <div className="text-[11px] font-semibold text-[#d8b9ff]">In Transit</div>
                <div className="font-display text-lg font-extrabold text-white tabular-nums">
                  {countByStatus.inTransit}
                </div>
              </div>
              <div className="text-center border-l border-white/10">
                <div className="text-[11px] font-semibold text-[#ffb597]">Exceptions</div>
                <div className="font-display text-lg font-extrabold text-[#ffb597] tabular-nums">
                  {countByStatus.exception}
                </div>
              </div>
              <div className="text-center border-l border-white/10">
                <div className="text-[11px] font-semibold text-[#d8b9ff]">Delivered</div>
                <div className="font-display text-lg font-extrabold text-[#6ffbbe] tabular-nums">
                  {countByStatus.delivered}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Canvas */}
      <div
        className={`mx-auto transition-all duration-200 ${
          viewportMode === 'handheld'
            ? 'max-w-[428px] my-6 bg-[#F8F9FA] border-[6px] border-[#303030] rounded-[32px] shadow-2xl overflow-hidden pb-20'
            : 'max-w-[1200px] px-4 sm:px-6 py-6'
        }`}
      >
        {viewportMode === 'handheld' && (
          <div className="bg-[#330066] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
            <span className="tabular-nums">09:42 AM · SCANNER TERM #08</span>
            <span className="text-[#FF6200]">5G LTE · 98%</span>
          </div>
        )}

        <div className={viewportMode === 'handheld' ? 'p-4' : ''}>
          {/* Filter Chips Bar & Result Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['All', 'Incoming', 'Outgoing', 'Archived'] as const).map((filter) => {
                const active = selectedFilter === filter;
                const count =
                  filter === 'All'
                    ? parcels.length
                    : parcels.filter((p) => p.direction === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`h-10 px-4 rounded-full text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#4D148C] text-white shadow-sm'
                        : 'bg-[#F2F2F2] text-[#4D4D4D] hover:bg-[#e4e2e1] hover:text-[#1B1C1C]'
                    }`}
                  >
                    <span>{filter}</span>
                    <span
                      className={`tabular-nums text-[11px] ${
                        active ? 'text-[#d8b9ff]' : 'text-[#7c7483]'
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-semibold text-[#4D4D4D] tabular-nums">
              Showing {filteredParcels.length} of {parcels.length} consignments
            </div>
          </div>

          {/* 12-Column Responsive Layout (or Stacked Mobile Layout in Handheld Mode) */}
          <div
            className={`grid gap-6 ${
              viewportMode === 'handheld' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12 items-start'
            }`}
          >
            {/* Left Column: Active Deliveries & Past Shipments Cards */}
            <div className={viewportMode === 'handheld' ? '' : 'lg:col-span-7 space-y-4'}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-bold text-[#1B1C1C]">
                  Active Deliveries & Manifests
                </h2>
                <span className="text-xs font-semibold text-[#007AB7]">
                  Tap card to inspect checkpoints
                </span>
              </div>

              <div className="space-y-4">
                {filteredParcels.map((parcel) => {
                  const statusStyle = getStatusStyle(parcel.status);
                  const isSelected = activeSelectedParcel?.id === parcel.id;
                  const completedSteps = parcel.checkpoints.filter((c) => c.completed).length;

                  return (
                    <div
                      key={parcel.id}
                      onClick={() => setSelectedParcelId(parcel.id)}
                      style={{
                        boxShadow: isSelected
                          ? '0 6px 16px rgba(77, 20, 140, 0.10)'
                          : '0 2px 4px rgba(51, 51, 51, 0.04)',
                      }}
                      className={`bg-white rounded-2xl p-5 transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-[#4D148C] ring-1 ring-[#4D148C]/30'
                          : 'border-[#E5E7EB] hover:border-[#cdc3d4]'
                      }`}
                    >
                      {/* Card Header Row: Parcel Nickname & Direction Metadata */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#4D4D4D] mb-1">
                            <span className="text-[#4D148C] font-bold">{parcel.carrierService}</span>
                            <span aria-hidden="true">·</span>
                            <span>{parcel.direction}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{parcel.weightKg.toFixed(1)} kg</span>
                          </div>
                          <h3 className="font-display text-[17px] font-bold text-[#1B1C1C] leading-snug">
                            {parcel.nickname}
                          </h3>
                        </div>

                        {/* Status Badge */}
                        <span
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                          className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0"
                        >
                          {parcel.status}
                        </span>
                      </div>

                      {/* Middle Section: Tabular Tracking ID & Route */}
                      <div className="flex flex-wrap items-center justify-between gap-2 py-2.5 border-y border-[#F2F2F2] text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[#4D4D4D] font-medium">TRK#</span>
                          <span className="font-mono-tabular font-bold text-sm text-[#1B1C1C] tracking-tight">
                            {parcel.trackingNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#4D4D4D] font-medium tabular-nums">
                          <span>{parcel.origin}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#FF6200]" />
                          <span className="text-[#1B1C1C] font-semibold">{parcel.destination}</span>
                        </div>
                      </div>

                      {/* Horizontal Progress Stepper Track (#4D148C completed, #FF6200 current, #F2F2F2 upcoming) */}
                      <div className="mt-4 mb-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#4D4D4D] mb-2">
                          <span>
                            Checkpoint {completedSteps} of {parcel.checkpoints.length}
                          </span>
                          <span className="tabular-nums text-[#1B1C1C] font-bold">
                            {parcel.etaDate} · {parcel.etaWindow}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[0, 1, 2, 3].map((stepIdx) => {
                            const ratio = completedSteps / parcel.checkpoints.length;
                            const stepCompleted = (stepIdx + 1) / 4 <= ratio;
                            const isCurrentStep =
                              parcel.status !== 'Delivered' &&
                              Math.floor(ratio * 4) === stepIdx;
                            return (
                              <div
                                key={stepIdx}
                                className="h-2 rounded-full transition-colors"
                                style={{
                                  backgroundColor: isCurrentStep
                                    ? '#FF6200'
                                    : stepCompleted
                                    ? '#4D148C'
                                    : '#F2F2F2',
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Exception Banner if Duty Required */}
                      {parcel.status === 'Exception' && parcel.exceptionReason && (
                        <div className="mt-3 p-3 rounded-lg bg-[#ffdad6]/50 border border-[#D9381E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-2 text-xs text-[#93000a]">
                            <AlertTriangle className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5" />
                            <span>{parcel.exceptionReason}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDutyParcel(parcel);
                            }}
                            className="h-9 px-3.5 rounded-lg bg-[#FF6200] hover:bg-[#e55800] text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Pay Duty (${parcel.dutyAmountUsd?.toFixed(2)})
                          </button>
                        </div>
                      )}

                      {/* Footer Row: Secondary Action Shortcuts */}
                      <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs text-[#4D4D4D]">
                          {parcel.signedBy ? (
                            <span className="text-[#008744] font-semibold">
                              Verified Signature: {parcel.signedBy}
                            </span>
                          ) : parcel.signatureRequired ? (
                            <span className="font-medium">Direct Signature Required</span>
                          ) : (
                            <span>Standard Release Authorized</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {parcel.status !== 'Delivered' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSignatureParcel(parcel);
                              }}
                              className="h-9 px-3 rounded-lg border-[1.5px] border-[#4D148C] text-[#4D148C] hover:bg-[#4D148C]/6 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <PenTool className="w-3.5 h-3.5" />
                              <span>Sign & Verify</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setManageParcel(parcel);
                              setCustomInstructions(parcel.deliveryInstructions || '');
                            }}
                            className="h-9 px-3 rounded-lg bg-[#F2F2F2] hover:bg-[#e4e2e1] text-[#1B1C1C] text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>Manage Delivery</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Checkpoint Stepper & Waybill Inspector */}
            {activeSelectedParcel && (
              <div className={viewportMode === 'handheld' ? 'mt-6' : 'lg:col-span-5 lg:sticky lg:top-20'}>
                <div
                  style={{ boxShadow: '0 6px 16px rgba(77, 20, 140, 0.08)' }}
                  className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
                >
                  {/* Top Inspector Header */}
                  <div className="bg-[#330066] text-white p-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#bc89ff]">
                        Live Waybill Telemetry
                      </span>
                      <span className="font-mono-tabular text-xs font-semibold text-[#eedcff]">
                        ID · {activeSelectedParcel.trackingNumber}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-extrabold text-white mb-1">
                      {activeSelectedParcel.status}
                    </h3>
                    <p className="text-xs text-[#d8b9ff] tabular-nums">
                      Estimated Window: {activeSelectedParcel.etaDate} · {activeSelectedParcel.etaWindow}
                    </p>
                  </div>

                  {/* Interactive Route Vector Map Preview */}
                  <div className="bg-[#f6f3f2] px-5 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1B1C1C] mb-2">
                      <span>{activeSelectedParcel.origin}</span>
                      <span className="text-[#007AB7]">{activeSelectedParcel.carrierService}</span>
                      <span>{activeSelectedParcel.destination}</span>
                    </div>
                    <svg className="w-full h-14" viewBox="0 0 360 56" fill="none">
                      <line
                        x1="24"
                        y1="28"
                        x2="336"
                        y2="28"
                        stroke="#cdc3d4"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                      />
                      <line
                        x1="24"
                        y1="28"
                        x2={activeSelectedParcel.status === 'Delivered' ? '336' : '235'}
                        y2="28"
                        stroke="#4D148C"
                        strokeWidth="3.5"
                      />
                      <circle cx="24" cy="28" r="6" fill="#4D148C" />
                      <circle cx="130" cy="28" r="5" fill="#4D148C" />
                      <circle
                        cx="235"
                        cy="28"
                        r="8"
                        fill={
                          activeSelectedParcel.status === 'Exception'
                            ? '#D9381E'
                            : activeSelectedParcel.status === 'Delivered'
                            ? '#4D148C'
                            : '#FF6200'
                        }
                      />
                      <circle
                        cx="336"
                        cy="28"
                        r="6"
                        fill={activeSelectedParcel.status === 'Delivered' ? '#008744' : '#e4e2e1'}
                        stroke="#4D148C"
                        strokeWidth="2"
                      />
                      <text x="16" y="48" fill="#4D4D4D" fontSize="10" fontWeight="600">
                        ORIGIN
                      </text>
                      <text x="108" y="48" fill="#4D4D4D" fontSize="10" fontWeight="600">
                        HUB SORT
                      </text>
                      <text x="208" y="48" fill="#FF6200" fontSize="10" fontWeight="700">
                        LOCAL RAMP
                      </text>
                      <text x="305" y="48" fill="#4D4D4D" fontSize="10" fontWeight="600">
                        DROP-OFF
                      </text>
                    </svg>
                  </div>

                  {/* Parcel Specs Grid */}
                  <div className="grid grid-cols-3 divide-x divide-[#F2F2F2] border-b border-[#F2F2F2] bg-white text-center py-3">
                    <div>
                      <div className="text-[11px] text-[#4D4D4D] font-medium">Gross Weight</div>
                      <div className="text-sm font-bold text-[#1B1C1C] tabular-nums">
                        {activeSelectedParcel.weightKg.toFixed(1)} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#4D4D4D] font-medium">Dimensions</div>
                      <div className="text-sm font-bold text-[#1B1C1C] tabular-nums">
                        {activeSelectedParcel.dimensionsCm}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#4D4D4D] font-medium">Pieces</div>
                      <div className="text-sm font-bold text-[#1B1C1C] tabular-nums">
                        {activeSelectedParcel.pieces} Box{activeSelectedParcel.pieces > 1 ? 'es' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Vertical Stepper / Progress Track */}
                  <div className="p-5">
                    <h4 className="font-display text-sm font-bold text-[#1B1C1C] mb-4">
                      Transit Checkpoints & Scan History
                    </h4>

                    <div className="space-y-0">
                      {activeSelectedParcel.checkpoints.map((cp, index) => {
                        const isLast = index === activeSelectedParcel.checkpoints.length - 1;
                        return (
                          <div key={cp.id} className="relative flex items-start gap-3.5 pb-5">
                            {/* Connecting Vertical Line */}
                            {!isLast && (
                              <div
                                className="absolute left-[9px] top-5 bottom-0 w-[2px]"
                                style={{
                                  backgroundColor: cp.completed ? '#4D148C' : '#F2F2F2',
                                }}
                              />
                            )}

                            {/* Stepper Node */}
                            <div
                              className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{
                                backgroundColor: cp.current
                                  ? '#FF6200'
                                  : cp.completed
                                  ? '#4D148C'
                                  : '#F2F2F2',
                                boxShadow: cp.current
                                  ? '0 0 0 4px rgba(255, 98, 0, 0.2)'
                                  : undefined,
                              }}
                            >
                              {cp.completed && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>

                            {/* Checkpoint Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p
                                  className={`text-sm font-bold ${
                                    cp.current
                                      ? 'text-[#FF6200]'
                                      : cp.completed
                                      ? 'text-[#1B1C1C]'
                                      : 'text-[#4D4D4D]'
                                  }`}
                                >
                                  {cp.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[#4D4D4D] mt-0.5 tabular-nums">
                                <span>{cp.location}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono-tabular">{cp.postalCode}</span>
                                <span aria-hidden="true">·</span>
                                <span>{cp.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery Instructions Note */}
                    {activeSelectedParcel.deliveryInstructions && (
                      <div className="mt-2 p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs text-[#4D4D4D]">
                        <span className="font-bold text-[#1B1C1C] block mb-0.5">
                          Courier Drop-Off Instructions:
                        </span>
                        {activeSelectedParcel.deliveryInstructions}
                      </div>
                    )}

                    {/* Primary Conversion CTAs (48px standard height) */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeSelectedParcel.status === 'Exception' ? (
                        <button
                          onClick={() => setDutyParcel(activeSelectedParcel)}
                          className="h-12 px-4 rounded-lg bg-[#FF6200] hover:bg-[#e55800] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Duty (${activeSelectedParcel.dutyAmountUsd?.toFixed(2)})</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSignatureParcel(activeSelectedParcel)}
                          disabled={activeSelectedParcel.status === 'Delivered'}
                          className={`h-12 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                            activeSelectedParcel.status === 'Delivered'
                              ? 'bg-[#008744]/15 text-[#008744] cursor-default'
                              : 'bg-[#FF6200] hover:bg-[#e55800] text-white cursor-pointer'
                          }`}
                        >
                          <PenTool className="w-4 h-4" />
                          <span>
                            {activeSelectedParcel.status === 'Delivered'
                              ? 'Signature Verified'
                              : 'Capture Signature'}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setManageParcel(activeSelectedParcel);
                          setCustomInstructions(activeSelectedParcel.deliveryInstructions || '');
                        }}
                        className="h-12 px-4 rounded-lg border-[1.5px] border-[#4D148C] text-[#4D148C] hover:bg-[#4D148C]/6 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Manage Delivery</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Handheld Mode Persistent Bottom Navigation Bar */}
        {viewportMode === 'handheld' && (
          <div
            style={{ boxShadow: '0 -4px 16px rgba(77, 20, 140, 0.08)' }}
            className="bg-white border-t border-[#E5E7EB] grid grid-cols-4 h-16 px-2 mt-4"
          >
            <button
              onClick={() => setMobileBottomTab('track')}
              className={`flex flex-col items-center justify-center gap-1 ${
                mobileBottomTab === 'track' ? 'text-[#4D148C] font-bold' : 'text-[#4D4D4D]'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-[10px]">Track</span>
            </button>
            <button
              onClick={() => {
                setMobileBottomTab('scan');
                setScannerOpen(true);
              }}
              className="flex flex-col items-center justify-center gap-1 text-[#FF6200] font-bold"
            >
              <ScanLine className="w-5 h-5" />
              <span className="text-[10px]">Scan Label</span>
            </button>
            <button
              onClick={() => {
                setMobileBottomTab('schedule');
                setNewShipmentOpen(true);
              }}
              className="flex flex-col items-center justify-center gap-1 text-[#4D4D4D]"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px]">Ship Now</span>
            </button>
            <button
              onClick={() => {
                if (activeSelectedParcel) setSignatureParcel(activeSelectedParcel);
              }}
              className="flex flex-col items-center justify-center gap-1 text-[#4D4D4D]"
            >
              <PenTool className="w-5 h-5" />
              <span className="text-[10px]">Verify Pod</span>
            </button>
          </div>
        )}
      </div>

      {/* LEVEL 3 MODAL: Camera Barcode / Thermal Label Scanner Sheet */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            style={{ boxShadow: '0 12px 32px rgba(51, 51, 51, 0.24)' }}
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden border border-[#E5E7EB]"
          >
            <div className="bg-[#4D148C] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ScanLine className="w-5 h-5 text-[#FF6200]" />
                <h3 className="font-display text-lg font-bold">Optical Barcode & Waybill Scanner</h3>
              </div>
              <button
                onClick={() => setScannerOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {/* Simulated Laser Viewfinder */}
              <div className="relative bg-[#1b1c1c] rounded-2xl p-6 text-white overflow-hidden border-2 border-[#4D148C]">
                <div className="flex items-center justify-between text-xs text-[#d8b9ff] mb-4 font-mono-tabular">
                  <span>LASER OPTICS: ACTIVE</span>
                  <span>CODE-128 / GS1-DATAMATRIX</span>
                </div>

                {/* Simulated Thermal Barcode SVG */}
                <div className="bg-white rounded-xl p-4 text-[#1B1C1C] mx-auto max-w-xs shadow-md relative">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#4D148C] mb-1">
                    <span>PRIORITY OVERNIGHT</span>
                    <span className="font-mono-tabular">BOS-02110</span>
                  </div>
                  <svg className="w-full h-16" viewBox="0 0 240 60">
                    {[
                      4, 10, 14, 22, 26, 34, 42, 46, 54, 60, 68, 74, 80, 90, 96, 104, 110, 118, 126,
                      134, 140, 148, 156, 162, 170, 178, 184, 192, 200, 206, 214, 222, 228,
                    ].map((x, idx) => (
                      <rect
                        key={x}
                        x={x}
                        y="4"
                        width={idx % 3 === 0 ? '4' : idx % 2 === 0 ? '2' : '3'}
                        height="48"
                        fill="#1B1C1C"
                      />
                    ))}
                  </svg>
                  <div className="text-center font-mono-tabular text-xs font-bold tracking-widest mt-1">
                    5591 0024 7712
                  </div>

                  {/* High-contrast orange laser line */}
                  <div className="absolute left-2 right-2 top-1/2 h-0.5 bg-[#FF6200] shadow-[0_0_8px_#FF6200]" />
                </div>

                <p className="text-center text-xs text-[#cdc3d4] mt-4">
                  Align handheld terminal crosshairs with thermal barcode label
                </p>
              </div>

              {/* Instant Sample Label Triggers */}
              <div className="mt-5">
                <div className="text-xs font-bold text-[#4D4D4D] uppercase tracking-wider mb-2.5">
                  Simulate Immediate Label Scan
                </div>
                <div className="space-y-2">
                  {SCANNABLE_SAMPLE_WAYBILLS.map((sample) => (
                    <button
                      key={sample.code}
                      onClick={() => handleScanSampleWaybill(sample)}
                      className="w-full p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#4D148C] bg-[#F8F9FA] hover:bg-[#eedcff]/25 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-mono-tabular text-sm font-bold text-[#4D148C]">
                          {sample.code}
                        </div>
                        <div className="text-xs font-semibold text-[#1B1C1C]">{sample.nickname}</div>
                        <div className="text-[11px] text-[#4D4D4D]">
                          {sample.origin} → {sample.destination} · {sample.weightKg} kg
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg bg-[#FF6200] text-white text-xs font-bold">
                        Scan & Track
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3 MODAL: Signature Capture Overlay */}
      {signatureParcel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            style={{ boxShadow: '0 12px 32px rgba(51, 51, 51, 0.24)' }}
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#E5E7EB]"
          >
            <div className="bg-[#4D148C] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#d8b9ff]">
                  Proof of Delivery Verification
                </div>
                <h3 className="font-display text-lg font-bold">
                  Waybill {signatureParcel.trackingNumber}
                </h3>
              </div>
              <button
                onClick={() => setSignatureParcel(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#4D148C] uppercase tracking-wider mb-1">
                  Authorized Recipient Name
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-[#CCCCCC] focus:border-2 focus:border-[#4D148C] focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#4D148C] uppercase tracking-wider">
                    Recipient Touch Signature Pad
                  </label>
                  <button
                    onClick={clearSignature}
                    className="text-xs font-semibold text-[#007AB7] hover:underline cursor-pointer"
                  >
                    Clear Pad
                  </button>
                </div>
                <div className="border-2 border-dashed border-[#cdc3d4] rounded-xl bg-[#F8F9FA] overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[140px] cursor-crosshair touch-none"
                  />
                </div>
                <p className="text-[11px] text-[#4D4D4D] mt-1">
                  Sign inside the box above with mouse or finger to certify receipt in good order.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSignatureParcel(null)}
                  className="flex-1 h-12 rounded-lg border-[1.5px] border-[#4D148C] text-[#4D148C] text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSignature}
                  className="flex-1 h-12 rounded-lg bg-[#FF6200] hover:bg-[#e55800] text-white text-sm font-bold cursor-pointer"
                >
                  {hasDrawnSignature ? 'Verify & Complete' : 'Quick Stamp & Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3 MODAL: Customs Duty Resolution */}
      {dutyParcel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            style={{ boxShadow: '0 12px 32px rgba(51, 51, 51, 0.24)' }}
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#E5E7EB]"
          >
            <div className="bg-[#D9381E] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-display text-lg font-bold">Customs Duty Clearance</h3>
              </div>
              <button
                onClick={() => setDutyParcel(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] mb-4">
                <div className="text-xs text-[#4D4D4D]">Waybill Number</div>
                <div className="font-mono-tabular text-base font-bold text-[#1B1C1C] mb-2">
                  {dutyParcel.trackingNumber}
                </div>
                <div className="text-xs text-[#4D4D4D]">Consignment</div>
                <div className="text-sm font-bold text-[#1B1C1C] mb-3">{dutyParcel.nickname}</div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#4D4D4D]">Import Tariff & Bond Fee</span>
                  <span className="font-display text-xl font-extrabold text-[#D9381E] tabular-nums">
                    ${dutyParcel.dutyAmountUsd?.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayDuty}
                className="w-full h-12 rounded-lg bg-[#FF6200] hover:bg-[#e55800] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Authorize Commercial Account & Release Hold</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3 MODAL: Manage Delivery Instructions */}
      {manageParcel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            style={{ boxShadow: '0 12px 32px rgba(51, 51, 51, 0.24)' }}
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-[#E5E7EB]"
          >
            <div className="bg-[#4D148C] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Manage Delivery Preferences</h3>
              <button
                onClick={() => setManageParcel(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4D148C] uppercase tracking-wider mb-1">
                  Drop-Off Gate / Receiving Bay Instructions
                </label>
                <textarea
                  rows={3}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Enter gate code, receiving dock number, or security contact..."
                  className="w-full p-3 rounded-lg border border-[#CCCCCC] focus:border-2 focus:border-[#4D148C] focus:outline-none text-sm"
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] cursor-pointer">
                <input
                  type="checkbox"
                  checked={holdAtHub}
                  onChange={(e) => setHoldAtHub(e.target.checked)}
                  className="w-5 h-5 accent-[#4D148C] rounded"
                />
                <div>
                  <div className="text-sm font-bold text-[#1B1C1C]">
                    Hold at Boston Seaport Station for Pickup
                  </div>
                  <div className="text-xs text-[#4D4D4D]">
                    Keep parcel secured inside vaulted facility until courier collection
                  </div>
                </div>
              </label>

              <button
                onClick={() => {
                  onUpdateParcel({
                    ...manageParcel,
                    deliveryInstructions: holdAtHub
                      ? `HOLD AT HUB · ${customInstructions}`
                      : customInstructions,
                  });
                  setManageParcel(null);
                  showToast(`Updated delivery instructions for ${manageParcel.trackingNumber}`);
                }}
                className="w-full h-12 rounded-lg bg-[#4D148C] hover:bg-[#330066] text-white text-sm font-bold cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3 MODAL: New Shipment / Schedule Pickup */}
      {newShipmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            style={{ boxShadow: '0 12px 32px rgba(51, 51, 51, 0.24)' }}
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden border border-[#E5E7EB]"
          >
            <div className="bg-[#4D148C] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Create Express Shipment & Pickup</h3>
              <button
                onClick={() => setNewShipmentOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateShipment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4D148C] uppercase tracking-wider mb-1">
                  Consignment Description / Nickname
                </label>
                <input
                  type="text"
                  required
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="e.g., Aerospace Turbine Telemetry Module"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#CCCCCC] focus:border-2 focus:border-[#4D148C] focus:outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4D148C] uppercase tracking-wider mb-1">
                    Origin Postal Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#CCCCCC] focus:border-2 focus:border-[#4D148C] focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4D148C] uppercase tracking-wider mb-1">
                    Destination Postal Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#CCCCCC] focus:border-2 focus:border-[#4D148C] focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4D148C] uppercase tracking-wider mb-1">
                    Service Tier
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#CCCCCC] focus:border-2 focus:border-[#4D148C] focus:outline-none text-sm bg-white"
                  >
                    <option>Priority Overnight Express</option>
                    <option>First Overnight AM</option>
                    <option>2Day Air Commercial</option>
                    <option>International Priority Freight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4D148C] uppercase tracking-wider mb-1">
                    Parcel Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#CCCCCC] focus:border-2 focus:border-[#4D148C] focus:outline-none text-sm tabular-nums"
                  />
                </div>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewShipmentOpen(false)}
                  className="flex-1 h-12 rounded-lg border-[1.5px] border-[#4D148C] text-[#4D148C] text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-lg bg-[#FF6200] hover:bg-[#e55800] text-white text-sm font-bold cursor-pointer"
                >
                  Generate Waybill & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
