
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

### Run

```bash
docker-compose exec api npx prisma migrate dev --preview-feature
```

### Create

```bash
docker-compose exec api npx prisma migrate dev --name "tutors and tutors_addresses"

```

## Test

```bash
docker-compose exec api npm run test:e2e
```

## License

Nest is [MIT licensed](LICENSE).
