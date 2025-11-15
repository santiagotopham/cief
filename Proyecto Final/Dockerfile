#YAML
#Imagen qu edescargaremos como base desde DockerHub
FROM node:24-alpine

#Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

#Copiamos el package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

#Instalamos las dependencias del proyecto
RUN npm install

#Copiamos el resto de los archivos del proyecto al contenedor
COPY . .

#Exponemos el puerto en el que la aplicacion escuchara
EXPOSE 4200

#Comando para iniciar la aplicacion
CMD ["node", "src/app.js"]