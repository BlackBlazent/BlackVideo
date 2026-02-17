FROM blackarchlinux/blackarch:latest

RUN pacman -Syu --noconfirm

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

RUN rustup default stable

WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm build
RUN pnpm tauri build

CMD ["bash"]
