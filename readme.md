# Users Crud Api TypeScript

A really simple CRUD GraphQL API based on Docker and TypeScript.

**Note:** In develop mode and running locally the docs are available at this [**url**](http://localhost:10046/graphql)

<br/>

## Project Commands

**Note:** Before running any of these commands be sure that your **CWD** is **users_crud_api_typescript** directory.

### Clean TypeScript Test Files Using Grep

```bash
RUN find . | grep -E "(/.spec.ts$|/.spec.js$)" | xargs rm -rf
```

### Install All TypeScript Dependencies

```bash
npm install
```

### Update The Depedencies With Ncu

**Note:** Before running this command you need to install the dev dependencies.

```bash
ncu -u
```

### Format The Code Using Prettier

**Note:** Before running this command you need to install the dev dependencies.

```bash
npm run format
```

### Lint The Code Using EsLinter

**Note:** Before running this command you need to install the dev dependencies.

```bash
npm run lint
```

### Run On Development Mode

```bash
ENVIRONMENT_MODE=development node dist/main.js
```

### Run On Testing Mode

```bash
ENVIRONMENT_MODE=testing node dist/main.js
```

### Run On Production Mode

```bash
ENVIRONMENT_MODE=production node dist/main.js
```

<br/>

## Docker Project Commands

**Note:** Before running any of these commands be sure that your **CWD** is **users_crud_api_typescript** directory.

### Docker App Building Without Cache

```bash
docker build --no-cache --tag ghcr.io/joseesco24/users_crud_api_typescript:latest .
```

### Docker App Building With Cache

```bash
docker build --tag ghcr.io/joseesco24/users_crud_api_typescript:latest .
```

### Docker App Deployment Without Detach

```bash
docker run --rm --name users_crud_api_typescript_app --publish 10046:10046 --env-file ./.env --env ENVIRONMENT_MODE=production ghcr.io/joseesco24/users_crud_api_typescript:latest
```

### Docker App Deployment With Detach

```bash
docker run --detach --rm --name users_crud_api_typescript_app --publish 10046:10046 --env-file ./.env --env ENVIRONMENT_MODE=production ghcr.io/joseesco24/users_crud_api_typescript:latest
```

### Docker Access To The Container Terminal

```bash
docker exec -it users_crud_api_typescript_app /bin/ash
```

### Docker Killing Containerized App

```bash
docker kill users_crud_api_typescript_app
```

### Docker Login Into Github Container Registry

```bash
docker login -u joseesco24 -p < authentication token > ghcr.io
```

### Docker Push The Image To Github Container Registry

```bash
docker push ghcr.io/joseesco24/users_crud_api_typescript:latest
```

### Docker Pull The Image From Github Container Registry

```bash
docker pull ghcr.io/joseesco24/users_crud_api_typescript:latest
```

<br/>

## Docker Compose Project Commands

**Note:** Before running any of these commands be sure that your **CWD** is **users_crud_api_typescript** directory.

### Docker Compose Build Image Using Compose File

```bash
docker-compose -f compose.build.yaml build
```

### Docker Compose Start Dbs Services Using Compose File

```bash
docker-compose -f compose.databases.yaml up
```

### Docker Compose Stop Dbs Services Using Compose File

```bash
docker-compose -f compose.databases.yaml down
```

### Docker Compose Start Project Using Compose File

```bash
docker-compose -f compose.project.yaml up
```

### Docker Compose Stop Project Using Compose File

```bash
docker-compose -f compose.project.yaml down
```

<br/>
