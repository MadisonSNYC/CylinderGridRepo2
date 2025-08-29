# 📄 Performance Optimization Plan

**Task Name:** Critical Performance Optimization  
**Branch:** perf/optimize-app  
**Priority:** CRITICAL 🔥  
**Created:** 2025-08-29  
**Author:** Assistant

---

## 📋 Task Overview

### Problem Statement
The application is experiencing severe performance issues causing a sluggish user experience. Analysis reveals 311MB of video assets loading simultaneously, a 1010-line monolithic component, excessive re-renders, and no optimization strategies in place.

### Success Criteria
- [ ] Initial load time <2 seconds
- [ ] 60fps consistent scroll performance
- [ ] Bundle size <200KB initial chunk
- [ ] Memory usage <60MB
- [ ] Video assets lazy loaded
- [ ] Zero performance warnings in console

### Scope
**In Scope:**
- Video compression and lazy loading
- Component splitting and memoization
- Bundle optimization and code splitting
- Removing test components from production
- Performance monitoring improvements

**Out of Scope:**
- Feature additions
- UI/UX redesign
- Backend optimizations
- Third-party library replacements

---

## 🔍 Current Performance Metrics

### Load Performance
- **Time to Interactive (TTI):** ~8 seconds
- **First Contentful Paint (FCP):** ~3 seconds
- **Largest Contentful Paint (LCP):** ~10 seconds
- **Total Blocking Time:** ~4 seconds

### Runtime Performance
- **FPS during scroll:** 30-40fps (target: 60fps)
- **Memory usage:** ~150MB (target: <60MB)
- **CPU usage:** Constant 15-20% idle (target: <5%)

### Asset Sizes
- **Video assets:** 311MB (12 files)
- **JavaScript bundle:** 428KB (123KB gzipped)
- **CSS bundle:** 141KB (23KB gzipped)
- **Largest video:** 50MB (A11_LoopsOnce_Louder.mp4)

---

## 📐 Implementation Plan

### Phase 1: Video Asset Optimization (Day 1-2)
**Estimated Time:** 8-12 hours
**Impact:** 70% reduction in load time

#### Steps
- [ ] Audit all video files and create optimization matrix
- [ ] Compress videos using FFmpeg with H.265/VP9 codec
  ```bash
  ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset fast -c:a copy output.mp4
  ```
- [ ] Generate static thumbnails for each video
- [ ] Implement intersection observer for lazy loading
- [ ] Create VideoLazy component with loading states
- [ ] Add preload="none" to all video elements
- [ ] Consider CDN hosting for large assets
- [ ] Implement progressive video loading

#### Files to Modify
- Create: `src/components/VideoLazy.jsx`
- Create: `src/hooks/useIntersectionObserver.js`
- Modify: `src/components/EnhancedHelixProjectsShowcase.jsx`
- Create: `scripts/compress-videos.sh`
- Update: All video references in `src/data/projects.js`

#### Performance Targets
- Initial load: <50MB (from 311MB)
- Per-video size: <5MB average
- Lazy load threshold: 200px before viewport

---

### Phase 2: Component Optimization (Day 2-3)
**Estimated Time:** 6-8 hours
**Impact:** 50% faster renders, 60fps scroll

#### Steps
- [ ] Split EnhancedHelixProjectsShowcase into smaller components
  - Extract SpringConnection component
  - Extract HelixControls component
  - Extract ProjectCard component
  - Extract HelixAnimation logic
- [ ] Add React.memo to pure components
- [ ] Implement useMemo for expensive calculations
- [ ] Add useCallback for event handlers
- [ ] Create custom hooks for helix logic
- [ ] Optimize re-render patterns
- [ ] Remove inline function definitions

#### Component Structure (Target)
```
src/components/
├── helix/
│   ├── HelixContainer.jsx (<300 lines)
│   ├── SpringConnection.jsx (<100 lines)
│   ├── ProjectCard.jsx (<150 lines)
│   ├── HelixControls.jsx (<100 lines)
│   └── hooks/
│       ├── useHelixAnimation.js
│       ├── useHelixScroll.js
│       └── useHelixPosition.js
```

#### Memoization Strategy
```javascript
// Before
const SpringConnection = ({ start, end }) => {
  const gradient = `gradient-${start.index}-${end.index}`;
  // ...
}

// After
const SpringConnection = React.memo(({ start, end }) => {
  const gradientId = useMemo(
    () => `gradient-${start.index}-${end.index}`,
    [start.index, end.index]
  );
  // ...
}, (prevProps, nextProps) => {
  return prevProps.start.index === nextProps.start.index &&
         prevProps.end.index === nextProps.end.index;
});
```

---

### Phase 3: Bundle & Runtime Optimization (Day 3-4)
**Estimated Time:** 6-8 hours
**Impact:** 60% smaller bundle, 2s faster TTI

#### Steps
- [ ] Implement route-based code splitting
- [ ] Lazy load Radix UI components
- [ ] Create vendor chunk separation
- [ ] Remove test components from production
- [ ] Disable performance monitor in production
- [ ] Optimize animation loops
- [ ] Implement visibility-based animation pausing
- [ ] Add webpack bundle analyzer

#### Code Splitting Strategy
```javascript
// Lazy load heavy components
const TestDashboard = lazy(() => import('./components/TestDashboard'));
const AdvancedHelixPanel = lazy(() => import('./components/AdvancedHelixPanel'));

// Conditional rendering for dev only
{import.meta.env.DEV && (
  <Suspense fallback={<div>Loading...</div>}>
    <TestDashboard />
  </Suspense>
)}
```

#### Vite Configuration
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'radix-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor': ['react', 'react-dom'],
          'animations': ['framer-motion']
        }
      }
    }
  }
}
```

---

## ⚠️ Risks & Mitigation

### Technical Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Video quality degradation | Medium | Low | A/B test compression levels |
| Breaking existing features | Low | High | Comprehensive testing |
| Increased complexity | Medium | Medium | Clear documentation |
| Browser compatibility | Low | Medium | Progressive enhancement |

---

## 📊 Metrics & Monitoring

### Before Optimization
- TTI: ~8s
- FPS: 30-40
- Bundle: 428KB
- Memory: ~150MB
- Videos: 311MB

### After Optimization (Target)
- TTI: <2s
- FPS: 60
- Bundle: <200KB
- Memory: <60MB
- Videos: <50MB initial

### How to Measure
```javascript
// Performance monitoring
const metrics = {
  FCP: performance.getEntriesByName('first-contentful-paint')[0],
  TTI: // Use Lighthouse or custom metric
  FPS: performanceMonitor.getAverageFPS(),
  Memory: performance.memory?.usedJSHeapSize
};
```

---

## ✅ Definition of Done

- [ ] All phases completed and verified
- [ ] 60fps scroll performance achieved
- [ ] Bundle size <200KB initial chunk
- [ ] Videos lazy load properly
- [ ] No performance warnings in console
- [ ] Memory usage <60MB
- [ ] Tests pass in all browsers
- [ ] Documentation updated
- [ ] Madison verified with date/time
- [ ] Merged to main branch

---

## 📝 Quick Wins Checklist

Implement these immediately for instant improvements:

- [ ] Add `loading="lazy"` to all video elements
- [ ] Wrap SpringConnection in React.memo
- [ ] Add `if (import.meta.env.DEV)` check to test components
- [ ] Disable performanceMonitor.logPerformance() in production
- [ ] Add will-change: auto instead of specific properties
- [ ] Implement basic video thumbnail placeholders
- [ ] Remove unused Radix UI imports

---

## 🔗 Related Links

- Performance Analysis: See TASKS.md Performance Bottlenecks section
- React Optimization Docs: https://react.dev/reference/react/memo
- Video Compression Guide: https://trac.ffmpeg.org/wiki/Encode/H.265
- Bundle Analysis: Use `npx vite-bundle-visualizer`

---

*Plan Version: 1.0*  
*For: CylinderGridRepo2*