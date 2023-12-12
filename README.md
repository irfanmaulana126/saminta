<p>
  <a href="https://7code.ro/" target="blank"><img src="https://avatars.githubusercontent.com/u/41831998" height="100" alt="7Code Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) + [Prisma](https://github.com/prisma/prisma) + [TypeScript](https://github.com/microsoft/TypeScript) starter repository.

### Production-ready REST API:

- Error Handling (Exception Filters)
- Logging System
- DB Seeds
- Built-in AuthModule, using JWT. Route Guards
- Model Events Listener (onCreated, …)
- Deployable. CI/CD pipeline using Github Actions.
- Advanced ESLint/TSLint config. (e.g: auto-fix will remove unused imports)
- Shared services/constants/helpers
- Middlewares/Interceptors implementation example.

## TO-DO

- Add Mail Service
- Add [Recap.DEV](https://recap.dev/) integration - Tracing/Monitoring service
- Add Unit tests.
- Add Social Media Auth
- Add documentation for setting the GitHub Secrets for the CI/CD pipeline
- Add API Throttling - https://docs.nestjs.com/security/rate-limiting
- ...

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

## Prettier

This command should be used when you want to prettify your code

```bash
$ npm run format
```

## Prisma (ORM)

#### Before run Prisma

### Open new terminal execute below command

```bash
  mongod --port=27001 --dbpath=. --replSet=rs0
```

### Open another terminal window execute below command

```bash
  mongo.exe
```
### Then below command

```bash
  rs.initiate( {    _id : "rs0", members: [ { _id: 0, host: "localhost:27001" } ] })
```

### Push schema OR Update schema
```bash
# push schema or collection
$ npx prisma db push
```

### Generate Prisma Client 
```bash
# prisma-client
$ npx prisma generate
```

### Seeding Master Data

```bash
# seed
$ npm run prisma:seed
```

### Prisma IDE

```bash
# IDE for your database
$ npx prisma studio
```

## VSCode Debug Config (launch.json)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Nest Framework",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug", "--", "--inspect-brk"],
      "autoAttachChildProcesses": true,
      "restart": true,
      "sourceMaps": true,
      "stopOnEntry": false,
      "console": "integratedTerminal"
    }
  ]
}
```

## Using Docker for Production

- Make sure variable `DB_HOST` in `.env` file is set to `postgres`, as such:

```env
...
DB_HOST=postgres
...
```

- Run following command

```bash
# build docker image and run the container
$ docker compose up --build --detach

# seed db (only when DB is empty)
$ docker compose exec sikda-api npm run prisma:seed
```

## Access

Go to http://localhost:3000/api/v1

## Auth

This implementation uses `httpOnly` (server-side) cookie-based authentication. [Read more](https://dev.to/guillerbr/authentication-cookies-http-http-only-jwt-reactjs-context-api-and-node-on-backend-industry-structure-3f8e)

That means that the `JWT Token` is never stored on the client.
Usually it was stored in `localStorage` / `sesionStorage` / `cookies` (browser), but this is not secure.

Storing the token on a server side cookie is more secure, but it requires a small adjustment on frontend HTTP requests in order to work.

Frontend adjustments

- If you're using `axios` then you need to set: `withCredentials: true`. [Read more](https://flaviocopes.com/axios-credentials/)
- If you're using `fetch` then you need to set: `credentials: 'include'`. [Read more](https://github.com/github/fetch#sending-cookies)

## Code Style

Sync your IDE with project eslintrc.js.

Check `Run ESLint --fix on save`

## Stay in touch

- Author - [Igor Mardari](https://www.linkedin.com/in/igor-mardari-7code/) | [GarryOne](https://github.com/GarryOne)
- Website - [7code.ro](https://7code.ro/)
- Github - [@7codeRO](https://github.com/7codeRO/)

## License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
