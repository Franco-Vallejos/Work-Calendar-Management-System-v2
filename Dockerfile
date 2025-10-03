FROM node:18

# Carpeta de trabajo en el contenedor
WORKDIR /app

# Copiamos solo package.json y package-lock.json primero (para cachear dependencias)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el código del proyecto
COPY . .

# Exponemos el puerto que usa React
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
