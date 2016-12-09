# Dooku

This service provide I18n for the pantaflix services.

# To contribute

In order to contribute to this project, a few guidelines needs to be respected :

- Never push on master directly.
- Don't push on develop for new features.
- Works with pull request for new features.
- Respect the .editorconfig
- Before pushing run the test and the linter



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


## Tests

```bash
$ npm run test
```


## Linter

```bash
$ npm run lint
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
