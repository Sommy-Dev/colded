import React, { useState, useEffect } from 'react';
import {
  ThermometerSnowflake,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Sliders,
  Search,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  AlertOctagon,
  CheckCircle2,
  Droplets,
  Gauge,
  Navigation,
  Lock,
  X,
  ArrowUpDown,
} from 'lucide-react';
import { ColdChainUnit, ColdChainStatus } from '../data/logisticsData';

interface ColdExTelemetryViewProps {
  units: ColdChainUnit[];
  onUpdateUnit: (updated: ColdChainUnit) => void;
}

/**
 * Specialized Component 1: Temperature Sparkline Widget
 * Micro-chart embedded within shipment summaries; baseline zone is shaded in Arctic Mint (#10B981),
 * with excursion areas spikes transitioning into red gradient fills (#EF4444).
 */
const TemperatureSparklineWidget: React.FC<{
  data: number[];
  minSafe: number;
  maxSafe: number;
  isExcursion: boolean;
}> = ({ data, minSafe, maxSafe, isExcursion }) => {
  const width = 260;
  const height = 58;
  const allVals = [...data, minSafe, maxSafe];
  const minVal = Math.min(...allVals) - 1.5;
  const maxVal = Math.max(...allVals) + 1.5;
  const range = Math.max(maxVal - minVal, 1);

  const toY = (val: number) => height - ((val - minVal) / range) * (height - 12) - 6;
  const toX = (idx: number) => (idx / Math.max(data.length - 1, 1)) * (width - 12) + 6;

  const safeTopY = Math.max(2, Math.min(height - 4, toY(maxSafe)));
  const safeBottomY = Math.max(4, Math.min(height - 2, toY(minSafe)));
  const safeBandHeight = Math.max(6, Math.abs(safeBottomY - safeTopY));

  const points = data.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const areaPoints = `${toX(0).toFixed(1)},${height} ${points} ${toX(data.length - 1).toFixed(
    1
  )},${height}`;

  const strokeColor = isExcursion ? '#EF4444' : '#0EA5E9';
  const gradId = `spark-grad-${isExcursion ? 'alarm' : 'nominal'}-${Math.round(minSafe)}`;

  return (
    <div className="relative bg-[#F8FAFC] rounded border border-[#E2E8F0] px-2.5 py-2">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
        <span>12-Hr Thermal Profile</span>
        <span className="tabular-nums text-[#0A2540]">
          Safe Band: {minSafe.toFixed(0)}°C to {maxSafe.toFixed(0)}°C
        </span>
      </div>
      <svg className="w-full h-[54px] overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={isExcursion ? '#EF4444' : '#10B981'}
              stopOpacity={isExcursion ? '0.32' : '0.18'}
            />
            <stop
              offset="100%"
              stopColor={isExcursion ? '#EF4444' : '#10B981'}
              stopOpacity="0.0"
            />
          </linearGradient>
        </defs>

        {/* Shaded Arctic Mint Baseline Safe Zone */}
        <rect
          x="0"
          y={Math.min(safeTopY, safeBottomY)}
          width={width}
          height={safeBandHeight}
          fill="#10B981"
          fillOpacity="0.14"
          rx="2"
        />

        {/* Upper Threshold Dashed Line */}
        <line
          x1="0"
          y1={safeTopY}
          x2={width}
          y2={safeTopY}
          stroke={isExcursion ? '#EF4444' : '#10B981'}
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeOpacity="0.65"
        />

        {/* Area Fill Under Curve */}
        <polygon points={areaPoints} fill={`url(#${gradId})`} />

        {/* Temperature Telemetry Line */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Current Reading Endpoint Node */}
        {data.length > 0 && (
          <circle
            cx={toX(data.length - 1)}
            cy={toY(data[data.length - 1])}
            r="3.5"
            fill={isExcursion ? '#EF4444' : '#10B981'}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
};

/**
 * Specialized Component 2: Thermal Seal Verification Badge
 * Security-stamped indicator confirming trailer door integrity,
 * using a double 1px border and monospace-styled cryptographic hash tokens.
 */
const ThermalSealVerificationBadge: React.FC<{
  doorIntegrity: 'SEALED' | 'AJAR ALERT';
  sealHash: string;
  sealTimestamp: string;
}> = ({ doorIntegrity, sealHash, sealTimestamp }) => {
  const isSealed = doorIntegrity === 'SEALED';
  return (
    <div
      className={`px-2.5 py-1.5 rounded border-double border-4 flex items-center justify-between gap-2 text-[11px] ${
        isSealed
          ? 'border-[#CBD5E1] bg-[#F8FAFC] text-[#0A2540]'
          : 'border-[#EF4444] bg-[#FEE2E2]/60 text-[#991B1B]'
      }`}
    >
      <div className="flex items-center gap-1.5 font-semibold tracking-wider uppercase">
        <Lock className={`w-3.5 h-3.5 ${isSealed ? 'text-[#10B981]' : 'text-[#EF4444]'}`} />
        <span>DOOR {doorIntegrity}</span>
      </div>
      <div className="font-mono-tabular text-[11px] font-medium text-[#475569]">
        {sealHash} · {sealTimestamp}
      </div>
    </div>
  );
};

export const ColdExTelemetryView: React.FC<ColdExTelemetryViewProps> = ({
  units,
  onUpdateUnit,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ColdChainStatus>('ALL');
  const [corridorFilter, setCorridorFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectUnit, setInspectUnit] = useState<ColdChainUnit | null>(null);
  const [liveStreamEnabled, setLiveStreamEnabled] = useState(true);
  const [customSetpoint, setCustomSetpoint] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Subtle live sensor stream jitter for tabular-nums demonstration
  const [tickOffset, setTickOffset] = useState(0);
  useEffect(() => {
    if (!liveStreamEnabled) return;
    const interval = setInterval(() => {
      setTickOffset((prev) => (prev === 0 ? 0.1 : prev === 0.1 ? -0.1 : 0));
    }, 2800);
    return () => clearInterval(interval);
  }, [liveStreamEnabled]);

  const triggerNotice = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const corridors = Array.from(new Set(units.map((u) => u.corridor)));

  const filteredUnits = units.filter((u) => {
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesCorridor = corridorFilter === 'ALL' || u.corridor === corridorFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      u.unitCode.toLowerCase().includes(q) ||
      u.manifestTitle.toLowerCase().includes(q) ||
      u.corridor.toLowerCase().includes(q) ||
      u.originHub.toLowerCase().includes(q) ||
      u.destinationHub.toLowerCase().includes(q);
    return matchesStatus && matchesCorridor && matchesQuery;
  });

  const getStatusChipStyle = (status: ColdChainStatus) => {
    switch (status) {
      case 'Nominal':
        return {
          bg: '#D1FAE5',
          text: '#065F46',
          border: '#A7F3D0',
        };
      case 'Reefer Active':
        return {
          bg: '#E0F2FE',
          text: '#0369A1',
          border: '#BAE6FD',
        };
      case 'Defrost Warning':
        return {
          bg: '#FEF3C7',
          text: '#92400E',
          border: '#FDE68A',
        };
      case 'Excursion Alarm':
        return {
          bg: '#FEE2E2',
          text: '#991B1B',
          border: '#FECACA',
        };
    }
  };

  const handleOpenInspect = (unit: ColdChainUnit) => {
    setInspectUnit(unit);
    setCustomSetpoint(unit.setpointTempC.toFixed(1));
  };

  const handleApplySetpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectUnit) return;
    const parsed = parseFloat(customSetpoint);
    if (isNaN(parsed)) return;

    const updatedHistory = [...inspectUnit.sparklineHistory.slice(1), parsed];
    const updated: ColdChainUnit = {
      ...inspectUnit,
      setpointTempC: parsed,
      currentTempC: parsed,
      status: 'Nominal',
      statusLabel: 'COLD STABLE',
      doorIntegrity: 'SEALED',
      sealHash: '0x9A4F·C812·VERIFIED',
      sealTimestamp: 'JUST LOCKED',
      sparklineHistory: updatedHistory,
    };
    onUpdateUnit(updated);
    setInspectUnit(updated);
    triggerNotice(
      `${updated.unitCode} calibrated to ${parsed.toFixed(1)} °C & cryptographic door seal re-verified.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1C30] flex flex-col">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            boxShadow:
              '0 20px 25px -5px rgba(10, 37, 64, 0.12), 0 8px 10px -6px rgba(10, 37, 64, 0.06)',
          }}
          className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-3 rounded-lg border border-[#0EA5E9]/40 flex items-center gap-3 text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Cryogenic Command Header (#0A2540 Deep Ocean Navy) */}
      <div className="bg-[#0A2540] text-white border-b border-[#163A5F]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded bg-[#163A5F] hover:bg-[#1e4b7a] text-[#39b8fd] transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand Telemetry Sidebar' : 'Collapse Telemetry Sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#39b8fd]">
                <span>ColdEx Cryogenic Fleet Control</span>
                <span aria-hidden="true">·</span>
                <span>ISO-21973 Pharma Telemetry</span>
              </div>
              <h1 className="font-display text-2xl sm:text-[30px] font-bold tracking-[-0.02em] text-white">
                Sub-Zero Chamber & Reefer Telemetry Matrix
              </h1>
            </div>
          </div>

          {/* Right Header Telemetry Summary & Stream Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 px-3.5 py-2 rounded bg-[#000f22]/70 border border-white/10 text-xs tabular-nums">
              <div>
                <span className="text-[#768dad] uppercase text-[10px] font-semibold block">
                  Active Reefers
                </span>
                <span className="font-mono-tabular font-bold text-white text-sm">
                  {units.length} / {units.length}
                </span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="text-[#768dad] uppercase text-[10px] font-semibold block">
                  Cold Stable
                </span>
                <span className="font-mono-tabular font-bold text-[#10B981] text-sm">
                  {units.filter((u) => u.status === 'Nominal' || u.status === 'Reefer Active').length}
                </span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="text-[#768dad] uppercase text-[10px] font-semibold block">
                  Excursion Alerts
                </span>
                <span className="font-mono-tabular font-bold text-[#EF4444] text-sm">
                  {units.filter((u) => u.status === 'Excursion Alarm').length}
                </span>
              </div>
            </div>

            <button
              onClick={() => setLiveStreamEnabled(!liveStreamEnabled)}
              className={`h-10 px-3.5 rounded text-xs font-semibold flex items-center gap-2 border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                liveStreamEnabled
                  ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                  : 'bg-[#163A5F] text-white border-white/15'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${liveStreamEnabled ? 'animate-spin' : ''}`} />
              <span>{liveStreamEnabled ? 'Telemetry Stream: LIVE' : 'Stream Paused'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Container: Fixed 280px Collapsible Sidebar + 12-Col Data Canvas */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 flex flex-col lg:flex-row">
        {/* Fixed 280px Collapsible Telemetry Sidebar */}
        {!sidebarCollapsed && (
          <aside className="w-full lg:w-[280px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-[#E2E8F0] p-5 space-y-6">
            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-2">
                Filter Fleet or Manifest
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Unit ID, biologics lot..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#0EA5E9] focus:ring-3 focus:ring-[#0EA5E9]/15"
                />
              </div>
            </div>

            {/* Refrigeration Status Filters */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-2">
                Chamber Telemetry State
              </div>
              <div className="space-y-1">
                {(['ALL', 'Nominal', 'Reefer Active', 'Defrost Warning', 'Excursion Alarm'] as const).map(
                  (st) => {
                    const active = statusFilter === st;
                    const count =
                      st === 'ALL' ? units.length : units.filter((u) => u.status === st).length;
                    return (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`w-full px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#0A2540] text-white'
                            : 'text-[#475569] hover:bg-[#F0F9FF] hover:text-[#0284C7]'
                        }`}
                      >
                        <span>{st === 'ALL' ? 'All Telemetry Units' : st}</span>
                        <span
                          className={`font-mono-tabular text-[11px] ${
                            active ? 'text-[#39b8fd]' : 'text-[#64748B]'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Transit Corridor Filter */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-2">
                Cryo Transit Corridors
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setCorridorFilter('ALL')}
                  className={`w-full px-3 py-1.5 rounded text-left text-xs font-medium transition-colors cursor-pointer ${
                    corridorFilter === 'ALL'
                      ? 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] font-semibold'
                      : 'text-[#475569] hover:bg-[#F8FAFC]'
                  }`}
                >
                  All Active Corridors ({corridors.length})
                </button>
                {corridors.map((corridor) => (
                  <button
                    key={corridor}
                    onClick={() => setCorridorFilter(corridor)}
                    className={`w-full px-3 py-1.5 rounded text-left text-xs font-medium truncate transition-colors cursor-pointer ${
                      corridorFilter === corridor
                        ? 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] font-semibold'
                        : 'text-[#475569] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {corridor}
                  </button>
                ))}
              </div>
            </div>

            {/* Cryogenic Calibration Protocol Box */}
            <div className="p-3.5 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#0369A1]">
                21 CFR Part 11 Audit Log
              </div>
              <p className="text-xs text-[#004666] leading-relaxed">
                All trailer thermal seals are cryptographically hashed every 180 seconds via dual
                NIST-traceable probes.
              </p>
            </div>
          </aside>
        )}

        {/* Flexible 12-Column Data Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-x-hidden">
          {/* Excursion Alert Banner if any unit is in Excursion Alarm */}
          {units.some((u) => u.status === 'Excursion Alarm') && (
            <div className="bg-[#FEE2E2] border border-[#EF4444] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
                    Critical Thermal Excursion & Door Ajar Breach Detected
                  </div>
                  <p className="text-xs text-[#991B1B] mt-0.5">
                    Unit <span className="font-mono-tabular font-bold">CX-REEFER-104</span> is
                    reporting <span className="font-mono-tabular font-bold">+9.6 °C</span> (Setpoint
                    +4.0 °C) on Midwest Air-Surface Link. Immediate setpoint purge required.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const alarmUnit = units.find((u) => u.status === 'Excursion Alarm');
                  if (alarmUnit) handleOpenInspect(alarmUnit);
                }}
                className="px-4 py-2 rounded bg-[#0A2540] hover:bg-[#163A5F] text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Inspect & Recalibrate Unit
              </button>
            </div>
          )}

          {/* Section 1: Telemetry Cards & Manifest Containers (12-column grid) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#0A2540]">
                  Live Refrigeration Chambers & Sparkline Profiles
                </h2>
                <p className="text-xs text-[#64748B]">
                  Click any telemetry manifest card to open the sub-zero setpoint & seal diagnostic
                  drawer
                </p>
              </div>
              <span className="text-xs font-mono-tabular text-[#64748B]">
                SHOWING {filteredUnits.length} UNITS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUnits.map((unit) => {
                const chip = getStatusChipStyle(unit.status);
                const isAlarm = unit.status === 'Excursion Alarm';
                const liveTemp =
                  liveStreamEnabled && !isAlarm
                    ? +(unit.currentTempC + tickOffset).toFixed(1)
                    : unit.currentTempC;
                const delta = +(liveTemp - unit.setpointTempC).toFixed(1);

                return (
                  <div
                    key={unit.id}
                    onClick={() => handleOpenInspect(unit)}
                    style={{
                      boxShadow: isAlarm
                        ? '0 0 0 3px rgba(239, 68, 68, 0.18), 0 4px 12px -2px rgba(10, 37, 64, 0.08)'
                        : '0 1px 3px 0 rgba(10, 37, 64, 0.04), 0 1px 2px -1px rgba(10, 37, 64, 0.02)',
                    }}
                    className={`bg-white rounded-lg p-6 border transition-all cursor-pointer hover:shadow-md ${
                      isAlarm
                        ? 'border-[#EF4444]'
                        : 'border-[#E2E8F0] hover:border-[#0EA5E9]'
                    }`}
                  >
                    {/* Card Header: Unit ID & Status Chip */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="font-mono-tabular text-sm font-bold text-[#0A2540]">
                          {unit.unitCode}
                        </div>
                        <div className="text-xs text-[#64748B] font-medium truncate max-w-[210px]">
                          {unit.corridor}
                        </div>
                      </div>

                      <span
                        style={{
                          backgroundColor: chip.bg,
                          color: chip.text,
                          borderColor: chip.border,
                        }}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.04em] uppercase border whitespace-nowrap shrink-0"
                      >
                        {unit.statusLabel}
                      </span>
                    </div>

                    {/* Manifest Title */}
                    <h3 className="font-display text-[16px] font-semibold text-[#0B1C30] mb-4 line-clamp-1">
                      {unit.manifestTitle}
                    </h3>

                    {/* High-Visibility Telemetry Readout (headline-lg 32px tabular-nums) */}
                    <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                          Chamber Probe Primary
                        </div>
                        <div
                          className={`font-display text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums mt-1 ${
                            isAlarm ? 'text-[#EF4444]' : 'text-[#0A2540]'
                          }`}
                        >
                          {liveTemp > 0 ? `+${liveTemp.toFixed(1)}` : liveTemp.toFixed(1)}
                          <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#64748B] ml-1">
                            °C
                          </span>
                        </div>
                      </div>

                      <div className="text-right tabular-nums">
                        <div className="text-[11px] font-semibold text-[#64748B]">
                          SETPOINT:{' '}
                          <span className="text-[#0A2540] font-mono-tabular">
                            {unit.setpointTempC > 0
                              ? `+${unit.setpointTempC.toFixed(1)}`
                              : unit.setpointTempC.toFixed(1)}{' '}
                            °C
                          </span>
                        </div>
                        <div
                          className={`text-xs font-mono-tabular font-semibold mt-0.5 ${
                            Math.abs(delta) > 2.5 ? 'text-[#EF4444]' : 'text-[#059669]'
                          }`}
                        >
                          Δ {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} °C · RH{' '}
                          {unit.humidityPct.toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Specialized Component 1: Temperature Sparkline Widget */}
                    <div className="mb-3">
                      <TemperatureSparklineWidget
                        data={unit.sparklineHistory}
                        minSafe={unit.minSafeTempC}
                        maxSafe={unit.maxSafeTempC}
                        isExcursion={isAlarm}
                      />
                    </div>

                    {/* Specialized Component 2: Thermal Seal Verification Badge */}
                    <ThermalSealVerificationBadge
                      doorIntegrity={unit.doorIntegrity}
                      sealHash={unit.sealHash}
                      sealTimestamp={unit.sealTimestamp}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: High-Density Sensor Feeds & Data Table */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#0A2540]">
                  High-Density Telemetry Sensor Feed & Payload Logs
                </h3>
                <p className="text-xs text-[#64748B]">
                  All numerical readings right-aligned with strict tabular-nums formatting
                </p>
              </div>
              <div className="text-xs font-mono-tabular text-[#0284C7] bg-[#F0F9FF] px-3 py-1.5 rounded border border-[#BAE6FD]">
                SYNC INTERVAL: 2.8s · NIST CALIBRATED
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                    <th className="py-2.5 px-4">Unit ID</th>
                    <th className="py-2.5 px-4">Biologics / Cold Manifest</th>
                    <th className="py-2.5 px-4">Origin → Destination</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Probe Temp</th>
                    <th className="py-2.5 px-4 text-right">Setpoint</th>
                    <th className="py-2.5 px-4 text-right">Humidity</th>
                    <th className="py-2.5 px-4 text-right">Payload Wt</th>
                    <th className="py-2.5 px-4 text-right">Elapsed</th>
                    <th className="py-2.5 px-4 text-right">GPS Coordinates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                  {filteredUnits.map((u) => {
                    const chip = getStatusChipStyle(u.status);
                    const isAlarm = u.status === 'Excursion Alarm';
                    return (
                      <tr
                        key={u.id}
                        onClick={() => handleOpenInspect(u)}
                        className="hover:bg-[#F0F9FF] transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-4 font-mono-tabular font-bold text-[#0A2540] whitespace-nowrap">
                          {u.unitCode}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-[#0B1C30] max-w-[220px] truncate">
                          {u.manifestTitle}
                        </td>
                        <td className="py-2.5 px-4 text-[#475569] whitespace-nowrap">
                          {u.originHub} → {u.destinationHub}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span
                            style={{
                              backgroundColor: chip.bg,
                              color: chip.text,
                            }}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.04em]"
                          >
                            {u.statusLabel}
                          </span>
                        </td>
                        <td
                          className={`py-2.5 px-4 text-right font-mono-tabular font-bold whitespace-nowrap ${
                            isAlarm ? 'text-[#EF4444]' : 'text-[#0A2540]'
                          }`}
                        >
                          {u.currentTempC > 0
                            ? `+${u.currentTempC.toFixed(1)}`
                            : u.currentTempC.toFixed(1)}{' '}
                          °C
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono-tabular text-[#475569] whitespace-nowrap">
                          {u.setpointTempC > 0
                            ? `+${u.setpointTempC.toFixed(1)}`
                            : u.setpointTempC.toFixed(1)}{' '}
                          °C
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono-tabular text-[#475569] whitespace-nowrap">
                          {u.humidityPct.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono-tabular text-[#0B1C30] whitespace-nowrap">
                          {u.weightKg.toLocaleString('en-US', { minimumFractionDigits: 1 })} kg
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono-tabular text-[#475569] whitespace-nowrap">
                          {u.elapsedTime}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono-tabular text-[#64748B] whitespace-nowrap">
                          {u.gpsCoords}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay / Modal Tier (3dp): Sub-Zero Glass Frost Temperature Drill-Down & Dispatch Drawer */}
      {inspectUnit && (
        <div className="fixed inset-0 z-50 bg-[#0A2540]/40 backdrop-blur-xs flex justify-end">
          <div
            style={{
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              boxShadow:
                '0 20px 25px -5px rgba(10, 37, 64, 0.12), 0 8px 10px -6px rgba(10, 37, 64, 0.06)',
            }}
            className="w-full max-w-lg h-full border-l border-[#E2E8F0] p-6 overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#0284C7]">
                    Cryogenic Diagnostic & Dispatch Drawer
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#0A2540] mt-0.5">
                    {inspectUnit.unitCode}
                  </h3>
                  <p className="text-xs text-[#64748B]">{inspectUnit.manifestTitle}</p>
                </div>
                <button
                  onClick={() => setInspectUnit(null)}
                  className="p-2 rounded bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#475569] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Chamber Readout Matrix */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                    Return Air Probe
                  </div>
                  <div className="font-display text-2xl font-bold text-[#0A2540] tabular-nums mt-1">
                    {inspectUnit.currentTempC.toFixed(1)} °C
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                    Compressor RPM
                  </div>
                  <div className="font-display text-2xl font-bold text-[#0284C7] tabular-nums mt-1">
                    {inspectUnit.compressorRpm}
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                    DC Bus Voltage
                  </div>
                  <div className="font-display text-2xl font-bold text-[#059669] tabular-nums mt-1">
                    {inspectUnit.batteryVoltage.toFixed(1)} V
                  </div>
                </div>
              </div>

              {/* Sparkline Profile */}
              <TemperatureSparklineWidget
                data={inspectUnit.sparklineHistory}
                minSafe={inspectUnit.minSafeTempC}
                maxSafe={inspectUnit.maxSafeTempC}
                isExcursion={inspectUnit.status === 'Excursion Alarm'}
              />

              {/* Thermal Seal Verification */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-2">
                  Cryptographic Trailer Door Seal
                </div>
                <ThermalSealVerificationBadge
                  doorIntegrity={inspectUnit.doorIntegrity}
                  sealHash={inspectUnit.sealHash}
                  sealTimestamp={inspectUnit.sealTimestamp}
                />
              </div>

              {/* Setpoint Calibration Form */}
              <form
                onSubmit={handleApplySetpoint}
                className="p-4 rounded-lg bg-white border border-[#E2E8F0] space-y-4"
              >
                <div className="text-xs font-bold uppercase tracking-[0.04em] text-[#0A2540]">
                  Remote Setpoint Command & Excursion Reset
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">
                    Target Chamber Setpoint (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customSetpoint}
                    onChange={(e) => setCustomSetpoint(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] focus:outline-none focus:border-[#0EA5E9] font-mono-tabular text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded bg-[#0A2540] hover:bg-[#163A5F] text-white text-xs font-semibold cursor-pointer"
                  >
                    Transmit Setpoint & Re-Seal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSetpoint(inspectUnit.setpointTempC.toFixed(1));
                      const updated: ColdChainUnit = {
                        ...inspectUnit,
                        currentTempC: inspectUnit.setpointTempC,
                        status: 'Nominal',
                        statusLabel: 'COLD STABLE',
                        doorIntegrity: 'SEALED',
                        sealHash: '0x7E22·A901·PURGED',
                        sealTimestamp: 'NOW',
                      };
                      onUpdateUnit(updated);
                      setInspectUnit(updated);
                      triggerNotice(
                        `Liquid nitrogen blast purge executed on ${inspectUnit.unitCode}.`
                      );
                    }}
                    className="py-2.5 px-3.5 rounded bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] text-xs font-semibold cursor-pointer"
                  >
                    LN2 Rapid Purge
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span>CARGO CLASS: {inspectUnit.cargoClass}</span>
              <button
                onClick={() => setInspectUnit(null)}
                className="font-semibold text-[#0A2540] hover:underline cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
