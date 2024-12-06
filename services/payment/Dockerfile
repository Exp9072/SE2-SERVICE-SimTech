FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Salin file aplikasi payment dan dependensinya
COPY services/payment/ .

# Salin rabbitmq.js ke lokasi yang sesuai
COPY rabbitmq/ ./rabbitmq/

EXPOSE 3004
CMD ["node", "app.js"]
