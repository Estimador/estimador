FROM node:latest

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Instalar Playwright y sus navegadores
RUN npx playwright install-deps
RUN npx playwright install

ENV PLAYWRIGHT_BROWSERS_PATH=/usr/src/app/node_modules/playwright/.cache/playwright

CMD ["npm", "start"]
