
## Installation

```bash
npm install
```

## Running the app

```bash
docker-compose build

docker-compose up

```

## Migration

```bash
docker-compose exec api npx prisma migrate dev --name "tutors and tutors_addresses"

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

## License

Nest is [MIT licensed](LICENSE).
