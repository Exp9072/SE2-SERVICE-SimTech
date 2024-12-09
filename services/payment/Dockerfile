FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Salin file aplikasi order dan dependensinya
COPY . .

EXPOSE 3004
CMD ["node", "app.js"]
