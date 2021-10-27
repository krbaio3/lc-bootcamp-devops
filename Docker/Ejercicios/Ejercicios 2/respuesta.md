# Ejercicios

## Ejercicio 1

- Nos bajamos la imagen de 0gi0/galleryapp
- Revisamos el dockerfile donde está mapeando el workdir
- inspeccionamos la imagen que hemos bajado para ver donde mapea ("WorkingDir": "/usr/src/app")
- docker run -p 9000:8080 --mount source=images,target=/usr/src/app/images 0gis0/galleryapp
- Para copiar imágenes:
  - docker cp images/. practical_swirles:/usr/src/app/images
  - Desde el vsCode

## Ejercicio 2

## Ejercicio 3

```bash
docker run -p 7001:8080 --mount type=bind,source="/Users/krbaio3/Worker/LemonCode/devOps/lm-bootcaamp-devops/Docker/Ejercicios/Ejercicios 2/images",target=/usr/src/app/images 0gis0/galleryapp

> gallery-app@1.0.0 start /usr/src/app
> node server.js

Server running at http://127.0.0.1:8080/
5 files found
```
