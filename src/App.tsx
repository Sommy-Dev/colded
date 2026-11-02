import React, { useState } from 'react';
import {
  INITIAL_PARCELS,
  INITIAL_COLD_CHAIN_UNITS,
  ParcelShipment,
  ColdChainUnit,
} from './data/logisticsData';
import { LogisticsPrecisionView } from './components/LogisticsPrecisionView';
import { ColdExTelemetryView } from './components/ColdExTelemetryView';

type ActiveScreen = 'precision' | 'coldex' | 'split' | 'tokens';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('precision');
  const [parcels, setParcels] = useState<ParcelShipment[]>(INITIAL_PARCELS);
  const [coldUnits, setColdUnits] = useState<ColdChainUnit[]>(INITIAL_COLD_CHAIN_UNITS);
  const [openNewShipmentModal, setOpenNewShipmentModal] = useState(false);

  const handleUpdateParcel = (updated: ParcelShipment) => {
    setParcels((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddParcel = (created: ParcelShipment) => {
    setParcels((prev) => [created, ...prev]);
  };

  const handleUpdateColdUnit = (updated: ColdChainUnit) => {
    setColdUnits((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const isColdTheme = activeScreen === 'coldex';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1B1C1C]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header
        className={`sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 border-b transition-colors ${
          isColdTheme
            ? 'bg-[#000f22] text-white border-[#163A5F]'
            : 'bg-[#330066] text-white border-[#4D148C]'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveScreen('precision');
          }}
          className="font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Precision & ColdEx
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="flex items-center gap-6 text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveScreen('precision')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeScreen === 'precision'
                ? 'text-white font-bold border-b-2 border-[#FF6200]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Logistics Precision
          </button>
          <button
            onClick={() => setActiveScreen('coldex')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeScreen === 'coldex'
                ? 'text-white font-bold border-b-2 border-[#39b8fd]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            ColdEx Telemetry
          </button>
          <button
            onClick={() => setActiveScreen('split')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeScreen === 'split'
                ? 'text-white font-bold border-b-2 border-[#FF6200]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Dual Screen
          </button>
          <button
            onClick={() => setActiveScreen('tokens')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeScreen === 'tokens'
                ? 'text-white font-bold border-b-2 border-[#FF6200]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Design Tokens
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => {
              setActiveScreen('precision');
              setOpenNewShipmentModal(true);
            }}
            className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isColdTheme
                ? 'bg-[#0EA5E9] hover:bg-[#0284C7]'
                : 'bg-[#FF6200] hover:bg-[#e55800]'
            }`}
          >
            New Shipment
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <div className="flex-1">
        {activeScreen === 'precision' && (
          <LogisticsPrecisionView
            parcels={parcels}
            onUpdateParcel={handleUpdateParcel}
            onAddParcel={handleAddParcel}
            externalOpenNewModal={openNewShipmentModal}
            onCloseExternalNewModal={() => setOpenNewShipmentModal(false)}
          />
        )}

        {activeScreen === 'coldex' && (
          <ColdExTelemetryView units={coldUnits} onUpdateUnit={handleUpdateColdUnit} />
        )}

        {activeScreen === 'split' && (
          <div className="bg-[#1b1c1c] p-4 sm:p-6">
            <div className="max-w-[1440px] mx-auto mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
              <div>
                <h2 className="font-display text-lg font-bold">
                  Dual-System Interactive Screen Comparison
                </h2>
                <p className="text-xs text-white/70">
                  Left: Screen 1 (Logistics Precision Express Suite) · Right: Screen 2 (ColdEx
                  Cryogenic Fleet Telemetry)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveScreen('precision')}
                  className="px-3 py-1.5 rounded bg-[#4D148C] text-white text-xs font-bold cursor-pointer"
                >
                  Expand Screen 1
                </button>
                <button
                  onClick={() => setActiveScreen('coldex')}
                  className="px-3 py-1.5 rounded bg-[#0A2540] border border-[#39b8fd]/40 text-white text-xs font-bold cursor-pointer"
                >
                  Expand Screen 2
                </button>
              </div>
            </div>
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden border-2 border-[#4D148C] shadow-xl">
                <LogisticsPrecisionView
                  parcels={parcels}
                  onUpdateParcel={handleUpdateParcel}
                  onAddParcel={handleAddParcel}
                />
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-[#0EA5E9] shadow-xl">
                <ColdExTelemetryView units={coldUnits} onUpdateUnit={handleUpdateColdUnit} />
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'tokens' && (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* System 1: Logistics Precision Tokens */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#F2F2F2] pb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#4D148C]">
                      Attachment 1 · Image_17_cb12c780
                    </div>
                    <h2 className="font-display text-2xl font-extrabold text-[#1B1C1C]">
                      Logistics Precision Design System
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveScreen('precision')}
                    className="px-4 py-2 rounded-lg bg-[#FF6200] text-white text-xs font-bold cursor-pointer"
                  >
                    Open Screen
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Primary Purple', hex: '#4D148C' },
                    { name: 'Primary Deep', hex: '#330066' },
                    { name: 'Secondary Orange', hex: '#FF6200' },
                    { name: 'Tertiary Waypoint', hex: '#007AB7' },
                    { name: 'Status Delivered', hex: '#008744' },
                    { name: 'Status Alert', hex: '#D9381E' },
                  ].map((swatch) => (
                    <div
                      key={swatch.name}
                      className="p-3 rounded-lg border border-[#E5E7EB] flex items-center gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded-md shrink-0 border border-black/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div>
                        <div className="text-xs font-bold text-[#1B1C1C]">{swatch.name}</div>
                        <div className="font-mono-tabular text-[11px] text-[#4D4D4D]">
                          {swatch.hex}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-[#4D4D4D] space-y-1.5 pt-2">
                  <p>
                    <strong className="text-[#1B1C1C]">Typography:</strong> Hanken Grotesk Display
                    (800/700/600) with tabular numerals for tracking IDs, weight calculations, and
                    ETA windows.
                  </p>
                  <p>
                    <strong className="text-[#1B1C1C]">Key Components:</strong> 52px Barcode Search
                    Input, Stepper/Progress Track, Signature Capture Pad, and Filter Chips.
                  </p>
                </div>
              </div>

              {/* System 2: ColdEx Tokens */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                      Attachment 2 · Image_18_ba29c4d5
                    </div>
                    <h2 className="font-display text-2xl font-bold text-[#0A2540]">
                      ColdEx Cryogenic Design System
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveScreen('coldex')}
                    className="px-4 py-2 rounded bg-[#0A2540] text-white text-xs font-semibold cursor-pointer"
                  >
                    Open Screen
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Deep Ocean Navy', hex: '#0A2540' },
                    { name: 'Icy Telemetry Blue', hex: '#0EA5E9' },
                    { name: 'Arctic Mint', hex: '#10B981' },
                    { name: 'Cool Slate', hex: '#64748B' },
                    { name: 'Alert Coral', hex: '#EF4444' },
                    { name: 'Sub-Zero Amber', hex: '#F59E0B' },
                  ].map((swatch) => (
                    <div
                      key={swatch.name}
                      className="p-3 rounded border border-[#E2E8F0] flex items-center gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded shrink-0 border border-black/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div>
                        <div className="text-xs font-bold text-[#0B1C30]">{swatch.name}</div>
                        <div className="font-mono-tabular text-[11px] text-[#64748B]">
                          {swatch.hex}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-[#475569] space-y-1.5 pt-2">
                  <p>
                    <strong className="text-[#0A2540]">Typography:</strong> Hanken Grotesk headlines
                    paired with Inter body/telemetry controls and strict tabular numerals.
                  </p>
                  <p>
                    <strong className="text-[#0A2540]">Specialized Components:</strong> Temperature
                    Sparkline Widget with Arctic Mint baseline safe band, Thermal Seal Verification
                    Badge with double border & SHA256 hash tokens, and 3dp Glassmorphic Setpoint
                    Drawer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
