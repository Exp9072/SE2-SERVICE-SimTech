FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Salin semua file dari direktori `services/user`
COPY . .

EXPOSE 3001
CMD ["node", "app.js"]
