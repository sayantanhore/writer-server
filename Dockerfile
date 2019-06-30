FROM node:10.16
WORKDIR /app
COPY ./ssl/ /app/ssl/
COPY ./package.json /app
COPY ./server.js /app
RUN npm install -g yarn
RUN yarn install
ENTRYPOINT ["yarn", "start"]