# ================================
# 1. Build Stage
# ================================
FROM rust:1.82 AS builder

# Install Node.js + pnpm (for Vite frontend)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm

# Install system deps for Tauri (GTK, WebKit, etc.)
RUN apt-get update && apt-get install -y \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    patchelf \
    build-essential \
    curl wget \
    && rm -rf /var/lib/apt/lists/*

# Create app dir
WORKDIR /app

# Copy manifests first (better caching)
COPY package.json pnpm-lock.yaml* ./
COPY src-tauri/Cargo.toml src-tauri/Cargo.lock* src-tauri/
COPY tauri.conf.json ./

# Install JS deps
RUN pnpm install

# Copy rest of project
COPY . .

# Build Tauri app (release mode)
RUN pnpm build && cargo tauri build --release

# ================================
# 2. Runtime Stage (Optional)
# ================================
FROM debian:bookworm-slim AS runtime

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libwebkit2gtk-4.1-0 \
    libayatana-appindicator3-1 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built binary from builder
COPY --from=builder /app/src-tauri/target/release/com-blackblazent-blackvideo-zephyra /usr/local/bin/app

# Default command
CMD ["app"]
