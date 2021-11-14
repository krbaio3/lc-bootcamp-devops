# Lab

<!-- TOC -->

- [Lab](#lab)
  - [Ejercicio 1](#ejercicio-1)
    - [Respuesta Ejercicio 1](#respuesta-ejercicio-1)
  - [Ejercicio 2](#ejercicio-2)
    - [Respuesta Ejercicio 2](#respuesta-ejercicio-2)

<!-- /TOC -->

## Ejercicio 1

Dockeriza la aplicación dentro de lemoncode-challenge, la cual está compuesta de 3 partes:

    Un front-end con Node.js
    Un backend en .NET que utiliza un MongoDB para almacenar la información.
    El MongoDB donde se almacena la información en una base de.

Requisitos del ejercicio:

    Los tres componentes deben estar en una red llamada lemoncode-challenge.
    El backend debe comunicarse con el mongodb a través de esta URL mongodb://some-mongo:27017
    El front-end debe comunicarse con la api a través de http://topics-api:5000/api/topics
    El front-end debe estar mapeado con el host para ser accesible a través del puerto 8080.
    El MongoDB debe almacenar la información que va generando en un volumen, mapeado a la ruta /data/db.
    Este debe de tener una base de datos llamada TopicstoreDb con una colección llamada Topics. La colección Topics debe tener esta estructura: {"_id":{"$oid":"5fa2ca6abe7a379ec4234883"},"Name":"Contenedores"} ¡Añade varios registros!

### Respuesta Ejercicio 1

NOTA: Para .NET no sé (por desconocimiento de la tecnología) como cambiar la URL de mongo según una variable de entorno, por eso, el modificado la variable de `"ConnectionString": "mongodb://some-mongo:27017",` del fichero `appsettings.json`.

Desde la ruta `lm-bootcamp-devops/Docker/Lab`:

Creamos la nueva red donde se deben de desplegar todos los contenedores:

```bash
$ docker network create lemoncode-challenge
```

Creamos la carpeta donde queremos mapear el volumen:

```bash
$ mkdir db_data
```

Levantamos los contendores según las especificaciones:

**Mongo:**

```bash
$ docker run -dit --rm --network lemoncode-challenge --name some-mongo \
 -p 27017:27017 \
 --mount type=bind,source="$(pwd)"/db_data,target=/data/db \
 mongo
```

Copiamos el archivo `topics.json` al contenedor

```bash
$ docker cp topics.json some-mongo:/tmp/topics.json
```

Importamos la coleccion mongo:

```bash
$ docker exec some-mongo mongoimport --db=TopicstoreDb --collection=Topics --type=json --file=/tmp/topics.json
```

**Backend:**

```bash
$ docker run -dit --rm --network lemoncode-challenge --name topics-api \
-p 5000:5000 \
backend
```

**Frontend:**

```bash
$ docker run -dit --rm --network lemoncode-challenge --name frontend \
-p 3000:3000 \
frontend
```

**Final**

- Abrir el navegador e introducir la ruta: `http://localhost:3000/`.
- Saldrá el título de **Topics** en el navegador.
- Ir al archivo `lm-bootcamp-devops/Docker/Lab/backend/client.http` e ir lanzando a partir del comando 2.
- Refrescar el navegador

## Ejercicio 2

Ahora que ya tienes la aplicación del ejercicio 1 dockerizada, utiliza Docker Compose para lanzar todas las piezas a través de este. Debes plasmar todo lo necesario para que esta funcione como se espera: la red que utilizan, el volumen que necesita MongoDB, las variables de entorno, el puerto que expone la web y la API. Además debes indicar qué comandos utilizarías para levantar el entorno, pararlo y eliminarlo.

### Respuesta Ejercicio 2

En la ruta `lm-bootcamp-devops/Docker/Lab` tenemos el archivo `docker-compose.yml`. Desde esa ruta, podemos ejecutar los siguientes comandos

Para ejecutarlo (tenemos las imagenes anteriores):

```bash
$ docker-compose up -d
[+] Running 3/3
 ⠿ Container lab-some-mongo-1  Running                                                                                                                                                                                         0.0s
 ⠿ Container lab-frontend-1    Running                                                                                                                                                                                         0.0s
 ⠿ Container lab-topics-api-1  Running
```

Si queremos construir las imagenes previamente:

```bash
$ docker-compose up --build -d

[+] Building 0.8s (29/29) FINISHED
 => [frontend internal] load build definition from Dockerfile                                                                                                                                                                  0.0s
 => => transferring dockerfile: 32B                                                                                                                                                                                            0.0s
 => [frontend internal] load .dockerignore                                                                                                                                                                                     0.0s
 => => transferring context: 35B                                                                                                                                                                                               0.0s
 => [backend internal] load build definition from Dockerfile                                                                                                                                                                   0.0s
 => => transferring dockerfile: 32B                                                                                                                                                                                            0.0s
 => [frontend internal] load metadata for docker.io/library/node:14-alpine                                                                                                                                                     0.6s
 => [backend internal] load .dockerignore                                                                                                                                                                                      0.0s
 => => transferring context: 35B                                                                                                                                                                                               0.0s
 => [backend internal] load metadata for mcr.microsoft.com/dotnet/sdk:3.1-focal                                                                                                                                                0.4s
 => [backend internal] load metadata for mcr.microsoft.com/dotnet/aspnet:3.1-focal                                                                                                                                             0.3s
 => [backend build 1/7] FROM mcr.microsoft.com/dotnet/sdk:3.1-focal@sha256:8b038cd89244bdbf73d8d5bf1852b301052205d01d0713b08dd1d76ec04f40b7                                                                                    0.0s
 => [backend base 1/3] FROM mcr.microsoft.com/dotnet/aspnet:3.1-focal@sha256:834347476b25740ac8996fdd83ec6647801d0d59683b8fbeb005c5d2142e28dd                                                                                  0.0s
 => [backend internal] load build context                                                                                                                                                                                      0.0s
 => => transferring context: 9.01kB                                                                                                                                                                                            0.0s
 => CACHED [backend base 2/3] WORKDIR /app                                                                                                                                                                                     0.0s
 => CACHED [backend base 3/3] RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app                                                                                                              0.0s
 => CACHED [backend final 1/2] WORKDIR /app                                                                                                                                                                                    0.0s
 => CACHED [backend build 2/7] WORKDIR /src                                                                                                                                                                                    0.0s
 => CACHED [backend build 3/7] COPY [backend.csproj, ./]                                                                                                                                                                       0.0s
 => CACHED [backend build 4/7] RUN dotnet restore "backend.csproj"                                                                                                                                                             0.0s
 => CACHED [backend build 5/7] COPY . .                                                                                                                                                                                        0.0s
 => CACHED [backend build 6/7] WORKDIR /src/.                                                                                                                                                                                  0.0s
 => CACHED [backend build 7/7] RUN dotnet build "backend.csproj" -c Release -o /app/build                                                                                                                                      0.0s
 => CACHED [backend publish 1/1] RUN dotnet publish "backend.csproj" -c Release -o /app/publish                                                                                                                                0.0s
 => CACHED [backend final 2/2] COPY --from=publish /app/publish .                                                                                                                                                              0.0s
 => [frontend] exporting to image                                                                                                                                                                                              0.0s
 => => exporting layers                                                                                                                                                                                                        0.0s
 => => writing image sha256:97e43aa1ed1800831b17e8de4be0c0ba7c3db560cff07ec83caf87a1eb9bf212                                                                                                                                   0.0s
 => => naming to docker.io/library/backend                                                                                                                                                                                     0.0s
 => => writing image sha256:b2839173208413202eb72ee6f9669108cf53fac270a980847c9fad6cfe3dc071                                                                                                                                   0.0s
 => => naming to docker.io/library/frontend                                                                                                                                                                                    0.0s
 => [frontend 1/6] FROM docker.io/library/node:14-alpine@sha256:240e1e6ef6dfba3bb70d6e88cca6cbb0b5a6f3a2b4496ed7edc5474e8ed594bd                                                                                               0.0s
 => [frontend internal] load build context                                                                                                                                                                                     0.0s
 => => transferring context: 46.86kB                                                                                                                                                                                           0.0s
 => CACHED [frontend 2/6] WORKDIR /usr/src/app                                                                                                                                                                                 0.0s
 => CACHED [frontend 3/6] COPY [package.json, package-lock.json*, npm-shrinkwrap.json*, ./]                                                                                                                                    0.0s
 => CACHED [frontend 4/6] RUN npm install --production --silent && mv node_modules ../                                                                                                                                         0.0s
 => CACHED [frontend 5/6] COPY . .                                                                                                                                                                                             0.0s
 => CACHED [frontend 6/6] RUN chown -R node /usr/src/app                                                                                                                                                                       0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
[+] Running 4/4
 ⠿ Network lab_lemoncode-challenge  Created                                                                                                                                                                                    0.0s
 ⠿ Container lab-frontend-1         Started                                                                                                                                                                                    0.9s
 ⠿ Container lab-some-mongo-1       Started                                                                                                                                                                                    0.5s
 ⠿ Container lab-topics-api-1       Started
```

Para pararlo:

```bash
$ docker-compose down
[+] Stopping 3/3
 ⠿ Container lab-some-mongo-1  Stopping                                                                                                                                                                                         0.0s
 ⠿ Container lab-frontend-1    Stopping                                                                                                                                                                                         0.0s
 ⠿ Container lab-topics-api-1  Stopping
```

Para pararlo y eliminar los contenedores:

```bash
$ docker-compose down
[+] Running 4/4
 ⠿ Container lab-frontend-1         Removed                                                                                                                                                                                    0.2s
 ⠿ Container lab-topics-api-1       Removed                                                                                                                                                                                    0.2s
 ⠿ Container lab-some-mongo-1       Removed                                                                                                                                                                                    0.2s
 ⠿ Network lab_lemoncode-challenge  Removed
```
