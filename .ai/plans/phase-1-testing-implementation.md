# Phase 1: Testing Infrastructure Implementation Plan

**Status:** Ready for Review  
**Estimated Time:** 2-3 hours  
**Learning Goal:** Understand Vitest setup, write basic tests, generate coverage reports

---

## 📋 Overview

This phase will set up a minimal but functional testing infrastructure for your React + Vite + TypeScript wedding site. We'll install Vitest, configure it properly, write 2-3 simple tests, and verify everything works before moving to Docker.

---

## 🎯 Success Criteria

By the end of this phase, you will have:

✅ Vitest + React Testing Library installed  
✅ `vitest.config.ts` properly configured  
✅ 2-3 passing component tests  
✅ `npm test` command working  
✅ Coverage report generation working  
✅ Test output visible in terminal

---

## 📦 Step 1: Install Testing Dependencies

### What We'll Install:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### What Each Package Does:

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner (like Jest, but faster with Vite) |
| `@vitest/ui` | Web UI to view test results in browser |
| `@testing-library/react` | Utilities to test React components |
| `@testing-library/jest-dom` | Custom matchers (e.g., `toBeInTheDocument()`) |
| `@testing-library/user-event` | Simulate user interactions (clicks, typing) |
| `jsdom` | Simulates browser environment in Node.js |

### Why Vitest over Jest?

- ✅ **Faster** - Uses Vite's transform pipeline
- ✅ **Same config** - Reuses your `vite.config.ts`
- ✅ **ESM native** - Better for modern projects
- ✅ **Watch mode** - Instant feedback

---

## ⚙️ Step 2: Create Vitest Configuration

### File: `vitest.config.ts`

**Location:** Project root (same level as `vite.config.ts`)

**Contents:** See full config with environment, globals, coverage setup

---

## 🛠️ Step 3: Create Test Setup File

### File: `src/test/setup.ts`

**Purpose:** Global test configuration (cleanup, jest-dom matchers)

---

## 📝 Steps 4-6: Write Tests

1. **Navbar test** - Navigation links, conditional styling
2. **CountdownTimer test** - Props, time mocking
3. **FileUpload test** (optional) - User interactions

---

## 🔧 Step 7: Update package.json Scripts

Add: `test`, `test:ui`, `test:run`, `coverage`

---

## 📊 Step 8-9: Run Tests & Generate Coverage

Verify all tests pass and coverage > 30%

---

## 🎯 Verification Checklist

- [ ] All dependencies installed
- [ ] Config files created
- [ ] Tests passing
- [ ] Coverage report working

---

## ❓ Questions Before Implementation

1. Ready to install ~6 new dev dependencies? (~50MB)
2. Want all 3 test files, or just 2?
3. Want detailed explanations during implementation?
4. Should we add TypeScript types for Vitest globals?

Type "approve" to begin Phase 1! 🚀
