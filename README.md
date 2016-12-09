# Dooku


This service provide I18n for the pantaflix services.

## Deps

- Express
- Swagger
- Babel

## How to

```bash
$ git clone ... && cd
$ npm install
$ npm run start # Browse localhost:3000
```


## Docker

```bash
$ docker build -t dooku.pantaflix .
$ docker run -t -p 3000:3000 -i dooku.pantaflix # browse localhost:3000
```


## Build for production

```bash
$ npm run build
$ npm run serve # Browse localhost:3000
```