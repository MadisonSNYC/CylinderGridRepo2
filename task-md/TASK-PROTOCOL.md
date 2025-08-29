# 🔐 Task-MD Protocol (Source of Truth)

This file (`task-md/TASKS.md`) is the **single source of truth** for all project tasks.  
- All task entries must live here, at a high-level (phases, branch, verification).  
- Detailed implementation plans belong in separate files beside this one: `task-md/<task-slug>-plan.md`.  
- No duplicate or alternate Task-MDs may be created.  

---

## Session Rules

### URL Reporting Rule
**ALWAYS provide full URLs when reporting updates or changes:**
- When a feature is updated, provide: `http://localhost:[PORT]/` to check
- When a file is modified, provide the full path: `/Users/madisonrayesutton/CylinderGridRepo2/src/[file]`
- Include what specifically changed and where to verify it visually
- Example: "Helix rendering fixed - check http://localhost:8000/ to see improved scroll performance in Firefox"

---

## Workflow Rules

### ⚠️ CRITICAL: BRANCH FIRST - NO EXCEPTIONS
**STOP! Before ANY work:** Run `git branch --show-current`
- If output is "main" or "master" → CREATE FEATURE BRANCH IMMEDIATELY
- Documentation updates → feature branch required
- Config changes → feature branch required  
- ALL tasks → feature branch required

### 1. Task Initialization
- **MANDATORY:** Create a **new branch** BEFORE any changes (`feat/<slug>`, `fix/<slug>`, `chore/<slug>`).
- Verify not on main: `git branch --show-current` must NOT show "main"
- Document the branch in this file under the task's entry.
- Create ONE `*-plan.md` file beside this one for implementation details (no alternative Task-MDs).

## 🔁 Component Safe-Space Replacement Protocol (Helix Components — Live Build, Old Preserved)

**Purpose**  
Build or replace a core UI component (helix, test dashboards, effects, etc.) **live** while keeping the prior implementation **safe, restorable, and referenceable**. Avoid duplication and keep rollback trivial.

**Rules**  
- **No deletions**: move prior implementation to `_archive/` (e.g., `src/components/<area>/_archive/<name>/…`).
- **No duplicates**: any shared logic/data must be extracted into `src/components/<area>/_shared/` (hooks, utils, contexts).
- **Performance/A11y (non-negotiable)**:
  - **Performance**: aim ~60fps; zero CLS; avoid layout thrashing; monitor bundle size impact
  - **A11y**: keyboard navigation, ARIA roles/labels, focus management
  - **Cross-browser**: Test in Chromium, Firefox, WebKit minimum

**Process**  
1) **Archive prior implementation**  
   - Move all old components/styles to `_archive/<name>/…`.  
   - Do **not** re-export archived files from public indices to avoid accidental mounting.
2) **Scaffold new variant live**  
   - Place new code under `src/components/<area>/<variant>/…`.  
   - Extract any common logic into `_shared/` (e.g., `useHelixState.js`, `helixConfig.js`).
   - Use CSS Modules or inline styles for isolation.
3) **Update App.jsx** to render the new variant.  
   - Keep the archived version available for rapid rollback.
4) **Run tests** to ensure no regressions in functionality.

**Rollback**  
- One-liner: either point App.jsx at `_archive/<name>/…` or restore the pre-change tag/commit.

---

### ⏱️ Phase-Level Gates (applies to **every** phase in **every** task/feature)

1) **Performance Pre-Check (analysis only)**  
   - Summarize FPS/CPU impact, re-render risk, bundle size changes
   - Check cross-browser compatibility concerns
   - **No code changes** during Pre-Check.
2) **Madison Verification - TWO REQUIRED QUESTIONS**  
   > "Madison, please verify this phase is correct. Yes/No"
   > 
   > **"Also, please confirm the date and time for this phase entry."**
3) **If YES + Date/Time received → Push & Log**  
   - Verify branch: `git branch --show-current` (must NOT be "main")
   - Push to the current FEATURE branch; return **short commit SHA**.  
   - Update `TASKS.md` (this phase): **Verification=YES**, **Push Log**, **Date/Time Confirmed (YYYY-MM-DD HH:mm ET)**.  
4) **If NO or missing date/time → Stop**  
   - Do not push without BOTH verification AND date/time. Log blockers/questions; await guidance.
5) **Issues & Spin-off Tasks**  
   - If issues arise mid-phase, add them under this phase and open a new task/branch with its own plan; cross-link both directions.

---

## 📁 Task Completion & Archival Protocol

### **When to Archive a Task**
- All phases completed and verified by Madison
- Final commit pushed and documented in TASKS.md
- No remaining issues or spin-off tasks
- All tests passing in target browsers

### **Archival Process**
1) **Create archive copy**:
   ```bash
   cp task-md/[task-name]-plan.md task-md/archived-tasks/[task-name]-plan-COMPLETED.md
   ```
2) **Add completion metadata** to archived file:
   - Final commit SHA and branch
   - Completion date and time
   - Total phases completed
   - Test results summary (pass/fail rates)
   - Performance metrics achieved
   - Lessons learned
3) **Update archived task references** in TASKS.md:
   - Change status to "ARCHIVED"
   - Add archive location reference
   - Preserve all phase completion data
4) **Keep original plan** for reference until next major milestone

### **Archive Directory Structure**
```
task-md/
├── archived-tasks/
│   ├── [TaskName]-Plan-COMPLETED.md
│   └── README.md (archive index)
├── [active-task]-plan.md
├── TASKS.md (current tasks)
└── TASK-PROTOCOL.md (this file)
```

---

## 🛑 Phase Pause & Governance (Protocol Promotion)

If a step changes scope materially (e.g., moving a component to `_archive/`, introducing new test suites), the assistant must:

1) **Pause** work and post a summary to the chat:
   - What changed or is proposed
   - Why it's necessary
   - Any risks (especially cross-browser)
   - The exact phase where it occurs
2) Ask Madison to **review & approve** adding this rule or step into protocol.
3) Only after Madison's **"Approved"** may the assistant proceed.

### 2. Implementation
- Follow **coding best practices** listed below.
- **Preserve all working features** as top priority.
- Test in multiple browsers (Chromium, Firefox, WebKit minimum)
- If unexpected issues arise → **STOP** and report to Madison.
- Only touch files/components within task scope.

### 3. Verification Gate (Critical — Phase Level)

- Verification occurs **after every phase or major element** (not just at task end).

**Per-phase process (repeat at each phase end):**
1) Document what was completed.
2) Run a **Performance Pre-Check** (analysis only; no code changes).
3) Run tests: `npm test` and note pass/fail rates
4) Ask Madison:
   > "Did Madison verify this phase is correct? Yes/No"
5) If **No** → stop and wait.
   If **Yes** → **push to the task branch** and record:
   - Branch name
   - Commit SHA (short)
   - Test results summary
6) Prompt Madison to confirm **date/time** for logging this phase in `TASKS.md`.

### 4. Performance Pre-Check
Before marking a task complete, document findings here:
- FPS during helix interactions (target: >20fps, ideal: 60fps)
- Memory growth during extended use (target: <50MB)
- Bundle size impact (document before/after)
- Cross-browser performance differences
- Recommend optimizations where needed
**No code changes at this step — just analysis.**

### 5. Documentation
Each task entry in this file must include:
- Task name & branch
- Phases (Plan → Build → Test → Verify → Merge)
- Verification status (Yes/No)
- Performance notes
- Browser compatibility status
- Link to its `*-plan.md`

---

## Testing Requirements

### Browser Matrix (Minimum)
- **Chromium**: Primary development browser
- **Firefox**: Must achieve >80% test pass rate
- **WebKit**: Must achieve >80% test pass rate
- **Mobile**: Test responsive behavior

### Test Categories
1. **Functional**: Core features work as intended
2. **Visual**: No rendering issues, proper aspect ratios
3. **Performance**: FPS targets met, memory stable
4. **Accessibility**: Keyboard nav, ARIA labels, screen readers
5. **Cross-browser**: Feature parity across browsers

### Port Configuration
- Development server: Port 8000 (default)
- Test server: Port 4000 (Playwright)
- Ensure consistency across configs

---

## Code Organization & File-Size Caps
- **Target file length:** ≤ 300 lines (React components)
- **Max function length:** ~60 lines
- **One file = one responsibility** (component vs hooks vs utils)
- Shared components live under `src/components/ui/` or `src/lib/`
- **No new top-level folders** without rationale logged in `TASKS.md`

### Canonical project tree
```
src/
├── components/       # UI components
│   ├── ui/          # Shared UI primitives
│   ├── effects/     # Visual effects
│   └── _archive/    # Archived implementations
├── contexts/        # React contexts
├── hooks/          # Custom React hooks
├── lib/            # Utilities
├── services/       # API/data services
├── test/           # Test utilities
├── utils/          # Helper functions
tests/
├── specs/          # Test specifications
├── fixtures/       # Test fixtures
└── helpers/        # Test helpers
task-md/
├── TASKS.md        # Source of truth
├── TASK-PROTOCOL.md # This file
└── <task>-plan.md  # Task plans
```

---

## Best Practices

### Critical Changes
- Test in all target browsers before verification
- Check for console errors in Firefox/WebKit
- Verify video playback across browsers
- Monitor performance metrics

### Error Fixing
- Fix root causes, not symptoms
- Add regression tests for fixed bugs
- Document browser-specific workarounds

### Code Modification
- Preserve existing test coverage
- Update tests when changing components
- Maintain backwards compatibility

### Cross-Browser Testing
- Use feature detection, not browser detection
- Provide fallbacks for unsupported features
- Test transform/animation differences
- Verify video codec support

### Performance Optimization
- Lazy load heavy components
- Memoize expensive computations
- Optimize re-renders
- Monitor bundle size growth

---

## README Requirements
The top-level `README.md` must always include:
1. **Quickstart:** prerequisites, scripts (`dev`, `build`, `test`)
2. **Browser compatibility:** supported browsers and known issues
3. **Testing:** how to run tests, current pass rates
4. **Performance targets:** FPS, memory, bundle size limits
5. **Task workflow:** link to this protocol
6. **Known issues:** documented browser-specific problems

---

## 🗂️ Repo Context & Branching Rules

**Main Repository:**  
https://github.com/MadisonSNYC/CylinderGridRepo2

### Rules
1. **Branch creation**
   - Features → `feat/<slug>`  
   - Fixes → `fix/<slug>`  
   - Tests → `test/<slug>`
   - Chores → `chore/<slug>`

2. **No direct main commits**
   - All work through feature branches
   - PR required for merge to main

3. **TASKS.md entries must include**
   ```
   ### Task: Fix Firefox Compatibility
   **Branch:** fix/firefox-compat
   **Plan:** task-md/firefox-compat-plan.md
   ```

4. **Push verification**
   - Madison must verify the phase
   - Date/time must be confirmed
   - Short SHA logged in TASKS.md

---

# 📅 Task Session Summary (Protocol)

**Date/Time:** To be confirmed by Madison at end of task.  
*(Assistant must explicitly ask: "Madison, please confirm the correct date and time for this task entry.")*

---

## Pull Request Template

### What / Why
- [ ] Describe the purpose of this PR
- [ ] Link to relevant `*-plan.md` or `TASKS.md` entry

### Browser Testing
- [ ] Chromium: Pass rate ____%
- [ ] Firefox: Pass rate ____%
- [ ] WebKit: Pass rate ____%

### Performance Impact
- [ ] FPS during interactions: ____
- [ ] Memory growth: ____MB
- [ ] Bundle size change: ____KB

### QA Checklist
- [ ] Functional tests pass
- [ ] Visual rendering correct
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Cross-browser verified

### Screenshots / Evidence
_Attach test results or visual proof_

---

## Notes
_Any browser-specific issues or follow-ups_