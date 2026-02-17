FROM archlinux:latest

ENV DEBIAN_FRONTEND=noninteractive

# Update system
RUN pacman -Syu --noconfirm

# Install dependencies
RUN pacman -S --noconfirm \
    base-devel \
    git \
    nodejs \
    npm \
    pnpm \
    rust \
    cargo \
    python \
    python-pip \
    webkit2gtk \
    gtk3 \
    openssl \
    clang \
    cmake \
    pkgconf

# Install Rust target
RUN rustup default stable

WORKDIR /app

# Copy source
COPY . .

# Install frontend deps
RUN pnpm install

# Build frontend
RUN pnpm build

# Build Tauri app
RUN pnpm tauri build

CMD ["bash"]
