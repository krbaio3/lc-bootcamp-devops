# Ejercicios

## Ejercicio 1

- Generamos el dockerfile con VSCode: nombre hello-lemoncoder y puerto 4000
- construimos la imagen desde el dockerfile: docker build -t hello-lemoncoder .
- levantamos el contenedor: docker run --rm -d --name lemon -p 4000:4000 hello-lemoncoder
- abrir navegador: localhost:4000
