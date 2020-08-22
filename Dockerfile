FROM node:12

WORKDIR /plexi
COPY package.json /plexi
COPY package-lock.json /plexi
RUN npm ci
COPY . /plexi

CMD npm run build:watch & npm start
