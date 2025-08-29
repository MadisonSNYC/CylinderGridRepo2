# 🔬 Surgical Performance Refactor Plan

**Task Name:** Surgical Performance Optimization Refactor  
**Branch:** perf/surgical-refactor  
**Protocol:** Zero-deletion, verification-gated refactoring  
**Created:** 2025-08-29 17:04 ET  
**Author:** Assistant

---

## 🧭 Core Goals

1. **Reduce initial load from 8s to <2s** (Core Web Vitals)
2. **Achieve consistent 60fps scroll** (reduce render cycles)
3. **Decrease bundle from 428KB to <200KB** (code splitting)
4. **Preserve 100% functionality** (no feature regression)
5. **Maintain full rollback capability** (archive all changes)

---

## 🔐 Safety Constraints

- ✅ **NO DELETIONS** - All legacy code → `_archive/` folders
- ✅ **VERIFICATION GATES** - Pause after each phase for Madison approval
- ✅ **SCOPED CHANGES** - Only touch performance-critical paths
- ✅ **TESTED HYPOTHESES** - Measure before/after each change
- ✅ **QA REQUIRED** - Full test suite + manual verification

---

# 📋 REFACTOR PHASES

## Phase 1: Emergency Video Lazy Loading (CRITICAL)
**Performance Issue:** 311MB videos causing 10-30s initial load  
**Target Metric:** Reduce to <50MB initial load, LCP <2.5s

### Step 1.1: Create Video Lazy Loading Infrastructure
**Goal:** Implement intersection observer-based lazy loading  
**File Path(s):** 
- NEW: `src/components/video/VideoLazy.jsx`
- NEW: `src/hooks/useIntersectionObserver.js`

**Changes:**
```javascript
// src/components/video/VideoLazy.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export const VideoLazy = React.memo(({ 
  src, 
  thumbnail, 
  className, 
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const { isIntersecting } = useIntersectionObserver(videoRef, {
    threshold: 0.1,
    rootMargin: '200px'
  });

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isIntersecting, isLoaded]);

  return (
    <div ref={videoRef} className={className}>
      {!isLoaded ? (
        <img src={thumbnail} alt="Video thumbnail" loading="lazy" />
      ) : (
        <video {...props} src={src} preload="metadata" />
      )}
    </div>
  );
});
```

**Archived:** N/A (new file)

**QA Checklist:**
- [ ] Videos load only when scrolled into view
- [ ] Thumbnails display before video loads
- [ ] No console errors
- [ ] Memory usage stays <60MB initially
- [ ] LCP improves to <2.5s

**Rollback Plan:** Delete new files, restore original video elements

**Verification:**
> Madison, please verify this phase is correct. Yes/No  
> Also, please confirm the date and time for this phase entry.

---

### Step 1.2: Archive Original Video Implementation
**Goal:** Preserve current video rendering for rollback  
**File Path(s):** 
- ARCHIVE: `src/components/EnhancedHelixProjectsShowcase.jsx` → `src/components/_archive/EnhancedHelixProjectsShowcase-pre-lazy.jsx`

**Changes:**
```bash
# Create archive directory
mkdir -p src/components/_archive

# Copy original file with timestamp
cp src/components/EnhancedHelixProjectsShowcase.jsx \
   src/components/_archive/EnhancedHelixProjectsShowcase-pre-lazy-2025-08-29.jsx
```

**Archived:** `src/components/_archive/EnhancedHelixProjectsShowcase-pre-lazy-2025-08-29.jsx`

**QA Checklist:**
- [ ] Original file successfully archived
- [ ] Archive includes full functionality
- [ ] Can swap back if needed

**Rollback Plan:** Copy archived file back to original location

---

### Step 1.3: Integrate Lazy Loading into Helix Component
**Goal:** Replace direct video elements with VideoLazy  
**File Path(s):** `src/components/EnhancedHelixProjectsShowcase.jsx`

**Changes:**
```javascript
// Before (line ~650-700)
<video 
  src={project.videoAsset}
  autoPlay
  muted
  loop
/>

// After
import { VideoLazy } from './video/VideoLazy';

<VideoLazy
  src={project.videoAsset}
  thumbnail={`/thumbnails/${project.id}.jpg`}
  autoPlay
  muted
  loop
/>
```

**Performance Metrics to Capture:**
```javascript
// Add performance marks
performance.mark('video-lazy-start');
// ... component render
performance.mark('video-lazy-end');
performance.measure('video-lazy-load', 'video-lazy-start', 'video-lazy-end');
```

**QA Checklist:**
- [ ] Run `npm test` - all tests pass
- [ ] Check http://localhost:4000 - helix still renders
- [ ] Scroll through all projects - videos load on demand
- [ ] Network tab shows staggered video loading
- [ ] Performance: Initial load <50MB (was 311MB)

**Rollback Plan:** 
```bash
cp src/components/_archive/EnhancedHelixProjectsShowcase-pre-lazy-2025-08-29.jsx \
   src/components/EnhancedHelixProjectsShowcase.jsx
```

**Verification:**
> Madison, please verify this phase is correct. Yes/No  
> Also, please confirm the date and time for this phase entry.

---

## Phase 2: Component Memoization Surgery
**Performance Issue:** 30-40fps scroll due to excessive re-renders  
**Target Metric:** Achieve 60fps, reduce re-renders by 80%

### Step 2.1: Extract and Memoize SpringConnection
**Goal:** Prevent 100+ re-renders per scroll of expensive SVG calculations  
**File Path(s):** 
- NEW: `src/components/helix/SpringConnection.jsx`
- MODIFY: `src/components/EnhancedHelixProjectsShowcase.jsx`

**Changes:**
```javascript
// NEW: src/components/helix/SpringConnection.jsx
import React, { useMemo } from 'react';

export const SpringConnection = React.memo(({ start, end, opacity = 1, color = "#00ffff", intensity = 1 }) => {
  // Memoize expensive calculations
  const gradientId = useMemo(
    () => `electric-gradient-${start.index}-${end.index}`,
    [start.index, end.index]
  );
  
  const pathData = useMemo(() => {
    if (!start?.screenX || !end?.screenX) return null;
    
    const midX = (start.screenX + end.screenX) / 2;
    const midY = (start.screenY + end.screenY) / 2;
    const jitter = Math.random() * 30 - 15;
    const waveAmplitude = 60 + (intensity * 40);
    
    return {
      path: `M ${start.screenX} ${start.screenY} C ${midX + waveAmplitude} ${midY - 50}, ${midX - waveAmplitude} ${midY + 50}, ${end.screenX} ${end.screenY}`,
      gradientId
    };
  }, [start.screenX, start.screenY, end.screenX, end.screenY, intensity]);
  
  if (!pathData) return null;
  
  return (
    <svg className="spring-connection" style={svgStyle}>
      {/* Optimized SVG rendering */}
    </svg>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.start.index === nextProps.start.index &&
    prevProps.end.index === nextProps.end.index &&
    prevProps.start.screenX === nextProps.start.screenX &&
    prevProps.start.screenY === nextProps.start.screenY &&
    prevProps.end.screenX === nextProps.end.screenX &&
    prevProps.end.screenY === nextProps.end.screenY
  );
});
```

**Archived:** SpringConnection code from lines 23-101 → `src/components/_archive/SpringConnection-inline-2025-08-29.jsx`

**Performance Measurement:**
```javascript
// Add React DevTools Profiler
<Profiler id="SpringConnection" onRender={(id, phase, actualDuration) => {
  console.log(`SpringConnection render: ${actualDuration}ms`);
}}>
  <SpringConnection {...props} />
</Profiler>
```

**QA Checklist:**
- [ ] SpringConnection renders <5ms (was 20-30ms)
- [ ] Re-renders reduced by >80% (check React DevTools)
- [ ] Visual appearance unchanged
- [ ] No console errors
- [ ] FPS during scroll >50 (was 30-40)

**Rollback Plan:** 
```bash
# Restore inline SpringConnection
cp src/components/_archive/EnhancedHelixProjectsShowcase-pre-lazy-2025-08-29.jsx \
   src/components/EnhancedHelixProjectsShowcase.jsx
rm src/components/helix/SpringConnection.jsx
```

**Verification:**
> Madison, please verify this phase is correct. Yes/No  
> Also, please confirm the date and time for this phase entry.

---

### Step 2.2: Memoize Helix Position Calculations
**Goal:** Prevent recalculation of 48+ project positions on every frame  
**File Path(s):** `src/components/EnhancedHelixProjectsShowcase.jsx`

**Changes:**
```javascript
// Before (line ~400-450)
const calculatePositions = () => {
  return projects.map((project, index) => {
    const angle = (index / projects.length) * Math.PI * 2;
    // ... expensive calculations
  });
};

// After
const projectPositions = useMemo(() => {
  return projects.map((project, index) => {
    const angle = (index / projects.length) * Math.PI * 2;
    const radius = 300;
    const x = Math.cos(angle) * radius;
    const y = index * 50;
    const z = Math.sin(angle) * radius;
    
    return { x, y, z, angle, index };
  });
}, [projects.length]); // Only recalculate if projects change

const visiblePositions = useMemo(() => {
  return projectPositions.filter((_, index) => {
    const isVisible = index >= scrollIndex - 5 && index <= scrollIndex + 5;
    return isVisible;
  });
}, [projectPositions, scrollIndex]);
```

**Archived:** Original calculation logic → `src/components/_archive/helix-calculations-2025-08-29.js`

**QA Checklist:**
- [ ] Position calculations happen once, not per-frame
- [ ] Scroll still updates visible projects
- [ ] React DevTools shows fewer re-renders
- [ ] Memory usage stable during scroll

**Rollback Plan:** Restore original calculation logic from archive

**Verification:**
> Madison, please verify this phase is correct. Yes/No  
> Also, please confirm the date and time for this phase entry.

---

## Phase 3: Test Dashboard Isolation
**Performance Issue:** 3 test dashboards consuming resources in production  
**Target Metric:** Remove 10MB memory overhead, reduce idle CPU to <5%

### Step 3.1: Conditionally Load Test Components
**Goal:** Only load test dashboards in development  
**File Path(s):** `src/App.jsx`

**Changes:**
```javascript
// Before (lines 8-12)
import { TestDashboard } from './components/TestDashboard.jsx';
import { AdvancedTestDashboard } from './components/AdvancedTestDashboard.jsx';
import { PlaywrightTestDashboard } from './components/PlaywrightTestDashboard.jsx';

// After
const TestDashboard = import.meta.env.DEV 
  ? lazy(() => import('./components/TestDashboard.jsx'))
  : () => null;
  
const AdvancedTestDashboard = import.meta.env.DEV
  ? lazy(() => import('./components/AdvancedTestDashboard.jsx'))
  : () => null;
  
const PlaywrightTestDashboard = import.meta.env.DEV
  ? lazy(() => import('./components/PlaywrightTestDashboard.jsx'))
  : () => null;

// In render (lines 72-74)
{import.meta.env.DEV && (
  <Suspense fallback={null}>
    <TestDashboard />
    <AdvancedTestDashboard />
    <PlaywrightTestDashboard />
  </Suspense>
)}
```

**Archived:** Original imports → `src/components/_archive/App-with-test-dashboards-2025-08-29.jsx`

**QA Checklist:**
- [ ] In dev mode: dashboards visible
- [ ] In production build: dashboards absent
- [ ] Bundle size reduced by ~30KB
- [ ] Memory usage reduced by ~10MB
- [ ] No console errors in either mode

**Rollback Plan:** 
```bash
cp src/components/_archive/App-with-test-dashboards-2025-08-29.jsx src/App.jsx
```

**Verification:**
> Madison, please verify this phase is correct. Yes/No  
> Also, please confirm the date and time for this phase entry.

---

## Phase 4: Bundle Splitting Implementation
**Performance Issue:** 428KB single chunk causing 3-5s parse time  
**Target Metric:** <200KB initial bundle, <1s parse time

### Step 4.1: Configure Vite for Optimal Chunking
**Goal:** Split vendor, UI, and app code into separate chunks  
**File Path(s):** `vite.config.js`

**Changes:**
```javascript
// Archive current config
cp vite.config.js vite.config.archive-2025-08-29.js

// New config
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch'
          ],
          'animations': ['framer-motion'],
          'helix': [
            './src/components/EnhancedHelixProjectsShowcase',
            './src/components/helix/SpringConnection'
          ]
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop().split('.')[0] : 
            'chunk';
          return `${facadeModuleId}-[hash].js`;
        }
      }
    },
    chunkSizeWarningLimit: 200 // KB
  }
});
```

**Archived:** `vite.config.archive-2025-08-29.js`

**Performance Metrics:**
```bash
# Before
npm run build
# dist/assets/index-1k-AlLBd.js   428.30 kB │ gzip: 123.30 kB

# After (expected)
# dist/assets/vendor-[hash].js     90 kB
# dist/assets/radix-ui-[hash].js   80 kB
# dist/assets/app-[hash].js        150 kB
# dist/assets/helix-[hash].js      100 kB
```

**QA Checklist:**
- [ ] Build succeeds without errors
- [ ] Initial bundle <200KB
- [ ] Chunks load in correct order
- [ ] No missing dependencies
- [ ] App functions identically

**Rollback Plan:** 
```bash
cp vite.config.archive-2025-08-29.js vite.config.js
```

**Verification:**
> Madison, please verify this phase is correct. Yes/No  
> Also, please confirm the date and time for this phase entry.

---

## Phase 5: Animation Loop Optimization
**Performance Issue:** Multiple RAF/intervals causing 15-20% idle CPU  
**Target Metric:** <5% idle CPU, pause when hidden

### Step 5.1: Implement Visibility-Based Animation Control
**Goal:** Pause expensive animations when tab not visible  
**File Path(s):** 
- NEW: `src/hooks/usePageVisibility.js`
- MODIFY: `src/components/EnhancedHelixProjectsShowcase.jsx`

**Changes:**
```javascript
// NEW: src/hooks/usePageVisibility.js
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return isVisible;
};

// In EnhancedHelixProjectsShowcase
const isPageVisible = usePageVisibility();

useEffect(() => {
  if (!isPageVisible) {
    // Pause all animations
    cancelAnimationFrame(animationFrameId.current);
    clearInterval(rotationInterval.current);
    return;
  }
  
  // Resume animations
  startAnimationLoop();
}, [isPageVisible]);
```

**Archived:** Original animation logic → `src/components/_archive/animation-loops-2025-08-29.js`

**QA Checklist:**
- [ ] CPU drops to <5% when tab hidden
- [ ] Animations resume when tab focused
- [ ] No visual glitches on resume
- [ ] Memory stable during pause/resume

**Rollback Plan:** Remove visibility hook, restore original animation logic

**Verification:**
> Madison, please verify this phase is correct. Yes/No  
> Also, please confirm the date and time for this phase entry.

---

## 📊 Performance Validation Matrix

### Metrics to Capture After Each Phase

| Metric | Baseline | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Target |
|--------|----------|---------|---------|---------|---------|---------|--------|
| TTI (s) | 8.0 | 3.5 | 2.8 | 2.5 | 1.8 | 1.5 | <2.0 |
| FCP (s) | 3.0 | 1.5 | 1.2 | 1.0 | 0.8 | 0.8 | <1.0 |
| LCP (s) | 10.0 | 2.5 | 2.0 | 2.0 | 1.5 | 1.5 | <2.5 |
| FPS (scroll) | 30-40 | 40-50 | 55-60 | 55-60 | 60 | 60 | 60 |
| Bundle (KB) | 428 | 428 | 420 | 390 | 180 | 180 | <200 |
| Memory (MB) | 150 | 60 | 55 | 45 | 45 | 40 | <60 |
| CPU Idle (%) | 15-20 | 10-15 | 8-10 | 5-8 | 5-8 | <5 | <5 |

### Testing Commands After Each Phase
```bash
# Run test suite
npm test

# Check bundle size
npm run build && ls -lh dist/assets/*.js

# Performance audit
npx lighthouse http://localhost:4000 --view

# Memory profiling
# Open Chrome DevTools > Memory > Take Heap Snapshot

# React profiling
# Open React DevTools > Profiler > Start recording
```

---

## 🚨 Emergency Rollback Procedure

If any phase causes critical issues:

1. **Immediate Rollback:**
```bash
# Identify last working commit
git log --oneline -5

# Revert to last working state
git checkout [LAST_WORKING_SHA]

# Or restore from archives
cp -r src/components/_archive/*-2025-08-29.* src/components/
```

2. **Verify Rollback:**
- [ ] App loads without errors
- [ ] All features functional
- [ ] Tests pass
- [ ] Performance returns to baseline

3. **Document Issue:**
- Create incident report in `task-md/rollback-incident-[date].md`
- Include error messages, metrics, hypothesis

---

## ✅ Definition of Done

### For Each Phase:
- [ ] Code changes implemented as specified
- [ ] Legacy code archived with timestamp
- [ ] Performance metrics improved as targeted
- [ ] All tests pass (unit, integration, e2e)
- [ ] Manual QA completed
- [ ] No console errors or warnings
- [ ] Madison verified with date/time
- [ ] Commit includes performance metrics

### For Complete Refactor:
- [ ] All 5 phases completed and verified
- [ ] Performance targets achieved:
  - TTI <2s ✓
  - FPS 60 ✓
  - Bundle <200KB ✓
  - Memory <60MB ✓
  - CPU idle <5% ✓
- [ ] Full rollback capability maintained
- [ ] Documentation updated
- [ ] Merged to main after final approval

---

## 📝 Verification Log

| Phase | Date/Time | Madison Verified | Commit SHA | Rollback Tested |
|-------|-----------|------------------|------------|-----------------|
| 1.1 | 2025-08-29 17:46 ET | YES | Pending | ✅ |
| 1.2 | 2025-08-29 17:46 ET | YES | Pending | ✅ |
| 1.3 | 2025-08-29 17:46 ET | YES | Pending | ✅ |
| 2.1 | | | | |
| 2.2 | | | | |
| 3.1 | | | | |
| 4.1 | | | | |
| 5.1 | | | | |

---

*Plan Version: 1.0*  
*Protocol: Surgical Refactor with Zero Deletion*  
*Created: 2025-08-29 17:04 ET*