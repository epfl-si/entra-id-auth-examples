# Authentication in a Dockerized Single-Page Application (SPA) with Vue.js

## Preparation of environment

```
cp .env.example .env
```
Complete the .env file by replacing the placeholders


## SSL certificate

Create SSL self-signed certificate and place dev-server.key and dev-server.crt files in certs directory


## Build application

```
sudo docker compose build --no-cache
```


## Start application

```
sudo docker compose up
```

## Stop application

```
sudo docker compose down --volumes
```

