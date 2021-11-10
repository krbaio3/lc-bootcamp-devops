# Docker Swarm

- Agrupa uno o mas hosts de docker y te permite manejarlos en formato clúster
- Pueden ser servidores físicos, VMs, Raspberry Pi's o instancias en la nube
- Es una excelente opcion para despliegues en empresas pequeñas y medianas
- Compite directamente con K8s

## Cómo funciona

- Dos tipos de nodos: managers o workers
- Los managers solo se preocupan del estado del cluster, y los workers son los que despachan el trabajo de los managers
- Workers aceptan tareas de los managers y las ejecutan
- La configuracion y el estado de un Swarm se apoya en una base de datos distribuida llamada etcd, localizada en todos los managers
- La unidad minima de despliegue se llama servicio
