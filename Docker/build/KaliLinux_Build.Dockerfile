FROM kalilinux/kali-rolling

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt upgrade -y

RUN apt install -y \
    build-essential \
    curl \
    git \
    nodejs \
    npm \
    python3 \
    python3-pip \
    libwebkit2gtk-4.0-dev \
    libgtk-3-dev \
    libssl-dev \
    clang \
    cmake \
    pkg-config

RUN npm install -g pnpm

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"

WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm build
RUN pnpm tauri build

CMD ["bash"]
