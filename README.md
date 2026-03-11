# Wedding Website 💍

[![Tests](https://github.com/Osempu/wedding-website/actions/workflows/test.yml/badge.svg)](https://github.com/Osempu/wedding-website/actions/workflows/test.yml)
[![Docker Build](https://github.com/Osempu/wedding-website/actions/workflows/docker.yml/badge.svg)](https://github.com/Osempu/wedding-website/actions/workflows/docker.yml)
[![Smoke Test](https://github.com/Osempu/wedding-website/actions/workflows/smoke-test.yml/badge.svg)](https://github.com/Osempu/wedding-website/actions/workflows/smoke-test.yml)

A modern wedding website built with React 19, TypeScript, and Vite. Features RSVP management, photo gallery with uploads, and countdown timer.

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript 5.8 + Vite 7
- **UI**: shadcn/ui (Radix UI primitives) + Tailwind CSS 4
- **Routing**: React Router 7
- **Backend**: Supabase (PostgreSQL + Storage)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Docker (multi-stage build, 20MB image)

## 📦 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Run tests in CI mode
npm run test:run

# Generate coverage report
npm run coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up

# Or build manually
docker build -t wedding-site \
  --build-arg VITE_PUBLIC_SUPABASE_URL=your_url \
  --build-arg VITE_PUBLIC_SUPABASE_ANON_KEY=your_key \
  .

# Run container
docker run -d -p 8080:80 wedding-site

# Visit http://localhost:8080
```

### Pull from GitHub Container Registry

```bash
# Pull latest production image (public)
docker pull ghcr.io/osempu/wedding-website:latest

# Run production container
docker run -d -p 8080:80 ghcr.io/osempu/wedding-website:latest
```

## 🏗️ Project Structure

```
src/
├── pages/              # Route pages (RSVP, Gallery, etc.)
├── components/         # Custom React components
│   ├── ui/            # shadcn/ui components (Button, Input, etc.)
│   └── __tests__/     # Component tests
├── lib/
│   ├── supabase.ts    # Supabase client
│   ├── storage.ts     # File upload utilities
│   └── utils.ts       # Utility functions (cn, etc.)
├── test/
│   └── setup.ts       # Vitest global setup
└── App.tsx            # Main application entry
```

## 🧪 Testing

Test suite includes 6 tests across 3 components:

- **Navbar**: Navigation and routing
- **CountdownTimer**: Date calculations and display
- **FileUpload**: File selection and validation

```bash
# Watch mode (development)
npm test

# Run once (CI)
npm run test:run

# Coverage report
npm run coverage

# UI mode (interactive)
npm run test:ui
```

## 🐳 Docker

**Multi-stage build** optimized for production:

- **Stage 1 (deps)**: Install production dependencies only
- **Stage 2 (builder)**: Build Vite application with environment variables
- **Stage 3 (runner)**: Serve with NGINX Alpine (final image: 20MB)

**Features:**
- SPA routing with NGINX fallback
- Gzip compression enabled
- Static asset caching (1 year)
- Health checks configured
- Optimized layer caching

## 🔄 CI/CD Pipeline

**Automated workflows on every push:**

### 1️⃣ Test Workflow
- Runs on every push and PR
- Matrix testing: Node.js 20, 22, 24
- Uploads coverage reports
- ~2 minutes with caching

### 2️⃣ Docker Build & Push
- Triggers on `master`/`first-deploy` branches and version tags
- Builds multi-stage Docker image
- Pushes to GitHub Container Registry (ghcr.io)
- Tags: `latest`, branch name, `sha-xxx`, semver
- ~3-4 minutes with layer caching

### 3️⃣ Smoke Test
- Runs after Docker build succeeds
- Tests critical routes: `/`, `/rsvp`, `/gallery`
- Verifies deployment integrity
- ~30 seconds

**Total pipeline time:** ~5-6 minutes from push to deployed image

## 📋 Release Process

We follow **semantic versioning** (MAJOR.MINOR.PATCH):

```bash
# Create a new release
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0

# Docker images automatically built and tagged:
# - ghcr.io/osempu/wedding-website:v1.0.0
# - ghcr.io/osempu/wedding-website:latest
```

**When to bump versions:**
- **MAJOR (v2.0.0)**: Breaking changes (API redesign, remove features)
- **MINOR (v1.1.0)**: New features, backward compatible
- **PATCH (v1.0.1)**: Bug fixes, security patches

## ⚙️ Environment Variables

Create `.env.local` file:

```env
VITE_PUBLIC_SUPABASE_URL=your_supabase_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**For CI/CD:** Add as GitHub repository secrets in Settings → Secrets → Actions

## 🛠️ Development Tools

- **Path Alias**: `@/` maps to `src/`
- **TypeScript**: Strict mode enabled
- **ESLint**: Flat config with TypeScript + React plugins
- **Prettier**: (Optional) Configure as needed
- **Husky**: (Optional) Git hooks for pre-commit checks

## 📚 Documentation

- [AGENTS.md](./AGENTS.md) - Developer guide for AI coding agents
- [Phase 1 Plan](./.ai/plans/phase-1-testing-implementation.md) - Testing setup guide
- [Phase 3 Plan](./.ai/plans/phase-3-github-actions-implementation.md) - CI/CD setup guide
- [Learning Plan](./.ai/context/docker-cicd-learning-plan.md) - Complete Docker & CI/CD roadmap

## 🔐 Security

- Supabase Row Level Security (RLS) enforced
- Secrets managed via GitHub Actions
- Dependency updates via Dependabot (coming soon)
- Container vulnerability scanning (coming soon)

## 🚀 Deployment

**Current:** Docker images published to GitHub Container Registry (public)

**Planned (Phase 4):**
- Azure Static Web Apps deployment
- Custom domain configuration
- PR preview environments
- Automated rollback on failures

## 📝 License

Private project - All rights reserved

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
