# FROM node:18.16.1
FROM node:16.15.0

RUN apt-get update \
    && apt-get install default-jre -y \
    && apt-get install default-jdk -y

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 9000
EXPOSE 9000

CMD [ "npm", "run", "emulators"]