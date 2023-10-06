FROM --platform=linux/amd64 node:18.16.1

WORKDIR /app

# Expose ports
EXPOSE 5000
EXPOSE 9000
EXPOSE 9000

# Start emulators, watch for changes, and run tests
CMD [ "npm install"]

# Install JRE and JDK
RUN apt-get update \
    && apt-get install default-jre -y \
    && apt-get install default-jdk -y


# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source code to docker image
COPY . .