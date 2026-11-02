---
name: ColdEx
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#001209'
  on-tertiary: '#ffffff'
  tertiary-container: '#002a1a'
  on-tertiary-container: '#009e6d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The visual identity embodies cryogenic precision, industrial reliability, and real-time telemetric control. Designed for cold-chain fleet operators, pharmaceutical logistics managers, and temperature-sensitive freight dispatchers, the aesthetic balances high-density operational telemetry with crystalline clarity.

The interface combines **Corporate Modern** rigor with **Tactile Glassmorphic** refrigeration metaphors:
- Crisp, clinical surfaces evoke controlled environments and clean-room specifications.
- Precision contrast ensures readability in high-glare transit yards, refrigerated storage facilities, and command control centers.
- Micro-interactions communicate physical state changes: status pulses mirror sensor telemetry, temperature anomalies register instantly through deliberate chromatic shifts, and structural framing communicates structural protection.

## Colors

The palette mirrors sub-zero monitoring hardware and pristine refrigeration chambers:

- **Primary (`#0A2540` - Deep Ocean Navy):** Anchors core actions, structural headers, high-level navigation, and prominent numeric metrics. Represents enterprise reliability and structural steel.
- **Secondary (`#0EA5E9` - Icy Telemetry Blue):** Directs active interactive states, selected pathways, operational routes, and live sensor readings.
- **Tertiary (`#10B981` - Arctic Mint):** Communicates optimal refrigeration ranges, calibrated sensors, safety thresholds, and route completion.
- **Neutral (`#64748B` - Cool Slate):** Provides structural boundaries, secondary labels, divider lines, and dormant status indicators. Tinted with a slight cool blue cast to eliminate dirty grays.

### Functional Roles
- **Canvas Base:** Pure arctic off-white (`#F8FAFC`) to minimize glare while preserving high optical contrast against dark data blocks.
- **Surface Elevation:** True white (`#FFFFFF`) with razor-thin cold-slate borders (`#E2E8F0`).
- **Telemetry Critical:** Alert Coral (`#EF4444`) reserved exclusively for temperature breaches, door-ajar alerts, and route failures.
- **Telemetry Warning:** Sub-zero Amber (`#F59E0B`) used for humidity fluctuations and pre-breach sensor warnings.

## Typography

Typography prioritizes tabular numerical legibility and glanceability under operational pressure:

- **Hanken Grotesk** serves as the display and headline typeface, lending crisp geometry and architectural balance to platform headers, fleet IDs, and temperature summaries.
- **Inter** handles all body content, UI controls, dynamic labels, and telemetry values. Inter's tall x-height and neutral grotesque construction eliminate ambiguity between critical numeric readings (e.g., distinguishing `8` from `B`, or `0` from `O`).
- **Tabular Numerics:** Enable `font-variant-numeric: tabular-nums` globally across all telemetry data cards, GPS coordinates, timestamp feeds, and setpoint monitors to prevent visual jitter during live stream updates.
- **Case Hierarchy:** All sensor metadata badges and unit denominators use uppercase tracking with `label-sm` to maintain industrial discipline.

## Layout & Spacing

The layout model employs a fluid 12-column responsive grid paired with strict 4px/8px incremental component rhythm:

- **Desktop (1280px+):** 12 columns, 24px (`1.5rem`) gutters, 32px (`2rem`) outer margin. Telemetry dashboards feature a fixed 280px collapsible telemetry sidebar and a flexible data canvas spanning 12 auto-fitting columns.
- **Tablet (768px - 1279px):** 8 columns, 20px (`1.25rem`) gutters, 24px (`1.5rem`) outer margin. Primary metrics collapse into 2-by-2 matrices, while data tables transition into vertically scrollable summary cards.
- **Mobile (Below 768px):** 4 columns, 16px (`1rem`) gutters, 16px (`1rem`) margins. Navigation shifts to a persistent bottom drawer or top app bar; dense tables collapse into stacked cards with sticky critical KPI indicators.
- **Data Spacing Rules:** Container padding uses `space-md` for standard cards and `space-lg` for modal inspect drawers. High-density telemetric tables compress vertical cell padding to `space-sm` to maximize visible payload logs on single viewports.

## Elevation & Depth

Visual hierarchy uses a **Tonal Outlines & Cool-Tinted Shadows** system that prevents mud and simulates crystal-clear glass chambers:

- **Flat / Base Tier (0dp):** Canvas background (`#F8FAFC`). No shadow. Structural dividers use 1px solid `#E2E8F0`.
- **Card / Surface Tier (1dp):** Pure `#FFFFFF` surface enclosed by a 1px solid cold-slate stroke (`#E2E8F0`). Shadow: `0 1px 3px 0 rgba(10, 37, 64, 0.04), 0 1px 2px -1px rgba(10, 37, 64, 0.02)`.
- **Interactive / Float Tier (2dp):** Active freight units, hovering shipment cards, and focused filter sets. Shadow: `0 4px 12px -2px rgba(10, 37, 64, 0.08), 0 2px 6px -2px rgba(14, 165, 239, 0.06)`.
- **Overlay / Modal Tier (3dp):** Dispatch drawers, temperature drill-down dialogs, and alert banners. Surface uses pure white with an optional sub-zero glass frost backdrop blur (`backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.92)`). Shadow: `0 20px 25px -5px rgba(10, 37, 64, 0.12), 0 8px 10px -6px rgba(10, 37, 64, 0.06)`.
- **Accent Glows:** High-priority status nodes utilize zero-blur color underlays (`box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2)`) to indicate active, real-time refrigeration without obscuring neighboring coordinates.

## Shapes

The design system employs **Soft (`1`)** roundedness to balance digital ergonomics with mechanical precision:

- **Standard Base Radii (`0.25rem` / 4px):** Form controls, inputs, data grid cells, badges, and inline status chips. The tight corner radius recalls industrial control instrumentation and handheld scanning terminals.
- **Large Surfaces (`rounded-lg` / `0.5rem` / 8px):** Telemetry cards, charts, shipment manifest panels, and alert dialogs.
- **Extra Large Containers (`rounded-xl` / `0.75rem` / 12px):** Top-level application overlays, persistent sidebars, and slide-in diagnostic drawers.
- **Pill Exceptions (`9999px`):** Used strictly for isolated status badges (e.g., "COLD STABLE", "REEFER ACTIVE") and circular floating telemetric trigger beacons.

## Components

### Buttons
- **Primary:** Deep Ocean Navy (`#0A2540`) background, white text (`#FFFFFF`), `rounded` (4px). On hover: `#163A5F` with subtle lift. On focus: 2px offset ring in `#0EA5E9`.
- **Secondary (Telemetry/Action):** Icy Blue tint background (`#F0F9FF`), `#0284C7` text, 1px solid `#BAE6FD`. On hover: `#E0F2FE`.
- **Tertiary / Eco Highlight:** Arctic Mint tint background (`#ECFDF5`), `#059669` text, 1px solid `#A7F3D0`. Used for optimal setpoint confirmations.
- **Ghost:** Transparent background with slate text (`#475569`).

### Input Fields & Controls
- **Text Inputs & Dropdowns:** 1px solid `#CBD5E1` border on `#FFFFFF` base, 4px border radius. Padding: `space-sm` vertical, `space-md` horizontal.
- **Focus State:** 1px solid `#0EA5E9` with a 3px ambient focus aura (`rgba(14, 165, 233, 0.15)`).
- **Checkboxes & Radios:** Sharp square and circular footprints with 1.5px border (`#94A3B8`). Selected state fills with `#0A2540` containing an optical white mark.

### Telemetry Cards & Manifest Containers
- **Card Structure:** 1px border `#E2E8F0`, 8px border radius, white surface with `space-lg` internal padding.
- **Header:** Features bold metadata, vehicle/unit ID, and an inline status chip on the right edge.
- **Telemetry Readout:** High-visibility numeral in `headline-lg` with unit indicator in `label-sm` (e.g., `-20.4 °C`).

### Status Badges & Chips
- **Nominal / Frozen Safe:** Arctic Mint background (`#D1FAE5`), dark emerald text (`#065F46`), 2px pulsing dot in `#10B981`.
- **Reefer Active / In Transit:** Ice Blue background (`#E0F2FE`), dark cyan text (`#0369A1`).
- **Defrost / Warning:** Warm Amber background (`#FEF3C7`), dark amber text (`#92400E`).
- **Excursion / Alarm:** Crimson background (`#FEE2E2`), deep red text (`#991B1B`).

### Data Tables & Sensor Feeds
- **Header Row:** Crisp slate background (`#F8FAFC`), uppercase `label-sm` text in `#64748B`, 1px bottom border `#E2E8F0`.
- **Data Rows:** Alternating row highlights disabled in favor of clear 1px bottom borders. Hover state displays cold-tinted highlight (`#F0F9FF`) across the entire row.
- **Numerical Alignment:** Right-align all temperature readings, weights, elapsed times, and GPS timestamps using tabular figure weights.

### Specialized Logistics Components
- **Temperature Sparkline Widget:** Micro-charts embedded within shipment summaries; baseline zone is shaded in arctic mint, with excursion areas spikes transitioning into red gradient fills.
- **Thermal Seal Verification Badge:** A security-stamped indicator confirming trailer door integrity, using a double 1px border and monospace-styled cryptographic hash tokens.