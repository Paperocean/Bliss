# Wybieramy obraz bazowy
FROM node:14

RUN apt-get update && apt-get install -y postgresql-client

# Ustawiamy katalog roboczy
WORKDIR /usr/src/app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę aplikacji
COPY . .

# Ustawiamy zmienną środowiskową
ENV NODE_ENV=production

# Otwieramy port, na którym aplikacja będzie działać
EXPOSE 5000

# Komenda uruchamiająca aplikację
CMD ["node", "server.js"]