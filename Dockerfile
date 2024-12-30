# Usa Node.js como base
FROM node:16-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia archivos necesarios
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto de NestJS
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "run", "start:dev"]
