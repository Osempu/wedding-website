# ============================================
# STAGE 1: Dependencies
# ============================================
# Purpose: Install npm dependencies in isolated layer for caching
# Base: Alpine Linux (minimal, 40MB vs 1GB for full Node)
FROM node:24-alpine AS deps

# Set working directory (All subsequent commands run from here)
WORKDIR /app

# Copy only package files first (for layer caching)
# Why? If package.json unchanged, Docker reuses cached node_modules
COPY package.json package-lock.json ./

# Install dependencies with npm ci (clean install)
# --omit=dev: Skip devDependencies (TypeScript, Vite, etc.)
# Why? Production doesn't need build tools
RUN npm ci --omit=dev

# ============================================
# STAGE 2: Builder  
# ============================================
# Purpose: Build production assets (TypeScript → JavaScript, bundle)
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies)
# Why? Need TypeScript, Vite to build
RUN npm ci

# Copy source code
COPY . .

# Build-time environment variables (injected at build time)
# ARG: Available only during build, not in running container
ARG VITE_PUBLIC_SUPABASE_URL
ARG VITE_PUBLIC_SUPABASE_ANON_KEY
# Expose as ENV so Vite can access during build
ENV VITE_PUBLIC_SUPABASE_URL=$VITE_PUBLIC_SUPABASE_URL
ENV VITE_PUBLIC_SUPABASE_ANON_KEY=$VITE_PUBLIC_SUPABASE_ANON_KEY

# Build production bundle
# Output: dist/ folder with optimized HTML/CSS/JS
RUN npm run build

# ============================================
# STAGE 3: Runner (Production)
# ============================================
# Purpose: Serve built files with NGINX
# Base: nginx:alpine (only 7MB!)
FROM nginx:1.27-alpine-slim AS runner

# Copy built assets from builder stage
# Only dist/ folder, no source code or node_modules
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
# Why? React Router needs SPA fallback (all routes → index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (HTTP)
# Note: This is documentation only, doesn't actually publish port
EXPOSE 80

# Health check (optional but recommended)
# Every 30s, check if NGINX is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start NGINX
# daemon off: Run in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]