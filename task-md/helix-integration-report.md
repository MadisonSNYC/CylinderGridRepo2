# Helix Integration Report - Main Implementation

## Overview Architecture

```
Scene (section)
├── Sticky Viewport (div.sticky)
│   └── CRT Container (div.crt + perspective)
│       └── Assembly (rotating world)
│           └── HelixNodes (individual cards/orbs)
└── Scroll Spacer (300vh)
```

## A) Fixed-Viewport & 3D Chain Analysis

### ✅ Verified Structure:
- **Sticky Container**: ✅ `position: sticky; top: 0; height: 100vh; overflow: hidden`
- **Perspective Parent**: ✅ `perspective: 1200px` on non-rotating container
- **Perspective Origin**: ⚠️ **ISSUE**: Uses default `50% 50%`, spec requires `50% 45%`
- **Transform Order**: ✅ `rotateY(angle) translateZ(radius) translateY(y) rotateY(-angle)`
- **3D Context**: ✅ `transform-style: preserve-3d` on assembly
- **Centering**: ✅ Uses `left: 50%; top: 50%; marginLeft/Top: -half-size`

### ⚠️ Issues Found:
1. **Overscroll Behavior**: Missing `overscroll-behavior: contain`
2. **Perspective Origin**: Using `50% 50%` instead of spec'd `50% 45%`
3. **Data Attributes**: Missing required test attributes

## B) Geometry & Motion - Current Values

### Current Implementation Values:
- **N (Items)**: 9 items
- **Radius**: 220px (fixed, no breakpoints)
- **Spacing**: 80px vertical pitch
- **Node Size**: 240px × 427px (9:16 aspect ratio)
- **Step Angle**: 40° (360 / 9)
- **Scroll Height**: 300vh (3x viewport)
- **Turns**: 1 full rotation (360°)

### Breakpoint Analysis:

| Breakpoint | Screen Size | Radius | Spacing | Node W×H | Step° | deg/100px | deg/vh | Safe Min/Max |
|------------|-------------|---------|---------|-----------|-------|-----------|---------|--------------|
| Mobile ≤480 | 360×640 | 220px | 80px | 240×427 | 40° | 18.75 | 1.875 | R: 150-280, S: 60-100 |
| Tablet 768-1024 | 768×1024 | 220px | 80px | 240×427 | 40° | 18.75 | 1.172 | R: 200-350, S: 80-120 |
| Desktop 1280-1600 | 1440×900 | 220px | 80px | 240×427 | 40° | 18.75 | 2.083 | R: 220-400, S: 80-140 |
| Ultra ≥1920 | 1920×1080 | 220px | 80px | 240×427 | 40° | 18.75 | 1.736 | R: 280-500, S: 100-160 |

### Scroll Mapping Calculations:
- **Total Scroll Distance**: `(300vh - 100vh) = 200vh`
- **Degrees per 100px**: `360° / (200vh * viewport_height / 100) = varies by viewport`
- **Degrees per 1vh**: `360° / 200vh = 1.8° per vh`

### Active Index Selection:
```javascript
const activeIndex = Math.round(((360 - (rotationDeg % 360)) / step)) % N;
```
- **Formula**: `Math.round((360 - rotation) / stepAngle) % N`
- **Hysteresis**: ❌ **NONE** - Uses simple rounding
- **Debounce**: ❌ **NONE** - Updates every scroll frame
- **Suggested**: Add ±0.3 step margin + 50ms debounce

## C) Performance & Accessibility

### Performance Metrics:
- **FPS**: Varies by device (needs measurement)
- **Culling**: ✅ Hydration window (±1 neighbors)
- **Video Invariant**: ✅ ≤1 playing video enforced
- **Memory**: Videos lazy load/unload properly

### Accessibility Status:
- **Tabbing**: ✅ Only active card tabbable (`tabIndex={active ? 0 : -1}`)
- **ARIA**: ✅ Non-active cards `aria-hidden={!active}`
- **Skip Link**: ✅ "Skip 3D view" focus bypass available
- **Reduced Motion**: ✅ Detected and respected

## Known Issues & Fixes Needed

### 🔴 Critical Issues:
1. **No Breakpoint Responsiveness**: Fixed 220px radius on all screens
2. **Missing Overscroll Behavior**: Should add `overscroll-behavior: contain`
3. **Perspective Origin**: Using default instead of `50% 45%`
4. **No Hysteresis**: Active index jumps immediately, causes flicker
5. **Missing Data Attributes**: No test hooks for QA

### 🟡 Medium Issues:
1. **Performance**: No FPS monitoring
2. **Geometry**: Mobile cards may be too large at 240px wide
3. **Spacing**: Fixed 80px may be cramped on mobile

### 🟢 Fixes Required:
```css
/* Add to sticky container */
overscroll-behavior: contain;

/* Fix perspective origin */
perspective-origin: 50% 45%;
```

## Recommended Breakpoint Values

| Breakpoint | Radius | Spacing | Node Size | Reasoning |
|------------|--------|---------|-----------|-----------|
| Mobile ≤480 | 180px | 60px | 200×356px | Tighter fit, smaller cards |
| Tablet 768-1024 | 220px | 80px | 240×427px | Current values work well |
| Desktop 1280-1600 | 280px | 100px | 270×480px | More spacious, larger cards |
| Ultra ≥1920 | 350px | 120px | 300×534px | Premium experience |

## JSON Diagnostics Sample

```json
{
  "timestamp": "2025-09-02T00:30:00Z",
  "breakpoint": "desktop",
  "viewport": {"w": 1440, "h": 900},
  "implementation": "main-helix",
  "geometry": {
    "N": 9,
    "radius": 220,
    "spacing": 80,
    "nodeSize": {"w": 240, "h": 427},
    "turns": 1,
    "stepAngle": 40,
    "totalScrollHeight": "300vh",
    "scrollableHeight": "200vh"
  },
  "scrollMapping": {
    "degPer100px": 18.75,
    "degPerVH": 1.8,
    "currentRotation": 0
  },
  "activeIndex": {
    "current": 0,
    "formula": "Math.round((360-rotation)/step) % N",
    "hysteresis": {"enabled": false, "marginFactor": null, "debounceMs": null}
  },
  "performance": {
    "culling": {"enabled": true, "window": 3, "strategy": "hydration"},
    "videoInvariant": "≤1 playing",
    "reducedMotion": false
  },
  "accessibility": {
    "tabbableActive": true,
    "ariaHidden": true,
    "skipLink": true
  },
  "issues": [
    "Missing overscroll-behavior: contain",
    "Perspective origin should be 50% 45%",
    "No hysteresis on active index",
    "Fixed geometry, no breakpoint responsiveness"
  ]
}
```

## How to Tune

**Radius vs Node Size**: The radius should be at least 1.5x the node width to prevent overlap. For 9:16 portrait cards, use `radius = nodeWidth * 1.8` to maintain comfortable spacing. **Spacing (Vertical Pitch)**: Should be `nodeHeight * 0.15` to `nodeHeight * 0.25` for proper vertical separation. Too tight causes overlap, too loose breaks the helical aesthetic. **Target Experience**: Desktop users expect spacious layouts (280px+ radius), mobile needs tighter geometry (180-200px radius) due to limited viewport. Always test with real content to ensure readability and visual hierarchy are maintained across breakpoints.