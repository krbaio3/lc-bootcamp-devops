# Networking

## Switching and Routing

Docker ejecuta tus aplicaciones dentro de contenedores de manera aislada

tiene una manera muy sencilla de lidiar con diferentes escenarios desde el pto de vista del networking

Está basado en una arquitectura llamada Container Network Model (CNM)

## Resumen

- Docker se encarga de todo el networking por ti
- Existen cuatro tipos de caja: none, host, bridge y overlay
- None cuando no quieres que tu ordenador hable con nadie
- Host cuando quieres deshabilitar el aislamiento entre el host y el contenedor
- Bridge para conectarse con otros contenedores dentro de la misma red
- Overlay cuando trabajamos en modo cluster y necesitas extender la red entre los nodos

## Comandos

- docker network ls: listar todas las redes
- docker network create: crear una nueva red
- docker network inspect: detalle de configuracion de una red
- docker network rm: borrar una red
- docker network prune: eliminar todas las redes que estén en desuso del host

## Redes de Docker

- None: no se asigna ninguna tarjeta de red y no se comunica con nadie
- Host: asociamos el contenedor a la red asociada al host (se rompe ese aislamiento). Se utiliza sobre todo en escenarios de alto rendimiento.
- Bridge: Crea una red privada que se conecta el host y los contenedores que invitemos a conectarse. Por defecto, se utiliza este tipo de red.
  - Bridge y portMapping: Desde dentro del host se puede acceder a los contenedores, pero desde fuera, no deja.
  - Mapping de un puerto del host con el contendedor: curl a la ip del host, llegaría al bridge del host y lo reenvia a nuestro contenedor.
- MACVLAN: podemos hacer que nuestros contenedores se adquieran directamente a una ip en la red existente fuera de Docker

## Descubrimiento de Servicios

Service Discovery permite que todos los contenedores dentro de una misma red, creada esa red por mi, puedan comunicarse
Esto es posible por el servidor DNS integrado en Docker

## KeyDown

`docker network ls`

`docker network inspect bridge `
[
{
"Name": "bridge",
"Id": "ff467dbfa1c1d2e04a146db7653d3ac6760afc67613362861894267f1ee32d49",
"Created": "2021-10-31T17:43:53.927094951Z",
"Scope": "local",
"Driver": "bridge",
"EnableIPv6": false,
"IPAM": {
"Driver": "default",
"Options": null,
"Config": [
{
"Subnet": "172.17.0.0/16",
"Gateway": "172.17.0.1"
}
]
},
"Internal": false,
"Attachable": false,
"Ingress": false,
"ConfigFrom": {
"Network": ""
},
"ConfigOnly": false,
"Containers": {},
"Options": {
"com.docker.network.bridge.default_bridge": "true",
"com.docker.network.bridge.enable_icc": "true",
"com.docker.network.bridge.enable_ip_masquerade": "true",
"com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
"com.docker.network.bridge.name": "docker0",
"com.docker.network.driver.mtu": "1500"
},
"Labels": {}
}
]

▶ docker run -d --name web nginx  
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
b380bbd43752: Pull complete
fca7e12d1754: Pull complete
745ab57616cb: Pull complete
a4723e260b6f: Pull complete
1c84ebdff681: Pull complete
858292fd2e56: Pull complete
Digest: sha256:644a70516a26004c97d0d85c7fe1d0c3a67ea8ab7ddf4aff193d9f301670cf36
Status: Downloaded newer image for nginx:latest
d6f87d4adf613ac17e62340f8b322b9fc51504ea48cff97de176b93ed9389b6d

docker network inspect bridge
[
{
"Name": "bridge",
"Id": "ff467dbfa1c1d2e04a146db7653d3ac6760afc67613362861894267f1ee32d49",
"Created": "2021-10-31T17:43:53.927094951Z",
"Scope": "local",
"Driver": "bridge",
"EnableIPv6": false,
"IPAM": {
"Driver": "default",
"Options": null,
"Config": [
{
"Subnet": "172.17.0.0/16",
"Gateway": "172.17.0.1"
}
]
},
"Internal": false,
"Attachable": false,
"Ingress": false,
"ConfigFrom": {
"Network": ""
},
"ConfigOnly": false,
"Containers": {
"d6f87d4adf613ac17e62340f8b322b9fc51504ea48cff97de176b93ed9389b6d": {
"Name": "web",
"EndpointID": "e1b99715c554fa47389aef54a943f54cabc38808200febdad6a79fab74e31c03",
"MacAddress": "02:42:ac:11:00:02",
"IPv4Address": "172.17.0.2/16",
"IPv6Address": ""
}
},
"Options": {
"com.docker.network.bridge.default_bridge": "true",
"com.docker.network.bridge.enable_icc": "true",
"com.docker.network.bridge.enable_ip_masquerade": "true",
"com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
"com.docker.network.bridge.name": "docker0",
"com.docker.network.driver.mtu": "1500"
},
"Labels": {}
}
]

docker run -d --name web-apache httpd
Unable to find image 'httpd:latest' locally
latest: Pulling from library/httpd
7d63c13d9b9b: Pull complete
ca52f3eeea66: Pull complete
448256567156: Pull complete
21d69ac90caf: Pull complete
462e88bc3074: Pull complete
Digest: sha256:f70876d78442771406d7245b8d3425e8b0a86891c79811af94fb2e12af0fadeb
Status: Downloaded newer image for httpd:latest
36cd9ef8642095dbaa149cb34313c7e544dc7f3c7a6ab9d0e442ec24b4f5c1c9

docker network inspect bridge  
[
{
"Name": "bridge",
"Id": "ff467dbfa1c1d2e04a146db7653d3ac6760afc67613362861894267f1ee32d49",
"Created": "2021-10-31T17:43:53.927094951Z",
"Scope": "local",
"Driver": "bridge",
"EnableIPv6": false,
"IPAM": {
"Driver": "default",
"Options": null,
"Config": [
{
"Subnet": "172.17.0.0/16",
"Gateway": "172.17.0.1"
}
]
},
"Internal": false,
"Attachable": false,
"Ingress": false,
"ConfigFrom": {
"Network": ""
},
"ConfigOnly": false,
"Containers": {
"36cd9ef8642095dbaa149cb34313c7e544dc7f3c7a6ab9d0e442ec24b4f5c1c9": {
"Name": "web-apache",
"EndpointID": "f00caf01eb64c311e6d7726548e32dba6fa6ad70f406c49c6b7d2f23f7888a21",
"MacAddress": "02:42:ac:11:00:03",
"IPv4Address": "172.17.0.3/16",
"IPv6Address": ""
},
"d6f87d4adf613ac17e62340f8b322b9fc51504ea48cff97de176b93ed9389b6d": {
"Name": "web",
"EndpointID": "e1b99715c554fa47389aef54a943f54cabc38808200febdad6a79fab74e31c03",
"MacAddress": "02:42:ac:11:00:02",
"IPv4Address": "172.17.0.2/16",
"IPv6Address": ""
}
},
"Options": {
"com.docker.network.bridge.default_bridge": "true",
"com.docker.network.bridge.enable_icc": "true",
"com.docker.network.bridge.enable_ip_masquerade": "true",
"com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
"com.docker.network.bridge.name": "docker0",
"com.docker.network.driver.mtu": "1500"
},
"Labels": {}
}
]

Ambos contenedores comparten red, y deberían de ser capaz de hablar entre ellos

Nos conectamos al primero:
`docker exec -it web /bin/bash`

instalamos unos paquetes que nos van a hacer falta para redes (net-tools iputils-ping)

```bash
root@d6f87d4adf61:/# apt update && apt -y install net-tools iputils-ping
Hit:1 http://security.debian.org/debian-security buster/updates InRelease
Hit:2 http://deb.debian.org/debian buster InRelease
Hit:3 http://deb.debian.org/debian buster-updates InRelease
Reading package lists... Done
Building dependency tree
Reading state information... Done
2 packages can be upgraded. Run 'apt list --upgradable' to see them.
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
  libcap2 libcap2-bin libpam-cap
The following NEW packages will be installed:
  iputils-ping libcap2 libcap2-bin libpam-cap net-tools
0 upgraded, 5 newly installed, 0 to remove and 2 not upgraded.
Need to get 352 kB of archives.
After this operation, 1322 kB of additional disk space will be used.
Get:1 http://deb.debian.org/debian buster/main amd64 libcap2 amd64 1:2.25-2 [17.6 kB]
Get:2 http://deb.debian.org/debian buster/main amd64 iputils-ping amd64 3:20180629-2+deb10u2 [43.4 kB]
Get:3 http://deb.debian.org/debian buster/main amd64 libcap2-bin amd64 1:2.25-2 [28.8 kB]
Get:4 http://deb.debian.org/debian buster/main amd64 libpam-cap amd64 1:2.25-2 [14.3 kB]
Get:5 http://deb.debian.org/debian buster/main amd64 net-tools amd64 1.60+git20180626.aebd88e-1 [248 kB]
Fetched 352 kB in 0s (1786 kB/s)
debconf: delaying package configuration, since apt-utils is not installed
Selecting previously unselected package libcap2:amd64.
(Reading database ... 7638 files and directories currently installed.)
Preparing to unpack .../libcap2_1%3a2.25-2_amd64.deb ...
Unpacking libcap2:amd64 (1:2.25-2) ...
Selecting previously unselected package iputils-ping.
Preparing to unpack .../iputils-ping_3%3a20180629-2+deb10u2_amd64.deb ...
Unpacking iputils-ping (3:20180629-2+deb10u2) ...
Selecting previously unselected package libcap2-bin.
Preparing to unpack .../libcap2-bin_1%3a2.25-2_amd64.deb ...
Unpacking libcap2-bin (1:2.25-2) ...
Selecting previously unselected package libpam-cap:amd64.
Preparing to unpack .../libpam-cap_1%3a2.25-2_amd64.deb ...
Unpacking libpam-cap:amd64 (1:2.25-2) ...
Selecting previously unselected package net-tools.
Preparing to unpack .../net-tools_1.60+git20180626.aebd88e-1_amd64.deb ...
Unpacking net-tools (1.60+git20180626.aebd88e-1) ...
Setting up net-tools (1.60+git20180626.aebd88e-1) ...
Setting up libcap2:amd64 (1:2.25-2) ...
Setting up libcap2-bin (1:2.25-2) ...
Setting up libpam-cap:amd64 (1:2.25-2) ...
debconf: unable to initialize frontend: Dialog
debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share/perl5/Debconf/FrontEnd/Dialog.pm line 78.)
debconf: falling back to frontend: Readline
debconf: unable to initialize frontend: Readline
debconf: (Can't locate Term/ReadLine.pm in @INC (you may need to install the Term::ReadLine module) (@INC contains: /etc/perl /usr/local/lib/x86_64-linux-gnu/perl/5.28.1 /usr/local/share/perl/5.28.1 /usr/lib/x86_64-linux-gnu/perl5/5.28 /usr/share/perl5 /usr/lib/x86_64-linux-gnu/perl/5.28 /usr/share/perl/5.28 /usr/local/lib/site_perl /usr/lib/x86_64-linux-gnu/perl-base) at /usr/share/perl5/Debconf/FrontEnd/Readline.pm line 7.)
debconf: falling back to frontend: Teletype
Setting up iputils-ping (3:20180629-2+deb10u2) ...
Processing triggers for libc-bin (2.28-10) ...
root@d6f87d4adf61:/#
```

Tenemos dos interfaces, la eth0 tiene la misma ip que hemos visto al principio, y la LoopBack que siempre va a existir porque va a ser para hablar conmigo mismo

```bash
root@d6f87d4adf61:/# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)
        RX packets 6653  bytes 9727610 (9.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2453  bytes 135648 (132.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

root@d6f87d4adf61:/#
```

Hacemos un Ping al otro contenedor que tiene la ip (que hemos visto al principio tambien) de 172.17.0.3

```bash
root@d6f87d4adf61:/# ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3) 56(84) bytes of data.
64 bytes from 172.17.0.3: icmp_seq=1 ttl=64 time=0.126 ms
64 bytes from 172.17.0.3: icmp_seq=2 ttl=64 time=0.086 ms
64 bytes from 172.17.0.3: icmp_seq=3 ttl=64 time=0.081 ms
64 bytes from 172.17.0.3: icmp_seq=4 ttl=64 time=0.070 ms
```

Existe la posibilidad de resolver los nombres dentro de la misma red. Debería de poder comunicarse con ese nombre dentro de la misma red, pero funciona en redes que hayamos creado por defecto.

```bash
root@d6f87d4adf61:/# ping web-apache
ping: web-apache: Name or service not known
```

### Crear una red en Docker

```bash
docker network create lemoncode--net
3ef095281d39b182776b197787efe37b06a3fda7bd9bd539191287d72a0de1f1
```

Verificacion

```bash
 docker network ls
NETWORK ID     NAME                       DRIVER    SCOPE
830c7d7cf509   00-backend-start_default   bridge    local
d99c41e598a7   03-webserver_default       bridge    local
ff467dbfa1c1   bridge                     bridge    local
a8eabaa1c29e   host                       host      local
3ef095281d39   lemoncode--net             bridge    local
97ac3f4a856c   minikube                   bridge    local
08640353a3f7   none                       null      local
4c770a79c7a4   verdaccio_default          bridge    local
```

Inspeccion de red:

```bash
docker network inspect lemoncode--net
[
    {
        "Name": "lemoncode--net",
        "Id": "3ef095281d39b182776b197787efe37b06a3fda7bd9bd539191287d72a0de1f1",
        "Created": "2021-11-02T11:41:45.7234239Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.21.0.0/16",
                    "Gateway": "172.21.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {},
        "Labels": {}
    }
]
```

Asociamos un contenedor a una red:

```bash
docker run -d --name web2 --network lemoncode--net nginx
5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc
```

volvemos a inspeccionar esta nueva red:

```bash
docker network inspect lemoncode--net
[
    {
        "Name": "lemoncode--net",
        "Id": "3ef095281d39b182776b197787efe37b06a3fda7bd9bd539191287d72a0de1f1",
        "Created": "2021-11-02T11:41:45.7234239Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.21.0.0/16",
                    "Gateway": "172.21.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc": {
                "Name": "web2",
                "EndpointID": "a2c5dbb01620eec4a112bda5f0817d3563ea28b37ded083bd637a2ebbb4b7c1f",
                "MacAddress": "02:42:ac:15:00:02",
                "IPv4Address": "172.21.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

Y vemos que ya tenemos un contenedor para esta red (172.21.0.2/16)

Ahora, nos atachamos al contenedor, e instalamos las mismas herramientas que antes:

```bash
docker exec -it 5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc bash
root@5d3e94c611d5:/# apt update && apt upgrade -y && apt -y install net-tools iputils-ping
root@5d3e94c611d5:/# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.21.0.2  netmask 255.255.0.0  broadcast 172.21.255.255
        ether 02:42:ac:15:00:02  txqueuelen 0  (Ethernet)
        RX packets 6660  bytes 9727070 (9.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2423  bytes 133325 (130.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 10  bytes 910 (910.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 10  bytes 910 (910.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```

Nos creamos un contenedor dentro de esta nueva red:

```bash
docker run -d --name web-apache2 --network lemoncode--net httpd
b6f1b9b903a3dbacc36c04920e66d57d0fb46f4baeaf6db9e79891f3f17097fc
```

Inspeccionamos:

```bash
docker network inspect lemoncode--net
[
    {
        "Name": "lemoncode--net",
        "Id": "3ef095281d39b182776b197787efe37b06a3fda7bd9bd539191287d72a0de1f1",
        "Created": "2021-11-02T11:41:45.7234239Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.21.0.0/16",
                    "Gateway": "172.21.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc": {
                "Name": "web2",
                "EndpointID": "a2c5dbb01620eec4a112bda5f0817d3563ea28b37ded083bd637a2ebbb4b7c1f",
                "MacAddress": "02:42:ac:15:00:02",
                "IPv4Address": "172.21.0.2/16",
                "IPv6Address": ""
            },
            "b6f1b9b903a3dbacc36c04920e66d57d0fb46f4baeaf6db9e79891f3f17097fc": {
                "Name": "web-apache2",
                "EndpointID": "0e78457a66b6cb2c42b32113f52651317116ca77d8ee61ad3b4b42c2c9fac205",
                "MacAddress": "02:42:ac:15:00:03",
                "IPv4Address": "172.21.0.3/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

Hacemos ping desde el contenedor (lo hacemos desde web2 para no tener que instalar las herramientas de nuevo):

```bash
docker exec -it 5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc bash
root@5d3e94c611d5:/# ping 172.21.0.3
PING 172.21.0.3 (172.21.0.3) 56(84) bytes of data.
64 bytes from 172.21.0.3: icmp_seq=1 ttl=64 time=0.141 ms
64 bytes from 172.21.0.3: icmp_seq=2 ttl=64 time=0.085 ms
64 bytes from 172.21.0.3: icmp_seq=3 ttl=64 time=0.076 ms
64 bytes from 172.21.0.3: icmp_seq=4 ttl=64 time=0.123 ms
^C
--- 172.21.0.3 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 111ms
rtt min/avg/max/mdev = 0.076/0.106/0.141/0.027 ms
```

Ahora, como hemos creado nosotros la red, sí podemos utilizar la resolución de nombres:

```bash
root@5d3e94c611d5:/# ping web-apache2
PING web-apache2 (172.21.0.3) 56(84) bytes of data.
64 bytes from web-apache2.lemoncode--net (172.21.0.3): icmp_seq=1 ttl=64 time=0.071 ms
64 bytes from web-apache2.lemoncode--net (172.21.0.3): icmp_seq=2 ttl=64 time=0.100 ms
64 bytes from web-apache2.lemoncode--net (172.21.0.3): icmp_seq=3 ttl=64 time=0.128 ms
^C
--- web-apache2 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 45ms
rtt min/avg/max/mdev = 0.071/0.099/0.128/0.025 ms
root@5d3e94c611d5:/#
root@5d3e94c611d5:/# curl http://web-apache2
<html><body><h1>It works!</h1></body></html>
```

### Conectar un contenedor a dos redes

Podemos hacerlo, pero para ello, lo tenemos que hacer en dos pasos:

`docker network connect bridge web2`

```bash
docker network inspect bridge
[
    {
        "Name": "bridge",
        "Id": "ff467dbfa1c1d2e04a146db7653d3ac6760afc67613362861894267f1ee32d49",
        "Created": "2021-10-31T17:43:53.927094951Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "36cd9ef8642095dbaa149cb34313c7e544dc7f3c7a6ab9d0e442ec24b4f5c1c9": {
                "Name": "web-apache",
                "EndpointID": "f00caf01eb64c311e6d7726548e32dba6fa6ad70f406c49c6b7d2f23f7888a21",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
            "5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc": {
                "Name": "web2", // <===
                "EndpointID": "e15c665c27c2e41df3cad0cff0be8132755f5283ae82db27f68507f49e390c0e",
                "MacAddress": "02:42:ac:11:00:04",
                "IPv4Address": "172.17.0.4/16",
                "IPv6Address": ""
            },
            "d6f87d4adf613ac17e62340f8b322b9fc51504ea48cff97de176b93ed9389b6d": {
                "Name": "web",
                "EndpointID": "e1b99715c554fa47389aef54a943f54cabc38808200febdad6a79fab74e31c03",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
```

```bash
docker network inspect lemoncode--net
[
    {
        "Name": "lemoncode--net",
        "Id": "3ef095281d39b182776b197787efe37b06a3fda7bd9bd539191287d72a0de1f1",
        "Created": "2021-11-02T11:41:45.7234239Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.21.0.0/16",
                    "Gateway": "172.21.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc": {
                "Name": "web2", // <====
                "EndpointID": "a2c5dbb01620eec4a112bda5f0817d3563ea28b37ded083bd637a2ebbb4b7c1f",
                "MacAddress": "02:42:ac:15:00:02",
                "IPv4Address": "172.21.0.2/16",
                "IPv6Address": ""
            },
            "b6f1b9b903a3dbacc36c04920e66d57d0fb46f4baeaf6db9e79891f3f17097fc": {
                "Name": "web-apache2",
                "EndpointID": "0e78457a66b6cb2c42b32113f52651317116ca77d8ee61ad3b4b42c2c9fac205",
                "MacAddress": "02:42:ac:15:00:03",
                "IPv4Address": "172.21.0.3/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

Nos metemos dentro del contenedor web2( que tenemos todo instalado), y hacemos un ifconfig:

```bash
docker exec -it 5d3e94c611d5c80c1f8768da0537c3afc8c284807e0a8858535ef1a4495d88dc bash
root@5d3e94c611d5:/# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.21.0.2  netmask 255.255.0.0  broadcast 172.21.255.255
        ether 02:42:ac:15:00:02  txqueuelen 0  (Ethernet)
        RX packets 6682  bytes 9728816 (9.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2465  bytes 136884 (133.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.4  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:04  txqueuelen 0  (Ethernet)
        RX packets 11  bytes 866 (866.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 20  bytes 1621 (1.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 20  bytes 1621 (1.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

root@5d3e94c611d5:/# ping 172.17.0.2
PING 172.17.0.2 (172.17.0.2) 56(84) bytes of data.
64 bytes from 172.17.0.2: icmp_seq=1 ttl=64 time=0.171 ms
64 bytes from 172.17.0.2: icmp_seq=2 ttl=64 time=0.186 ms
64 bytes from 172.17.0.2: icmp_seq=3 ttl=64 time=0.169 ms
64 bytes from 172.17.0.2: icmp_seq=4 ttl=64 time=0.182 ms
root@5d3e94c611d5:/# ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3) 56(84) bytes of data.
64 bytes from 172.17.0.3: icmp_seq=1 ttl=64 time=0.111 ms
64 bytes from 172.17.0.3: icmp_seq=2 ttl=64 time=0.089 ms
```

---

Con el dockerfile de nginx y la exposición de puertos, construimos la imagen:

```bash
docker build -t nginx-custom .
```

```bash
docker inspect nginx-custom
[
    {
        "Id": "sha256:09463fc78d0eea85e54fd804f0e3f02ea8e67acd7b387f71e5a03c06744064bd",
        "RepoTags": [
            "nginx-custom:latest"
        ],
        "RepoDigests": [],
        "Parent": "",
        "Comment": "buildkit.dockerfile.v0",
        "Created": "2021-10-12T02:03:40.360294686Z",
        "Container": "",
        "ContainerConfig": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": null,
            "Cmd": null,
            "Image": "",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": null
        },
        "DockerVersion": "",
        "Author": "",
        "Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "3000/tcp": {},
                "4000/tcp": {},
                "5000/tcp": {},
                "80/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NGINX_VERSION=1.21.3",
                "NJS_VERSION=0.6.2",
                "PKG_RELEASE=1~buster"
            ],
            "Cmd": [
                "nginx",
                "-g",
                "daemon off;"
            ],
            "Image": "",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": [
                "/docker-entrypoint.sh"
            ],
            "OnBuild": null,
            "Labels": {
                "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
            },
            "StopSignal": "SIGQUIT"
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 133277153,
        "VirtualSize": 133277153,
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/7b71316cfc8a029a158f9232a422198b0a0445b1a56127eb600db3a48119ba6f/diff:/var/lib/docker/overlay2/e4ecdb8cc5725fa4933b23375a7f9a0c86047628e0a384dbe81d25ad76eb7bea/diff:/var/lib/docker/overlay2/50562e0214b0cb0345ba5327c2719b6051843afc575b8480fdb72257ea4d7081/diff:/var/lib/docker/overlay2/f07c346e780cf38eba0b84214fc28661636dca4a384fa180ceb4755e2d797fc2/diff:/var/lib/docker/overlay2/e9e90a6ab5f9865df4b4d87d32ff22cc14858c880d1a39d7be13d6e328eb1572/diff",
                "MergedDir": "/var/lib/docker/overlay2/d290ddc0391087661eac8a703faf5be31cb77ad9ab5b8e09f68eab3c807b3cb1/merged",
                "UpperDir": "/var/lib/docker/overlay2/d290ddc0391087661eac8a703faf5be31cb77ad9ab5b8e09f68eab3c807b3cb1/diff",
                "WorkDir": "/var/lib/docker/overlay2/d290ddc0391087661eac8a703faf5be31cb77ad9ab5b8e09f68eab3c807b3cb1/work"
            },
            "Name": "overlay2"
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:e81bff2725dbc0bf2003db10272fef362e882eb96353055778a66cda430cf81b",
                "sha256:43f4e41372e42dd32309f6a7bdce03cf2d65b3ca34b1036be946d53c35b503ab",
                "sha256:788e89a4d186f3614bfa74254524bc2e2c6de103698aeb1cb044f8e8339a90bd",
                "sha256:f8e880dfc4ef19e78853c3f132166a4760a220c5ad15b9ee03b22da9c490ae3b",
                "sha256:f7e00b807643e512b85ef8c9f5244667c337c314fa29572206c1b0f3ae7bf122",
                "sha256:9959a332cf6e41253a9cd0c715fa74b01db1621b4d16f98f4155a2ed5365da4a"
            ]
        },
        "Metadata": {
            "LastTagTime": "2021-11-02T12:28:37.8747995Z"
        }
    }
]
```

con este comando, podemos decirle a Docker que exponga todos los puertos que estén especificados en el ExposedPorts:

```bash
docker run -d --publish-all nginx-custom
```

Si hacemos un `docker ps` podemos ver en la info todos los puertos que tiene:

```bash
$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                                                                                              NAMES
bae6f2959764   nginx-custom   "/docker-entrypoint.…"   35 seconds ago   Up 35 seconds   0.0.0.0:55003->80/tcp, 0.0.0.0:55002->3000/tcp, 0.0.0.0:55001->4000/tcp, 0.0.0.0:55000->5000/tcp   lucid_borg
```

O, tambien podemos ejecutar este comando:

```bash
$ docker port bae6f2959764
5000/tcp -> 0.0.0.0:55000
80/tcp -> 0.0.0.0:55003
3000/tcp -> 0.0.0.0:55002
4000/tcp -> 0.0.0.0:55001
```

### Con la red none

```bash
docker run -d --name no-red --network none nginx
ba812bbf4fa0f8c127981cf0d72ae343f98b338eada634e669a9485c655af77a
docker network inspect none
[
    {
        "Name": "none",
        "Id": "08640353a3f7f21820e4354817f70387b228fb8a26445b6a50ecb65832a77a47",
        "Created": "2020-09-26T16:00:45.897942769Z",
        "Scope": "local",
        "Driver": "null",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": []
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "ba812bbf4fa0f8c127981cf0d72ae343f98b338eada634e669a9485c655af77a": {
                "Name": "no-red",
                "EndpointID": "e1afe933a491829e3a55c18b265113d180a01b20181daf06b1205151843d6a51",
                "MacAddress": "",
                "IPv4Address": "",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

Si nos conectamos a este contenedor, y por ejemplo, le damos a actualizar o instalar alguna herramienta, al no tener red (--network none), nos da un error

```bash
docker exec -it ba812bbf4fa0f8c127981cf0d72ae343f98b338eada634e669a9485c655af77a bash
```

Vamos a ejecutar otro contenedor con las herramientas ya instaladas para probar esto:

```bash
docker run -dit --network none --name not-net-apine alpine ash
docker exec not-net-apine ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: tunl0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN qlen 1000
    link/ipip 0.0.0.0 brd 0.0.0.0
3: ip6tnl0@NONE: <NOARP> mtu 1452 qdisc noop state DOWN qlen 1000
    link/tunnel6 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00 brd 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00
```

### Limpiar redes

Si hacemos `docker network rm lemoncode--net` nos dará un error, porque hay contenedores que están usando esa red.

Si creamos una red nueva: `docker network create krbaio`, y luego hacemos un `ls` de las redes:

```bash
docker network ls
NETWORK ID     NAME                       DRIVER    SCOPE
830c7d7cf509   00-backend-start_default   bridge    local
d99c41e598a7   03-webserver_default       bridge    local
ff467dbfa1c1   bridge                     bridge    local
a8eabaa1c29e   host                       host      local
84900839b0c9   krbaio                     bridge    local
97ac3f4a856c   minikube                   bridge    local
08640353a3f7   none                       null      local
4c770a79c7a4   verdaccio_default          bridge    local
```

vemos que tenemos todas esas redes.

Podemos borrar las redes que no tengan un contenedor asignado con este comando:

```bash
docker network prune
WARNING! This will remove all custom networks not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Networks:
verdaccio_default
00-backend-start_default
minikube
03-webserver_default
krbaio
```

### Overlay Network

Se utiliza cuando docker está en formato cluster, nos permite que una red, independientemente del nodo en el que caigan, puedan comunicarse entre sí.

Si lo intentamos hacer fuera de un cluster:

```bash
docker network create --driver overlay multi--host-net
Error response from daemon: This node is not a swarm manager. Use "docker swarm init" or "docker swarm join" to connect this node to swarm and try again.
```

## Ejercicio

```bash
docker network create lemoncode
2da1b95e6fe8a19ef67dca238efed7a8d589619c6af93e2b8372bbf5a7907150
```

```bash
docker run -dit --network lemoncode --name nginx-container nginx
44e392c8afffe5e6440368ac1991d69e0d4b2a6e4273b00bc0681ea7be36eadb
```

```bash
docker run -dit --network lemoncode --name ubuntu-container ubuntu
81586a5bf9e589cb4c7fd72bf670b537696de19a68797b2982a970559dc42d30
```

```bash
docker exec -it 81586a5bf9e589cb4c7fd72bf670b537696de19a68797b2982a970559dc42d30 bash
```

```bash
root@dc5bb01ac6bd:/# apt update && apt upgrade && apt -y install curl
```

```bash
root@dc5bb01ac6bd:/# curl http://nginx-container
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to nginx!</title>
    <style>
      html {
        color-scheme: light dark;
      }
      body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to nginx!</h1>
    <p>
      If you see this page, the nginx web server is successfully installed and
      working. Further configuration is required.
    </p>

    <p>
      For online documentation and support please refer to
      <a href="http://nginx.org/">nginx.org</a>.<br />
      Commercial support is available at
      <a href="http://nginx.com/">nginx.com</a>.
    </p>

    <p><em>Thank you for using nginx.</em></p>
  </body>
</html>
```
