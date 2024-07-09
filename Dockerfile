FROM ghcr.io/puppeteer/puppeteer:22.12.1

# No necesitamos establecer PUPPETEER_SKIP_CHROMIUM_DOWNLOAD ya que la imagen ya incluye Chrome

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Asegúrate de que la aplicación use el Chrome incluido en la imagen
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

CMD [ "node", "index.js" ]
