# Usa la imagen base adecuada para tu aplicación (por ejemplo, Node.js)
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json (si lo tienes) al directorio de trabajo
COPY package*.json ./

# Instala las dependencias de tu aplicación
RUN npm install

# Instala Playwright y los navegadores necesarios (Chromium, Firefox, Webkit)
RUN npx playwright install

# Copia el resto de tu aplicación al directorio de trabajo
COPY . .

# Expón el puerto en el que tu aplicación expone servicios
EXPOSE 3000

# Comando para ejecutar tu aplicación cuando el contenedor se inicie
CMD [ "node", "src/index.js" ]

