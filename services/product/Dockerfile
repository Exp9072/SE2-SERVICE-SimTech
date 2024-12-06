FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Salin semua file dari direktori `services/product`
COPY services/product/ .

EXPOSE 3002
CMD ["node", "app.js"]
