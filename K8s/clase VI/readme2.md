# Estados de un Pod

- **Pending**: El pod esta **pendiente** de que se le asigne un nodo
  > Pods en este estado indican mala configuracion o falta de recursos
- **Complete**: Todos los contenedores del pod han terminado sin error
  > Ese estado solo se puede dar si spec.restaPolicy != Always
- **Error**: al menos un coneddore del pod ha terminado con error
  > Ese estado solo se puede dar si spec.restaPolicy != Always
- **Evicted**: el pod ha sido desalojado de un nodo
  > Ese estado indica falta de recursos

Pending --> Running{ - Complete - Error - Evicted
}

## Estados de contenedores

- Numero total de contenedores del pod
- Número de contenedores listos del pod. Listo(Ready) no es que este running.
- Numero de reinicios (sumando los de todos los contenedores) del pod

Kubernetes distingue entre contenedores ejecutandose, contenedores vivos y contenedores listos (running vs live vs ready)

El estado de runinng lo detenemina el motor de contenedores (ej docker): Un contenedor esta running

...
..

Contenedores Vivos:

- Un contenedor esta vivo si su proceso responde a las peticiones.
- Sirve para diferenciar el caso de que un contenedor esta corriendo pero su proceso no responde.
- Cuando un contenedor deja de estar vivo, el pod reinicia el contenedor.

Contenedores Listos:

- Un contenedor está listo si esta preparado para atender peticiones
- Sirve para diferenciar el caso de que un contenedore esta vivo pero no puede atender peticiones porque:
  - depende de un recurso externo
  - está en un estado que le impide atender peticiones

LivenessProbe

Pruebas para determinar en que estado está un contenedor. Son tareas sobre los contenedores que resuelven el estado del contenedor: - Una peticion get a una url expuesta por el contenedor - Abrir un socket contra un puerto - Ejecutar un comando en el contenedor que devuelva `exti(0)`

Si la levinessProbe falla, el pod reinicia el contenedor

readinessProbe

Pruebas para determinar en que estado está un contenedor. Son tareas sobre los contenedores que resuelven el estado del contenedor: - Una peticion get a una url expuesta por el contenedor - Abrir un socket contra un puerto - Ejecutar un comando en el contenedor que devuelva `exit(0)`

Si la readinessProbe falla, el pod es eliminado de todos los endpoints el contenedor
