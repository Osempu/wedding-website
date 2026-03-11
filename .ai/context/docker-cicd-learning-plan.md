# 🎓 Docker + GitHub Actions CI/CD - Complete Learning Path

## 📊 Current Status Assessment

### ✅ What You Have
- React 19 + Vite 7 + TypeScript project
- Docker installed (v28.4.0)
- GitHub repository: `Osempu/wedding-website`
- Current branch: `first-deploy`
- Environment variables in `.env.local`

### ❌ What You Need to Implement
- Vitest testing framework
- Multi-stage Dockerfile
- GitHub Actions workflows
- Azure Static Web Apps deployment
- PR preview environments

### ⚠️ Prerequisites Needed
- Azure CLI (not installed yet)
- Azure account
- GitHub repository secrets

---

## 📚 Step-by-Step Learning Plan

## **Phase 1: Foundation Setup (Testing Infrastructure)** 🧪

### Lesson 1.1: Understanding Vitest
**What You'll Learn:** Why testing matters in CI/CD, Vitest vs Jest

**Implementation Tasks:**
1. Install Vitest + React Testing Library
2. Configure `vitest.config.ts`
3. Create sample component tests
4. Add test scripts to `package.json`
5. Generate coverage reports

**Why This First?** GitHub Actions will run tests, so we need them working locally first.

---

### Lesson 1.2: Write Your First Tests
**What You'll Learn:** Component testing, coverage metrics

**Files to Create:**
- `vitest.config.ts` - Test runner configuration
- `src/components/__tests__/navbar.test.tsx` - Example test
- `src/pages/__tests__/gallery.test.tsx` - Page test

**Success Criteria:** 
- `npm test` runs successfully
- Coverage report generated
- At least 2-3 components tested

---

## **Phase 2: Docker Mastery** 🐳

### Lesson 2.1: Understanding Multi-Stage Builds
**What You'll Learn:** Why multi-stage builds matter, build vs runtime dependencies

**Concepts:**
```dockerfile
# Stage 1: Dependencies (build-time only)
# Stage 2: Build (compile TypeScript, bundle with Vite)
# Stage 3: Production (NGINX serving static files)
```

**Why Multi-Stage?**
- Smaller final image (only production assets)
- Faster builds (layer caching)
- Security (no build tools in production)

---

### Lesson 2.2: Creating Your Dockerfile
**What You'll Learn:** Docker layers, caching strategies, NGINX configuration

**Files to Create:**
1. `Dockerfile` - Multi-stage build
2. `nginx.conf` - Production web server config
3. `.dockerignore` - Exclude unnecessary files
4. `docker-compose.yml` - Local development (optional)

**Structure Overview:**
```dockerfile
# Stage 1: dependencies
FROM node:20-alpine AS deps
# Install dependencies only

# Stage 2: builder
FROM node:20-alpine AS builder
# Build the app

# Stage 3: runner
FROM nginx:alpine AS runner
# Serve static files
```

---

### Lesson 2.3: Environment Variables in Docker
**What You'll Learn:** Build-time vs runtime variables, secure secrets handling

**Challenges to Solve:**
- How to inject `VITE_PUBLIC_SUPABASE_URL` at build time?
- How to use different values for dev/staging/production?
- Using `ARG` vs `ENV` in Dockerfile

**Practical Exercise:**
```bash
docker build --build-arg VITE_PUBLIC_SUPABASE_URL=xxx .
docker run -p 8080:80 wedding-site:latest
```

---

### Lesson 2.4: Testing Your Docker Image Locally
**What You'll Learn:** Docker debugging, troubleshooting, optimization

**Hands-on Practice:**
1. Build the image: `docker build -t wedding-site:local .`
2. Run it: `docker run -p 8080:80 wedding-site:local`
3. Test in browser: `http://localhost:8080`
4. Inspect image size: `docker images`
5. Debug container: `docker exec -it <container> sh`

**Success Criteria:**
- Image builds successfully
- App runs on port 8080
- Environment variables work
- Image size < 50MB (optimized)

---

## **Phase 3: GitHub Actions CI/CD** ⚙️

### Lesson 3.1: Understanding GitHub Actions
**What You'll Learn:** Workflows, jobs, steps, runners, triggers

**Key Concepts:**
- **Workflow**: Automated process (e.g., "test and deploy")
- **Job**: Group of steps (e.g., "run tests")
- **Step**: Individual task (e.g., "npm install")
- **Runner**: VM that executes jobs (ubuntu-latest, windows-latest)
- **Trigger**: Events that start workflows (push, pull_request)

**Diagram:**
```
Push to GitHub → Trigger Workflow → Run Jobs in Parallel
                                   ├─ Test Job (Vitest)
                                   ├─ Build Job (Docker)
                                   └─ Deploy Job (Azure)
```

---

### Lesson 3.2: Your First Workflow - Testing
**What You'll Learn:** YAML syntax, job dependencies, matrix builds

**File to Create:** `.github/workflows/test.yml`

**Workflow Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run tests
5. Upload coverage report

**Advanced Concepts:**
- Caching dependencies for speed
- Matrix strategy (test on multiple Node versions)
- Uploading artifacts (coverage reports)

---

### Lesson 3.3: Build & Push Docker Images
**What You'll Learn:** Docker registry, image tagging, secrets

**File to Create:** `.github/workflows/docker.yml`

**Where to Push?**
- **Option A:** GitHub Container Registry (ghcr.io) - Free, integrated
- **Option B:** Docker Hub - Popular, free tier available
- **Option C:** Azure Container Registry - If using Azure

**Workflow Steps:**
1. Build Docker image
2. Login to registry
3. Tag image (e.g., `ghcr.io/osempu/wedding-site:main`)
4. Push to registry

**Secrets You'll Need:**
- `GITHUB_TOKEN` (automatic)
- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`

---

### Lesson 3.4: Deploy to Azure Static Web Apps
**What You'll Learn:** Azure deployment, SWA configuration, deployment tokens

**Prerequisites Setup:**
1. Install Azure CLI
2. Create Azure account (free tier)
3. Create Static Web App resource
4. Get deployment token

**File to Create:** `.github/workflows/deploy.yml`

**Deployment Strategy:**
```yaml
- main branch → Production (app.azurestaticapps.net)
- PRs → Preview environments (unique URLs per PR)
```

---

### Lesson 3.5: PR Preview Environments
**What You'll Learn:** Feature branch testing, automated cleanup

**Magic Feature:** Each PR gets its own URL!
```
PR #42 → https://wedding-site-42.azurestaticapps.net
PR #43 → https://wedding-site-43.azurestaticapps.net
```

**Benefits:**
- Test features before merging
- Share with stakeholders
- No manual deployment needed

**Configuration:**
- Auto-deploy on PR open/update
- Auto-cleanup on PR close/merge

---

## **Phase 4: Advanced Topics** 🚀

### Lesson 4.1: Workflow Optimization
**What You'll Learn:** Speed up CI/CD, cost reduction

**Techniques:**
- Dependency caching
- Docker layer caching
- Parallel job execution
- Conditional workflows (skip tests on docs changes)

---

### Lesson 4.2: Security Best Practices
**What You'll Learn:** Secrets management, vulnerability scanning

**Topics:**
- Never commit secrets to git
- Use GitHub Secrets for sensitive data
- Scan Docker images for vulnerabilities
- Dependabot for dependency updates

---

### Lesson 4.3: Monitoring & Rollback
**What You'll Learn:** Deployment verification, rollback strategies

**Implementation:**
- Health check endpoints
- Smoke tests after deployment
- Rollback to previous version on failure
- Deployment notifications (Slack, Discord)

---

## 🎯 Complete Implementation Roadmap

### **Week 1: Testing Foundation**
- [ ] Day 1-2: Install Vitest, configure
- [ ] Day 3-4: Write component tests
- [ ] Day 5: Achieve 50%+ code coverage
- [ ] Day 6-7: Review & understand testing patterns

### **Week 2: Docker Mastery**
- [ ] Day 1-2: Learn Docker concepts, create basic Dockerfile
- [ ] Day 3: Implement multi-stage build
- [ ] Day 4: Configure NGINX
- [ ] Day 5: Environment variable injection
- [ ] Day 6: Optimize image size
- [ ] Day 7: Test locally end-to-end

### **Week 3: GitHub Actions**
- [ ] Day 1-2: Test workflow
- [ ] Day 3-4: Docker build & push workflow
- [ ] Day 5: Install Azure CLI, setup account
- [ ] Day 6-7: Deploy workflow

### **Week 4: Advanced & Polish**
- [ ] Day 1-2: PR preview environments
- [ ] Day 3-4: Optimize workflows
- [ ] Day 5-6: Security hardening
- [ ] Day 7: Documentation & celebration! 🎉

---

## ❓ Decision Points

Before starting implementation, answer these questions to customize the plan:

### **1. Docker Registry Choice**
Where do you want to store your Docker images?
- [ ] **A)** GitHub Container Registry (ghcr.io) - Recommended, free, integrated
- [ ] **B)** Docker Hub - Need to create account
- [ ] **C)** Azure Container Registry - More advanced, costs money

### **2. Azure Commitment**
Are you committed to using Azure Static Web Apps?
- [ ] **Yes** → We'll set up Azure CLI and SWA
- [ ] **No** → Alternative: Vercel, Netlify, or just Docker Hub
- [ ] **Maybe** → We can start with Docker + GitHub Actions, add Azure later

### **3. Testing Coverage Goal**
How much testing do you want to implement?
- [ ] **A)** Minimal (2-3 test files, basic coverage) - Faster to implement
- [ ] **B)** Moderate (Test critical components, ~50% coverage) - Balanced
- [ ] **C)** Comprehensive (Test everything, 80%+ coverage) - Most learning

### **4. Learning Pace**
What's your preferred learning style?
- [ ] **A)** Fast track - Implement quickly, learn by doing (2 weeks)
- [ ] **B)** Balanced - Understand each step deeply (4 weeks)
- [ ] **C)** Slow & steady - Deep dive into every concept (6+ weeks)

### **5. Immediate Priority**
What do you want to tackle first?
- [ ] **A)** Testing (Vitest setup)
- [ ] **B)** Docker (Multi-stage build)
- [ ] **C)** GitHub Actions (CI/CD)
- [ ] **D)** All together (guided order)

---

## 📖 Next Steps

Once you've made your decisions above:

1. **Phase 1 Implementation** will be created with:
   - Exact commands to run
   - File-by-file code walkthroughs
   - Explanations of every concept
   - Checkpoints to verify progress

2. **Step-by-step implementation**:
   - Concept explanation
   - Code walkthrough
   - Implementation
   - Testing & verification
   - Move to next step

3. **Build real DevOps skills**:
   - Docker containerization
   - CI/CD pipelines
   - Cloud deployment
   - Industry best practices

---

## 📝 Progress Tracking

Mark your progress as you complete each phase:

- [ ] Phase 1: Testing Infrastructure
- [ ] Phase 2: Docker Mastery
- [ ] Phase 3: GitHub Actions CI/CD
- [ ] Phase 4: Advanced Topics

---

**Ready to start?** Fill out the Decision Points section and let your AI tutor know which path you'd like to take! 🚀
