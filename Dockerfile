# Ejemplo de Dockerfile para una aplicación Node.js en Render

# Usando una imagen base de Node.js
FROM node:latest

# Instalando dependencias del sistema
RUN apt-get update && \
    apt-get install -y \
        libicu-dev \
        libevent-dev \
        libjpeg-dev \
        libenchant-dev \
        libsecret-1-0 \
        libffi-dev \
        libgles2 \
        # etc.

# Configurando el directorio de trabajo de la aplicación
WORKDIR /usr/src/app

# Copiando los archivos de la aplicación
COPY . .

# Instalando las dependencias de Node.js
RUN npm install

# Configurando la variable de entorno para Playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/render/.cache/ms-playwright/

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
