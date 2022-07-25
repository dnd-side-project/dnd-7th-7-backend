FROM node:16.15.1
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
EXPOSE 3000

CMD ["npm", "run", "start:dev"]
