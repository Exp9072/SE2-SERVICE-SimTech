FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Salin file aplikasi order dan dependensinya
COPY services/order/ .

# Salin rabbitmq.js ke lokasi yang sesuai
COPY rabbitmq/ ./rabbitmq/

EXPOSE 3003
CMD ["node", "app.js"]
