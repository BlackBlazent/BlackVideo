FROM archlinux:latest

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

WORKDIR /blackvideo

# Clone repo
RUN git clone https://github.com/BlackBlazent/BlackVideo.git .

RUN pnpm install

CMD ["bash"]
