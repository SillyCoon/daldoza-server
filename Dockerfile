FROM node:12
WORKDIR /daldoza/services
COPY package*.json ./
RUN npm install
COPY . . 
EXPOSE 8000
ENTRYPOINT ["node", "index.js"]