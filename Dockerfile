FROM node:10.16
RUN git clone https://github.com/sayantanhore/writer-server.git /app
WORKDIR /app
RUN npm install -g yarn
RUN yarn install
ENTRYPOINT ["yarn", "start"]