FROM --platform=linux/amd64 node:18.16.1

WORKDIR /app

# Expose ports
EXPOSE 5000
EXPOSE 9000
EXPOSE 9000

# Start emulators, watch for changes, and run tests
CMD [ "npm", "run", "emulators"]

# Install JRE and JDK
RUN apt-get update \
    && apt-get install default-jre -y \
    && apt-get install default-jdk -y

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g firebase-tools

# Copy source code to docker image
COPY . .