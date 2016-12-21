# To contribute

In order to contribute to this project, a few guidelines needs to be respected :

- Never push on master directly.
- Don't push on develop for new features.
- Works with pull request for new features.
- Work with flow, test and eslint.
- Respect the .editorconfig

## Deps

- Express
- Swagger
- Babel

## How to

```bash
$ git clone ... && cd
$ npm install
$ npm run install-flow-deps
$ npm run start # Browse localhost:3000
```

# Code quality

## Tests

```bash
$ npm run test
```

## Linter

```bash
$ npm run lint
```

## Flow

```bash
$ npm run flow
```

## Docker

```bash
$ docker build -t dooku.pantaflix .
$ docker run -t -p 3000:3000 -i i18n-service # browse localhost:3000
```


## Build for production

```bash
$ npm run build
$ npm run serve # Browse localhost:3000
```
