FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.2.5
RUN npm install
COPY . .
RUN rm -rf /app/config
EXPOSE 3000
CMD ["npm", "start"]
