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
EXPOSE 5000

#Comando para iniciar la aplicacion
CMD ["npm", "start"]


## // comando en la terminar para crear la img
# docker build -t simply-app:v1 .
# docker run -p 3500:5000 simply-app:v1
# docker login -u 'codetecno' -p 'password' docker.io
# docker tag simple-app:v1 codetecno/test_repo:v1
# docker push codetecno/test_repo:v1