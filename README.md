# Contract Management API

## Description

A Contract management application built with nestjs.
Contract Management Backend API. To automate the lifecycle of a contract between two or more parties. (From creation to execution).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# deploy to AWS ELASTIV BEANSTALK
$ npm run deploy

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

```
NODE_ENV=(example: development or production)
PORT=
DATABASE_TYPE=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

ACCOUNT_DATABASE_HOST=
ACCOUNT_DATABASE_PORT=
ACCOUNT_DATABASE_USER=
ACCOUNT_DATABASE_PASSWORD=
ACCOUNT_DATABASE_NAME=

JWT_SECRET = //this should be the same secret used for signing the log in token
```
