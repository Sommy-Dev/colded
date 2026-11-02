---
name: Logistics Precision
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#4b4452'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#7c7483'
  outline-variant: '#cdc3d4'
  surface-tint: '#7544b5'
  primary: '#330066'
  on-primary: '#ffffff'
  primary-container: '#4d148c'
  on-primary-container: '#bc89ff'
  inverse-primary: '#d8b9ff'
  secondary: '#a53d00'
  on-secondary: '#ffffff'
  secondary-container: '#f85f00'
  on-secondary-container: '#4e1800'
  tertiary: '#00253c'
  on-tertiary: '#ffffff'
  tertiary-container: '#003c5d'
  on-tertiary-container: '#52a9e9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eedcff'
  primary-fixed-dim: '#d8b9ff'
  on-primary-fixed: '#290054'
  on-primary-fixed-variant: '#5c299b'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb597'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#7e2c00'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#91ccff'
  on-tertiary-fixed: '#001e31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
  surface-subtle: '#F2F2F2'
  text-muted: '#4D4D4D'
  status-delivered: '#008744'
  status-alert: '#D9381E'
  surface-canvas: '#F8F9FA'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-efficiency mobile experience defined by reliability, speed, and precision. Built for on-the-go logistics tracking, shipping management, and delivery verification, the visual language balances the commanding visual presence of signature purple and vibrant orange with structured, high-legibility surfaces.

The design movement combines **Modern Corporate** structure with **Tactile Utility**:
- **Clarity over ornamentation:** Interfaces favor spacious layout rhythms, unambiguous status badges, and rapid legibility under varying mobile lighting conditions.
- **Purposeful velocity:** Brand purple anchors navigational structure and institutional authority, while energetic orange marks high-priority actions, package progress events, and urgent status indicators.
- **Physical tangibility:** Cards and interactive targets feature subtle border definitions, crisp surface tiers, and calibrated press feedback that mirror physical handheld scanning hardware and modern logistics ergonomics.

## Colors

The palette leverages the iconic high-contrast balance between deep royal purple and radiant transport orange, supported by a functional logistics spectrum.

### Roles & Application
- **Primary (`#4D148C`):** Global top app bars, primary brand headers, major navigation active states, and definitive confirmation screens.
- **Secondary (`#FF6200`):** High-conversion call-to-action buttons (e.g., "Ship Now", "Schedule Pickup"), active tracking timeline nodes, and immediate attention flags.
- **Tertiary (`#007AB7`):** Supplementary informational links, support badges, transit network waypoints, and secondary documentation tags.
- **Neutral (`#333333`):** High-contrast body and heading typography against white/light surfaces, ensuring accessibility standards across device displays.
- **Named Neutrals & Surfaces:**
  - `surface-canvas` (`#F8F9FA`) and `surface-subtle` (`#F2F2F2`): Neutral base planes that frame elevated white cards.
  - `text-muted` (`#4D4D4D`): Secondary metadata, tracking IDs, timestamps, and placeholder labels.
- **Functional Semantics:**
  - `status-delivered` (`#008744`): Finalized drop-offs and verified signatures.
  - `status-alert` (`#D9381E`): Delivery exceptions, customs holds, and payment required flags.

## Typography

Typography relies on **Hanken Grotesk**, a contemporary, clean sans-serif with geometric precision and open counters. It provides an immediate match to corporate logistics typography while ensuring legibility across small handheld viewports and high-density tracking tables.

### Rules of Rhythm
- **Tracking & Numerals:** Tracking numbers, weight calculations, ETA timestamps, and postal codes must be rendered with tabular numeric features where supported, paired with `title-md` or `label-lg` weights to ensure scanability.
- **Hierarchy:**
  - `headline-xl-mobile` is reserved for key overview states (e.g., "Out for Delivery", "Shipment Summary").
  - `label-*` styles enforce tighter letter-spacing and heavier weights for badges, delivery window chips, and interactive button text.
  - `body-sm` handles transit checkpoints, legal disclaimers, and metadata footnotes.

## Layout & Spacing

The layout utilizes a structured fluid grid optimized primarily for standard mobile widths (360px–428px) scaling gracefully into tablet dashboards.

### Grid & Margins
- **Mobile (<600px):** 4-column fluid layout with `0.75rem` (12px) gutters and a persistent outer canvas margin of `1rem` (16px).
- **Tablet (600px–1024px):** 8-column layout with `1rem` (16px) gutters and `1.5rem` (24px) side margins.
- **Desktop/Docked:** 12-column layout maxing out container width at 1200px.

### Spatial Flow
- Spacing follows a strict 4px/8px modular base scale.
- Interactive elements inside list rows and cards observe `space-md` (16px) internal padding to maintain minimum touch target dimensions of 48x48px.
- Distinct card groups (e.g., "Active Deliveries" versus "Past Shipments") separate vertically using `space-lg` (24px).

## Elevation & Depth

Visual depth is achieved through **Tonal Layering** combined with soft, low-contrast ambient shadows to keep views lightweight, crisp, and performant.

### Surface Tiers
- **Level 0 (Canvas):** Underlying application canvas tinted with `#F8F9FA`.
- **Level 1 (Default Containers):** Surface cards, barcode summary tiles, and delivery lists set in pure white (`#FFFFFF`) with a subtle `1px solid #E5E7EB` boundary and an ambient shadow (`0 2px 4px rgba(51, 51, 51, 0.04)`).
- **Level 2 (Active/Floating):** Pinned shipment cards, bottom navigation bars, and sheet dialogs elevated with `0 6px 16px rgba(77, 20, 140, 0.08)`. The subtle brand-purple tint reinforces proprietary identity.
- **Level 3 (Modal/Overlays):** Signature capture overlays, camera scanner sheets, and popover alerts utilizing `0 12px 32px rgba(51, 51, 51, 0.16)`.

## Shapes

The design system implements a roundedness level of `2` (`0.5rem` / 8px base radius), communicating modern operational capability without feeling informal or toy-like.

### Curvature Tokens
- **Input Fields & Micro Badges:** `0.5rem` (8px) for crisp geometric balance.
- **Standard Cards & Shipment Tiles:** `rounded-lg` (`1rem` / 16px) ensuring soft containment of complex nested logistics data.
- **Floating Action Buttons & Bottom Sheets:** `rounded-xl` (`1.5rem` / 24px) on top radii to establish comfortable physical grasp points.
- **Status Pills & Chips:** Full circular radii (`9999px`) to distinguish categorical metadata from rectangular cards.

## Components

### Buttons
- **Primary Action (Secondary Orange):** Solid `#FF6200` background with pure white typography (`label-lg`), 48px standard height, `0.5rem` radius. Used for conversion drivers ("Pay Duty", "Track", "Schedule").
- **Brand Authority (Purple):** Solid `#4D148C` with white text for main app controls ("New Shipment", "Scan Label").
- **Secondary / Ghost:** White background, 1.5px border `#4D148C`, purple text. Pressed state transitions to a 6% purple wash.

### Logistics Status Indicators & Timeline
- **Stepper/Progress Track:** Vertical or horizontal path connecting progress dots. Completed segments rendered in `#4D148C`; active current state highlighted in `#FF6200` with pulsing outer halo; upcoming segments in `#F2F2F2`.
- **Status Badges:** Compact pills with `space-xs` vertical and `space-sm` horizontal padding:
  - *In Transit:* Tinted purple background (`rgba(77, 20, 140, 0.1)`) with `#4D148C` text.
  - *Out for Delivery:* Tinted orange background (`rgba(255, 98, 0, 0.12)`) with `#FF6200` text.
  - *Delivered:* Tinted green background (`rgba(0, 135, 68, 0.12)`) with `#008744` text.
  - *Exception:* Tinted red background (`rgba(217, 56, 30, 0.12)`) with `#D9381E` text.

### Cards & Shipment Containers
- Encapsulated in pure white `#FFFFFF`, bordered by `1px solid #E5E7EB`, with a 16px (`rounded-lg`) corner radius.
- Header row contains parcel nickname and carrier badge; middle section highlights tracking ID and current status badge; footer features dynamic delivery estimate with secondary action shortcuts (e.g., "Manage Delivery").

### Inputs & Search Bars
- **Barcode & Tracking Input:** Prominent 52px height search field on the dashboard canvas with an integrated barcode scan camera icon button on the right edge.
- **Text Inputs:** 1px border `#CCCCCC` resting state, transitioning to 2px solid `#4D148C` upon focus. Floating label adopts `label-sm` in purple.

### Chips & Filters
- Compact filtering tags (e.g., "All", "Incoming", "Outgoing", "Archived"). Unselected states feature `#F2F2F2` background with `#4D4D4D` text. Selected state inverts to `#4D148C` background with white text.

### Lists & Selection Controls
- **Lists:** Clean single or dual-line rows divided by `#F2F2F2` hairline borders. Trailing accessory displays navigation chevrons (`#4D4D4D`) or action switches.
- **Checkboxes & Radios:** 20px size with 4px inner rounding for checkboxes; filled with `#4D148C` and white iconography when active.