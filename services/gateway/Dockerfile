FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Salin semua file dari direktori `services/gateway`
COPY . .

EXPOSE 3000
CMD ["node", "app.js"]
