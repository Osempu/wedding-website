# Phase 3: GitHub Actions CI/CD - Implementation Guide

## 🎯 Overview

This phase implements a complete CI/CD pipeline using GitHub Actions with:
- **Test workflow**: Automated testing on every push/PR
- **Docker workflow**: Build and publish images to GitHub Container Registry
- **Smoke test workflow**: Quick deployment verification
- **Semantic versioning**: Git tag-based versioning strategy
- **Public registry**: ghcr.io/osempu/wedding-website

## 📋 Prerequisites

- [x] Phase 1 complete (Vitest testing infrastructure)
- [x] Phase 2 complete (Docker multi-stage build - 20.6MB image)
- [x] Code pushed to GitHub (first-deploy branch)
- [ ] GitHub secrets configured
- [ ] GitHub Container Registry enabled

## 🎓 What You'll Learn

### Core Concepts

1. **GitHub Actions Architecture**
   - **Workflows**: YAML files in `.github/workflows/` that define automation
   - **Events**: Triggers (push, pull_request, workflow_dispatch, etc.)
   - **Jobs**: Collections of steps that run on the same runner
   - **Steps**: Individual tasks (checkout code, run commands, etc.)
   - **Runners**: GitHub-hosted VMs (ubuntu-latest, windows-latest, macos-latest)
   - **Actions**: Reusable units (actions/checkout, actions/setup-node, etc.)

2. **YAML Syntax Essentials**
   ```yaml
   key: value                    # String
   number: 42                    # Number
   boolean: true                 # Boolean
   array:                        # Array
     - item1
     - item2
   object:                       # Object/Map
     nested_key: nested_value
   multiline: |                  # Multiline string (preserves newlines)
     Line 1
     Line 2
   ```

3. **Event Triggers**
   - `push`: On git push to specific branches
   - `pull_request`: On PR open/update/sync
   - `workflow_dispatch`: Manual trigger from UI
   - `schedule`: Cron-based scheduling
   - `release`: On GitHub release creation

4. **Secrets & Environment Variables**
   - Repository secrets: Encrypted, never exposed in logs
   - Environment variables: Passed to workflows via `env:`
   - Built-in secrets: `GITHUB_TOKEN` (automatic authentication)

5. **Caching Strategies**
   - **Dependency caching**: Cache `node_modules` to speed up installs
   - **Docker layer caching**: Reuse unchanged layers
   - **Build output caching**: Cache compiled artifacts

6. **Docker Registry Integration**
   - **ghcr.io**: GitHub Container Registry (free, integrated)
   - Authentication: `docker/login-action` with `GITHUB_TOKEN`
   - Tagging strategies: latest, branch, SHA, semver
   - Visibility: Public vs private packages

---

## 📝 Implementation Steps

### Step 2: Configure GitHub Secrets (5 min)

**Why we need secrets:**
- Environment variables required for Vite build (`VITE_PUBLIC_*`)
- Cannot hardcode in workflows (security best practice)
- GitHub secrets are encrypted at rest and in transit

**Secrets to add:**
1. `VITE_PUBLIC_SUPABASE_URL`: `https://tfdpimxlhkdcjsygtqot.supabase.co`
2. `VITE_PUBLIC_SUPABASE_ANON_KEY`: Your anon key from `.env.local`

**How to add:**
1. Go to: https://github.com/Osempu/wedding-website/settings/secrets/actions
2. Click "New repository secret"
3. Enter name (exact match required)
4. Paste value
5. Click "Add secret"
6. Repeat for second secret

**Note:** The anon key is safe to expose publicly - it's designed for client-side use with Row Level Security (RLS) enforced on Supabase.

---

### Step 3: Create Test Workflow (20 min)

**File:** `.github/workflows/test.yml`

**What it does:**
- Runs on every push to any branch
- Runs on every pull request
- Tests across Node.js 20, 22, and 24 (matrix build)
- Caches npm dependencies for speed
- Uploads coverage reports as artifacts
- Fails fast if one version fails

**Key concepts:**
- **Matrix strategy**: Run same job with different parameters
- **actions/checkout@v4**: Clones your repository
- **actions/setup-node@v4**: Installs Node.js with version matrix
- **actions/cache@v4**: Caches dependencies between runs
- **actions/upload-artifact@v4**: Stores test results/coverage

**Workflow structure:**
```yaml
name: Test                      # Workflow name (shows in GitHub UI)
on: [push, pull_request]        # Event triggers
jobs:                           # Jobs to run
  test:                         # Job ID
    runs-on: ubuntu-latest      # Runner OS
    strategy:                   # Matrix configuration
      matrix:
        node-version: [20, 22, 24]
    steps:                      # Steps to execute
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci                    # Install exact versions
      - run: npm run test:run          # Run tests
```

**Why `npm ci` instead of `npm install`:**
- Faster (up to 2x)
- Uses `package-lock.json` exactly (reproducible)
- Removes `node_modules` first (clean state)
- Perfect for CI/CD environments

---

### Step 4: Create Docker Build Workflow (30 min)

**File:** `.github/workflows/docker.yml`

**What it does:**
- Builds Docker image on push to `master`/`first-deploy`
- Builds on version tags (`v*.*.*`)
- Pushes to GitHub Container Registry (ghcr.io)
- Tags images multiple ways:
  - `latest` (for master branch)
  - `<branch-name>` (e.g., `first-deploy`)
  - `sha-<commit>` (for traceability)
  - `v1.0.0` (for semver tags)
- Makes images public
- Uses Docker BuildKit for layer caching

**Key concepts:**
- **docker/setup-buildx-action**: Enables BuildKit (faster builds)
- **docker/login-action**: Authenticates to ghcr.io
- **docker/metadata-action**: Generates tags and labels automatically
- **docker/build-push-action**: Builds and pushes image
- **Build args**: Pass secrets to Dockerfile ARG directives
- **Layer caching**: Reuse unchanged layers from previous builds

**Tagging strategy explained:**
```bash
# On push to master branch:
ghcr.io/osempu/wedding-website:latest
ghcr.io/osempu/wedding-website:master
ghcr.io/osempu/wedding-website:sha-a1b2c3d

# On push to first-deploy branch:
ghcr.io/osempu/wedding-website:first-deploy
ghcr.io/osempu/wedding-website:sha-e4f5g6h

# On version tag (v1.0.0):
ghcr.io/osempu/wedding-website:v1.0.0
ghcr.io/osempu/wedding-website:latest
ghcr.io/osempu/wedding-website:sha-i7j8k9l
```

**Docker metadata-action magic:**
- Automatically detects git ref (branch/tag)
- Generates appropriate tags
- Adds OCI labels (commit SHA, build date, source URL)
- Handles semver parsing

**Why BuildKit:**
- Parallel layer builds (faster)
- Better layer caching
- Build secrets support
- Multi-platform builds capability

---

### Step 5: Create Smoke Test Workflow (20 min)

**File:** `.github/workflows/smoke-test.yml`

**What it does:**
- Triggers after Docker workflow completes
- Pulls the newly built image
- Starts container on port 8080
- Tests critical routes: `/`, `/rsvp`, `/gallery`
- Verifies HTTP 200 responses
- Checks for basic content presence
- Stops container after tests

**Key concepts:**
- **workflow_run**: Trigger on another workflow completion
- **Service containers**: Run containers as part of workflow
- **Health checks**: Retry logic for container startup
- **curl**: HTTP client for endpoint testing
- **Job dependencies**: `needs:` keyword

**Why smoke tests:**
- Quick verification (30 seconds)
- Catches broken builds before deployment
- Tests Docker image integrity
- Verifies routing configuration
- No need for full E2E test suite

**Alternative approach (service containers):**
```yaml
services:
  wedding-site:
    image: ghcr.io/osempu/wedding-website:latest
    ports:
      - 8080:80
```

---

### Step 6: Semantic Versioning Practice (15 min)

**What is Semantic Versioning:**
Format: `MAJOR.MINOR.PATCH` (e.g., `v1.0.0`)

- **MAJOR**: Breaking changes (v1 → v2)
  - API changes that break existing functionality
  - Major redesign
  - Remove/rename features

- **MINOR**: New features, backward compatible (v1.0 → v1.1)
  - Add new functionality
  - Deprecate (but don't remove) features
  - Significant internal improvements

- **PATCH**: Bug fixes, backward compatible (v1.0.0 → v1.0.1)
  - Fix bugs
  - Security patches
  - Documentation updates

**Your release strategy:**
```bash
# First production release
git tag -a v1.0.0 -m "Initial production release"

# Bug fix release
git tag -a v1.0.1 -m "Fix RSVP form validation"

# New feature release
git tag -a v1.1.0 -m "Add photo gallery with upload"

# Breaking change release
git tag -a v2.0.0 -m "Redesign with new authentication system"
```

**How to create and push tags:**
```bash
# Create annotated tag (recommended)
git tag -a v1.0.0 -m "Release message"

# Push specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags

# List tags
git tag -l

# Delete tag locally
git tag -d v1.0.0

# Delete tag on remote
git push origin --delete v1.0.0
```

**When to create releases:**
1. After merging feature branch to master
2. After testing on staging (first-deploy)
3. When ready for production deployment
4. Document changes in GitHub Release notes

---

### Step 7: End-to-End Pipeline Test (20 min)

**Test scenario:**
1. Make a small code change (e.g., update navbar text)
2. Commit and push to `first-deploy` branch
3. Watch workflows execute in GitHub Actions tab
4. Verify test workflow passes
5. Verify Docker workflow builds and pushes image
6. Pull image locally and test
7. Create version tag and verify tag workflow

**What to verify:**
- ✅ Test workflow completes in ~2 minutes
- ✅ All 6 tests pass
- ✅ Docker workflow completes in ~3-4 minutes
- ✅ Image appears in GitHub Packages
- ✅ Image has correct tags (branch name, sha-xxx)
- ✅ Image is public (can pull without authentication)
- ✅ Container runs successfully
- ✅ All routes accessible

**Commands to test locally:**
```bash
# Pull latest image
docker pull ghcr.io/osempu/wedding-website:first-deploy

# Run container
docker run -d -p 8080:80 --name test-site ghcr.io/osempu/wedding-website:first-deploy

# Test routes
curl http://localhost:8080/
curl http://localhost:8080/rsvp
curl http://localhost:8080/gallery

# Check logs
docker logs test-site

# Stop and remove
docker stop test-site
docker rm test-site
```

**Troubleshooting common issues:**

1. **Workflow doesn't trigger:**
   - Check branch name matches workflow `on.push.branches`
   - Verify `.github/workflows/` path is correct
   - Check YAML syntax (use yamllint.com)

2. **Docker build fails:**
   - Check secrets are configured correctly
   - Verify Dockerfile exists at repository root
   - Check build args match Dockerfile ARG names

3. **Image push permission denied:**
   - Enable GitHub Packages in repo settings
   - Check workflow has `packages: write` permission
   - Verify `GITHUB_TOKEN` is available

4. **Image not public:**
   - Go to package settings on GitHub
   - Change visibility to public
   - Update package permissions

---

### Step 8: Documentation & Badges (15 min)

**Add workflow badges to README:**
```markdown
# Wedding Website

[![Tests](https://github.com/Osempu/wedding-website/actions/workflows/test.yml/badge.svg)](https://github.com/Osempu/wedding-website/actions/workflows/test.yml)
[![Docker Build](https://github.com/Osempu/wedding-website/actions/workflows/docker.yml/badge.svg)](https://github.com/Osempu/wedding-website/actions/workflows/docker.yml)
[![Docker Image Size](https://ghcr-badge.egpl.dev/osempu/wedding-website/size)](https://github.com/Osempu/wedding-website/pkgs/container/wedding-website)
```

**Create release documentation:**
Document the release process for future reference:

1. Merge feature branch to `first-deploy`
2. Test on staging
3. Merge `first-deploy` to `master`
4. Create version tag
5. GitHub Actions automatically builds and publishes
6. Pull production image and deploy

---

## 🔧 Advanced Topics

### Workflow Optimization

**Concurrent jobs:**
```yaml
jobs:
  test:
    # runs immediately
  
  lint:
    # runs in parallel with test
  
  docker:
    needs: [test, lint]  # waits for both
```

**Conditional execution:**
```yaml
steps:
  - name: Deploy to production
    if: github.ref == 'refs/heads/master'
    run: ./deploy.sh
```

**Skip workflows on documentation changes:**
```yaml
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### Security Best Practices

1. **Minimal permissions:**
```yaml
permissions:
  contents: read
  packages: write
```

2. **Pin action versions:**
```yaml
- uses: actions/checkout@v4.1.1  # pinned
# NOT: actions/checkout@v4       # floating
```

3. **Scan for vulnerabilities:**
```yaml
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/osempu/wedding-website:latest
```

4. **Secret rotation:**
- Rotate secrets every 90 days
- Use short-lived tokens when possible
- Audit secret access regularly

### PR Preview Environments

**Concept:** Build Docker image for every PR with unique tag

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  build-preview:
    steps:
      - name: Build PR image
        run: docker build -t ghcr.io/osempu/wedding-website:pr-${{ github.event.pull_request.number }} .
      
      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: `🐳 Preview image: \`ghcr.io/osempu/wedding-website:pr-${context.issue.number}\``
            })
```

**Cleanup on PR close:**
```yaml
on:
  pull_request:
    types: [closed]

jobs:
  cleanup:
    steps:
      - name: Delete PR image
        run: |
          # Delete image with PR tag
```

---

## 📊 Success Metrics

After completing Phase 3, you should have:

- ✅ **3 GitHub Actions workflows** running automatically
- ✅ **Public Docker images** at ghcr.io/osempu/wedding-website
- ✅ **Automated testing** on every push/PR
- ✅ **Semantic versioning** with Git tags
- ✅ **~3-4 minute pipeline** from push to published image
- ✅ **20MB optimized Docker image** (multi-stage build)
- ✅ **Complete CI/CD understanding** (workflows, secrets, caching, registries)

**Performance benchmarks:**
- Test workflow: ~2 minutes (with caching)
- Docker workflow: ~3-4 minutes (with layer caching)
- Smoke test: ~30 seconds
- Total: ~5-6 minutes for complete pipeline

---

## ❓ Knowledge Check Questions

After implementation, you should be able to answer:

1. What's the difference between a workflow, job, and step?
2. When would you use `npm ci` vs `npm install`?
3. How does Docker layer caching improve build times?
4. What's the purpose of `docker/metadata-action`?
5. When should you bump MAJOR vs MINOR vs PATCH version?
6. How do GitHub secrets differ from environment variables?
7. What does `runs-on: ubuntu-latest` mean?
8. Why use annotated tags (`git tag -a`) instead of lightweight tags?
9. What's the difference between `on: push` and `on: workflow_dispatch`?
10. How do matrix builds help with testing?

---

## 🚀 Next Steps (Phase 4)

After mastering Phase 3, you'll be ready for:

1. **Azure Static Web Apps deployment**
   - Create Azure SWA resource
   - Add deployment workflow
   - Configure custom domains
   - Set up PR preview environments on Azure

2. **Advanced workflow optimization**
   - Reusable workflows
   - Composite actions
   - Self-hosted runners

3. **Monitoring & observability**
   - Workflow failure notifications
   - Performance monitoring
   - Error tracking

4. **Security hardening**
   - Dependabot alerts
   - CodeQL scanning
   - Container vulnerability scanning

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker BuildKit](https://docs.docker.com/build/buildkit/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [YAML Syntax](https://yaml.org/)

---

**Ready to implement? Let's start with Step 2: Configuring GitHub Secrets!**
