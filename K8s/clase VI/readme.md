# Controladores Kubernetes

## jobs

- Un job crea un pod para ejecutar una tarea de un solo uso
- Se espeta que el pod termine en algun momento
- Puede crear varios pods

## jobs y paralelismo

- Un puede ejcutar la misma tarea varias veces.
- Cada pod se presupone que realiza la tarea una vez.
- **spec.completions** indica cuantos pods finalizados exitosamente debe haber para dar el job por terminado
- **spec.parallelism** indica cuantos pods pueden ejecutarse a ala vez por el job

## Cronjobs o Jobs programados

- Un cronjob es un controlador que crea jobs cada cierto tiempo.
- Un cron job crea jobs, no pods, los jobs creados por el cronjob creatan los pods
- En spec.jobTemplate se pone la plantilla del job a crear
- En spec.Schedule se pone la expresion cron que indica cuando crear el job

## Daemonsets

- Un daemonset garantiza que **cada nodo (o un subconjunto) ejecuten un pod determinado**
- Si se agregan nodos al clister, el daemonset se encargará que esos nodos también ejecuten el pod.
- Se usan para desplegar contenedores de infraestructura que ofrecen servicios a nivel de nodo
