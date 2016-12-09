FROM node:latest

ENV APP=/app
ENV PORT 3000

WORKDIR $APP

COPY package.json $APP/

RUN npm install

COPY . $APP/

RUN npm run build

EXPOSE 3000

CMD npm run serve
