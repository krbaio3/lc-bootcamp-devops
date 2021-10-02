# Linux Lab

Para poder ejecutar los scripts, hay que dar permisos de ejecución al archivo `lm` con este comando:

```bash
$ chmod +x lm
done!
```

Una vez hecho esto, se pueden ejecutar los ejercicios

## Ejercicios CLI

1. Crea mediante comandos de bash la siguiente jerarquía de ficheros y directorios.

```tree
    foo/
    ├─ dummy/
    │  ├─ file1.txt
    │  ├─ file2.txt
    ├─ empty/
```

Donde file1.txt debe contener el siguiente texto:

Me encanta la bash!!
Y file2.txt debe permanecer vacío.

**Respuesta**:

```bash
$ mkdir -p foo/dummy foo/empty && touch foo/dummy/file2.txt && echo -e 'Me encanta la bash!!' > foo/dummy/file1.txt
done!
```

2. Mediante comandos de bash, vuelca el contenido de file1.txt a file2.txt y mueve file2.txt a la carpeta empty.

El resultado de los comandos ejecutados sobre la jerarquía anterior deben dar el siguiente resultado.

```
foo/
├─ dummy/
│  ├─ file1.txt
├─ empty/
  ├─ file2.txt
```

Donde file1.txt y file2.txt deben contener el siguiente texto:

Me encanta la bash!!

**Respuesta:**

```bash
$ cat foo/dummy/file1.txt >> foo/dummy/file2.txt && mv foo/dummy/file2.txt foo/empty
done!
```

3. Crear un script de bash que agrupe los pasos de los ejercicios anteriores y además permita establecer el texto de file1.txt alimentándose como parámetro al invocarlo.

Si se le pasa un texto vacío al invocar el script, el texto de los ficheros, el texto por defecto será:

Que me gusta la bash!!!!

**Respuesta:**

Ejecutar script:

```bash
$ ./lm
done!
```

Improve:

Se ha hecho el mismo script pero "interactivo:

```bash
$ ./lm_improve
done!
```

1. Opcional - Crea un script de bash que descargue el conetenido de una página web a un fichero.

Una vez descargado el fichero, que busque en el mismo una palabra dada (esta se pasará por parametro) y muestre por pantalla el número de linea donde aparece.

grep "cadena_a_buscar" archivo

| wc -w
