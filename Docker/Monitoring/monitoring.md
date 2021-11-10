# Monitoring

## Resumen

- Es importante saber el estado del sistema y el rendimiento de aplicaciones
- Para saber lo que ocurre con cada comando: `docker events`
- Para saber el rendimiento de mi contenedor: `docker stats`
- Para saber qué está consumiendo mi almacenamiento: `docker system df`
- Para saber qué ocurre en mi contenedor: `docker logs`
- Hay herramientas de terceros que explotan cada uno de los comandos anteriores

## Docker Events

- recupera eventos en tiempo real del servidor
- muestra diferentes tipos de eventos dependiendo del objeto
- Sólo devuelve los ultimos 1000, pero se puede filtrar el resultado

## Docker Logs

- Podemos ver la información que ha registrado un contenedor que se está ejecutando
- por defecto muestra la salida que apareceria si ejecutaramos el comando en un terminal
- existen diversas soluciones que se montan sobre esto para explotar los datos

## Docker Stats

- Metricas de contenedores
- por defecto, muestra CPU, memoria, red y disco
- existen diversas soluciones que se montan sobre estas métricas para explotar datos

### Docker Events

<p>En un terminal ejecutar:</p>
<code>docker events</code>
<p>Salida (después de hacer algunos comandos):</p>
<code>
    2021-10-31T18:18:53.670172339+01:00 image pull nginx:latest (maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>, name=nginx)
    2021-10-31T18:19:17.580426455+01:00 volume create data (driver=local)
    2021-10-31T18:20:02.486974551+01:00 volume prune  (reclaimed=180917891)
    2021-10-31T18:20:24.714545176+01:00 network connect dfb4a1441c5ffdfa417175890f808f6f4f97ca0762351574ec030c80d45de5ad (container=88ca99397f3548b957857cb20796f464dee7db194846bc7bc6ca4399500816bb, name=bridge, type=bridge)
    2021-10-31T18:20:24.722638020+01:00 volume mount 2f2ecd815b56495a73bda5d9554389853aaadb04f2f2e4c1e35fcb0308e9edc5 (container=88ca99397f3548b957857cb20796f464dee7db194846bc7bc6ca4399500816bb, destination=/data/configdb, driver=local, propagation=, read/write=true)
    2021-10-31T18:20:24.722805404+01:00 volume mount 593a1d54a68bcbfeec4667f499b4272869b535a36b54c64fc5ad880dd32710e8 (container=88ca99397f3548b957857cb20796f464dee7db194846bc7bc6ca4399500816bb, destination=/data/db, driver=local, propagation=, read/write=true)
    2021-10-31T18:20:24.963334749+01:00 container start 88ca99397f3548b957857cb20796f464dee7db194846bc7bc6ca4399500816bb (image=mongo, name=some-mongo)
</code>
<p>y en otro, hacer pruebas como hacer pull de alguna imagen, encender, apagar y borrar contenedores, etc.</p>
<code>docker run --name ping-service -d alpine ping docker.com</code>
<code>docker stats ping-service</code>
<p>salida:</p>
<code>
    CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT   MEM %     NET I/O           BLOCK I/O    PIDS
    3b6613e9aee8   ping-service   0.01%     372KiB / 1.938GiB   0.02%     1.38kB / 3.99kB   991kB / 0B   1
</code>
<p>El comando de a continuación no son tanto logs, nos proporciona todos los objetos que ocupan espacio en disco</p>
<code>docker system df</code>
<p>salida: </p>
<code>
    TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
    Images          16        14        2.034GB   520.4MB (25%)
    Containers      43        19        9.102kB   6.808kB (74%)
    Local Volumes   4         4         320MB     0B (0%)
    Build Cache     33        0         271MB     271MB
</code>
<p>Podemos exponer las metricas modificando la configuración del Docker engine.
Nuestra configuración original es:
</p>
<pre>
    {
        "experimental": false,
        "debug": true,
        "builder": {
            "gc": {
            "defaultKeepStorage": "20GB",
            "enabled": true
            }
        }
        }
</pre>
<p>la modificada es:</p>
<code>
    {
        "experimental": true,
        "metrics-addr": "127.0.0.1:9323",
        "debug": true,
        "builder": {
            "gc": {
            "defaultKeepStorage": "20GB",
            "enabled": true
            }
        }
        }
</code>
<p>ejecutamos un prometheus con un contendor docker</p>
<code>docker run --name prometheus-srv --mount type=bind,source="$(pwd)/Docker/prometheus-config.yml",target=/etc/prometheus/prometheus.yml -p 9090:9090 prom/prometheus</code>
<p>salida:</p>
<code>
    9090:9090 prom/prometheus
    Unable to find image 'prom/prometheus:latest' locally
    latest: Pulling from prom/prometheus
    aa2a8d90b84c: Pull complete
    b45d31ee2d7f: Pull complete
    7579d86a00c9: Pull complete
    8583d0bc7e17: Pull complete
    b32caf1c5e65: Pull complete
    e53f205885a2: Pull complete
    6366df248f46: Pull complete
    a63db3af7b6e: Pull complete
    94cd9f02fa61: Pull complete
    2511fa13a76c: Pull complete
    50c2584d9f31: Pull complete
    22749d939f03: Pull complete
    Digest: sha256:e9620d250b16ffe0eb9e3eac7dd76151848424c17d577632ae9ca61d1328687e
    Status: Downloaded newer image for prom/prometheus:latest
    level=info ts=2021-10-31T17:50:44.295Z caller=main.go:400 msg="No time or size retention was set so using the default time retention" duration=15d
    level=info ts=2021-10-31T17:50:44.295Z caller=main.go:438 msg="Starting Prometheus" version="(version=2.30.3, branch=HEAD, revision=f29caccc42557f6a8ec30ea9b3c8c089391bd5df)"
    level=info ts=2021-10-31T17:50:44.295Z caller=main.go:443 build_context="(go=go1.17.1, user=root@5cff4265f0e3, date=20211005-16:10:52)"
    level=info ts=2021-10-31T17:50:44.295Z caller=main.go:444 host_details="(Linux 5.10.47-linuxkit #1 SMP Sat Jul 3 21:51:47 UTC 2021 x86_64 030410c7c53b (none))"
    level=info ts=2021-10-31T17:50:44.295Z caller=main.go:445 fd_limits="(soft=1048576, hard=1048576)"
    level=info ts=2021-10-31T17:50:44.295Z caller=main.go:446 vm_limits="(soft=unlimited, hard=unlimited)"
    level=info ts=2021-10-31T17:50:44.297Z caller=web.go:541 component=web msg="Start listening for connections" address=0.0.0.0:9090
    level=info ts=2021-10-31T17:50:44.298Z caller=main.go:822 msg="Starting TSDB ..."
    level=info ts=2021-10-31T17:50:44.299Z caller=tls_config.go:191 component=web msg="TLS is disabled." http2=false
    level=info ts=2021-10-31T17:50:44.302Z caller=head.go:479 component=tsdb msg="Replaying on-disk memory mappable chunks if any"
    level=info ts=2021-10-31T17:50:44.302Z caller=head.go:513 component=tsdb msg="On-disk memory mappable chunks replay completed" duration=1.97µs
    level=info ts=2021-10-31T17:50:44.302Z caller=head.go:519 component=tsdb msg="Replaying WAL, this may take a while"
    level=info ts=2021-10-31T17:50:44.303Z caller=head.go:590 component=tsdb msg="WAL segment loaded" segment=0 maxSegment=0
    level=info ts=2021-10-31T17:50:44.303Z caller=head.go:596 component=tsdb msg="WAL replay completed" checkpoint_replay_duration=30.98µs wal_replay_duration=356.461µs total_replay_duration=405.706µs
    level=info ts=2021-10-31T17:50:44.304Z caller=main.go:849 fs_type=EXT4_SUPER_MAGIC
    level=info ts=2021-10-31T17:50:44.304Z caller=main.go:852 msg="TSDB started"
    level=info ts=2021-10-31T17:50:44.304Z caller=main.go:979 msg="Loading configuration file" filename=/etc/prometheus/prometheus.yml
    level=info ts=2021-10-31T17:50:44.306Z caller=main.go:1016 msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml totalDuration=2.244835ms db_storage=6.498µs remote_storage=1.614µs web_handler=645ns query_engine=1.355µs scrape=560.915µs scrape_sd=61.747µs notify=858ns notify_sd=2.059µs rules=1.476µs
    level=info ts=2021-10-31T17:50:44.306Z caller=main.go:794 msg="Server is ready to receive web requests."
</code>
<p>Levantamos en otra consola un contenedor que haga ping a google, por ejemplo (para ver mejor los datos, ejecutar varios contenedores)</p>
<code>docker run -d alpine ping google.es</code>
<p>Accedemos a la url localhost:9090, para ver la interface de prometheus</p>
<p>Un ejemplo con <a href="https://www.fluentd.org">Fluentd</a></p>
<code>docker run -it -p 24224:24224 -v "$(pwd)"/Docker/in_docker.conf:/fluentd/etc/test.conf -e FLUENTD_CONF=test.conf fluent/fluentd</code>
<p>En otro terminal, ejecutamos un contenedor nginx macheando el puerto de los logs al de fluentD</p>
<code>docker run --rm -p 2020:80 --log-driver=fluentd nginx</code>
<p>Salida</p>
<code>/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
    /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
    /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
    10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
    10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
    /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
    /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
    /docker-entrypoint.sh: Configuration complete; ready for start up
    2021/10/31 18:10:03 [notice] 1#1: using the "epoll" event method
    2021/10/31 18:10:03 [notice] 1#1: nginx/1.21.3
    2021/10/31 18:10:03 [notice] 1#1: built by gcc 8.3.0 (Debian 8.3.0-6)
    2021/10/31 18:10:03 [notice] 1#1: OS: Linux 5.10.47-linuxkit
    2021/10/31 18:10:03 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
    2021/10/31 18:10:03 [notice] 1#1: start worker processes
    2021/10/31 18:10:03 [notice] 1#1: start worker process 31
    2021/10/31 18:10:03 [notice] 1#1: start worker process 32
    2021/10/31 18:10:03 [notice] 1#1: start worker process 33
    2021/10/31 18:10:03 [notice] 1#1: start worker process 34
    2021/10/31 18:10:03 [notice] 1#1: start worker process 35
    2021/10/31 18:10:03 [notice] 1#1: start worker process 36
    2021/10/31 18:10:03 [notice] 1#1: start worker process 37
    2021/10/31 18:10:03 [notice] 1#1: start worker process 38
</code>
<p>Otra herramienta que hay es <a href="https://www.portainer.io/solutions/docker">portainer</a> y su <a href="https://docs.portainer.io/v/ce-2.9/start/install/server/docker/linux">documentación</a>
</p>
<code>docker run -d -p 8000:8000 -p 9443:9443 --p 9000:9000 --name portainer \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:latest
</code>
