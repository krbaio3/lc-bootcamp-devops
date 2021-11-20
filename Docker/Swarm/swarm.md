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

## Manger

Siempre hay un manager que es el leader. Cualquier peticion se redirige al Leader, y él ejecuta el comando donde toque.

## Balanceo de Carga en Docker Swarm

si hay varias replicas de un contenedor debes poder balancearlas. Docker Swarm sólo soporta dos: Ingress y Host

### Ingress

External Access via any node.

Hago una peticion a traves de un nodo1, pero la aplicacion que solicito no está en el nodo1, pero el cluster es lo suficientemente inteligente para redirigir al nodo2, y contestarte. Este modo, es el modo por defecto, lo que significa que cada vez que publiques un servicio on -p o --publish utilizará este método por defecto

## Keydown

```bash
▶ docker swarm init
Swarm initialized: current node (jy6r2vdm43y3ejrayegyp8wf2) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-52vkpwzocs7zxdo0blyr7k0e4lf9o2h2ifql7nu3fsf1fbjn4v-78g47z1wt3zi8rrss5qud811p 192.168.65.3:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

Salimos del cluster:

```bash
▶ docker swarm leave --force
Node left the swarm.
```
