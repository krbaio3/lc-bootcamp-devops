# Docker Compose

<!-- TOC -->

- [Docker Compose](#docker-compose)
  - [docker-compose.yml](#docker-composeyml)
  - [KeyDown](#keydown)
  - [Análisis docker-compose.yml](#análisis-docker-composeyml)
  - [KeyDown (2)](#keydown-2)
  - [Comandos Docker-Compose](#comandos-docker-compose)
  - [Custom images](#custom-images)

<!-- /TOC -->

Se usa en lugar de generar muchos comandos de Docker

Un único archivo y se despliega con un sólo comando

Puedes manejar el ciclo de vida de tu aplicación con un conjunto de comandos

Puedes guardarlo y versionar la configuración de tu aplicación

## docker-compose.yml

Tienen cuatro secciones:

- version: especifica la versión del archivo (obligatorio que esté presente en la primera linea).
- volumes: los volumenes que tus contenedores utilizarán para guardar datos.
- services: se definen los contenedores que componen tu aplicacion.
- networks: lista las redes que usara tu aplicación.

## KeyDown

Vamos a desplegar un blog con Wordpress.
Este, necesita de una base de datos MySQL para funcionar, por lo que antes de desplegar esta aplicación necesitas una base de datos de este tipo
Si quisieramos hacerlo de forma manual, sería de la siguiente manera:

- Creamos la red donde ambos contenedores van poder comunicarse:

```bash
$ docker network create wordpress-network
9c5d372993c06d67f19a326816488549ef24a7ca7567521d3ae907bebd117a4e
$ docker network ls
NETWORK ID     NAME                DRIVER    SCOPE
a689d0aa02bc   bridge              bridge    local
a8eabaa1c29e   host                host      local
2da1b95e6fe8   lemoncode           bridge    local
08640353a3f7   none                null      local
6bb9b7551112   verdaccio_default   bridge    local
9c5d372993c0   wordpress-network   bridge    local
```

- Creo la base de datos MySQL, conectada a la red anterior, con un volumen que guarde la información de /var/lib/mysql.

```bash
docker run -dit --name mysqldb \
--network wordpress-network \
--mount source=mysql_data,target=/var/lib/mysql \
 -e MYSQL_ROOT_PASSWORD=somewordpress \
 -e MYSQL_DATABASE=wpdb \
 -e MYSQL_USER=wp_user \
 -e MYSQL_PASSWORD=wp_pwd \
  mysql:5.7
  Unable to find image 'mysql:5.7' locally
5.7: Pulling from library/mysql
b380bbd43752: Already exists
f23cbf2ecc5d: Pull complete
30cfc6c29c0a: Pull complete
b38609286cbe: Pull complete
8211d9e66cd6: Pull complete
2313f9eeca4a: Pull complete
7eb487d00da0: Pull complete
a71aacf913e7: Pull complete
393153c555df: Pull complete
06628e2290d7: Pull complete
ff2ab8dac9ac: Pull complete
Digest: sha256:2db8bfd2656b51ded5d938abcded8d32ec6181a9eae8dfc7ddf87a656ef97e97
Status: Downloaded newer image for mysql:5.7
f13f55180f6c6db3e5c7de218189ca69d8f9d93f4a2a8d1a10ef7682261cfc84
```

- Comprobamos como se ha creado

```bash
docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                 NAMES
f13f55180f6c   mysql:5.7   "docker-entrypoint.s…"   17 seconds ago   Up 16 seconds   3306/tcp, 33060/tcp   mysqldb
```

- Comprobamos que ha creado volumen nuevo llamado mysql_data

```bash
$ docker volume ls
DRIVER    VOLUME NAME
local     my-data
local     mysql_data
local     portainer_data
local     vscode
```

- Generar el contenedor de Wordpress, dentro de la misma red y apuntando al contenedor de MySQL:

```bash
$ docker run -dit --name wordpress \
--network wordpress-network \
-v wordpress_data:/var/www/html \
-e WORDPRESS_DB_HOST=mysqldb:3306 \
-e WORDPRESS_DB_USER=wp_user -e WORDPRESS_DB_PASSWORD=wp_pwd -e WORDPRESS_DB_NAME=wpdb \
-p 8000:80 wordpress:latest
Unable to find image 'wordpress:latest' locally
latest: Pulling from library/wordpress
7d63c13d9b9b: Already exists
24b15dfd3cfa: Pull complete
64625c2e355f: Pull complete
275a8dd8f358: Pull complete
eb1c8ccc797a: Pull complete
0aaf98f0c33a: Pull complete
e6e7c544c3e3: Pull complete
4ae870a5fb80: Pull complete
98833c4f4a49: Pull complete
f1a6af6bf10a: Pull complete
a56ec4dacea3: Pull complete
ab49679021a9: Pull complete
62d224267322: Pull complete
50baad31f9e0: Pull complete
0dce3ac87bb9: Pull complete
6e8719cc3579: Pull complete
69628185e06b: Pull complete
3a97cd45ec02: Pull complete
5cb43ca46b72: Pull complete
dddea2e20543: Pull complete
0efc87c94491: Pull complete
Digest: sha256:c1bb65c0bb60d22ba572a039614a855164911b39ff6a0d8e38e1e8fd6c8619f7
Status: Downloaded newer image for wordpress:latest
8aa436bf978539003af46ac798f9b793cfc64772a79c091a1bfba6725b04f64e
```

- Generar el contenedor de Wordpress dentro de la misma red y apuntando al contenedor de MySQL:

```bash
$ docker run -dit --name wordpress \
--network wordpress-network \
-v wordpress_data:/var/www/html \
-e WORDPRESS_DB_HOST=mysqldb:3306 \
-e WORDPRESS_DB_USER=wp_user -e WORDPRESS_DB_PASSWORD=wp_pwd -e WORDPRESS_DB_NAME=wpdb \
-p 8000:80 wordpress:latest
Unable to find image 'wordpress:latest' locally
latest: Pulling from library/wordpress
7d63c13d9b9b: Already exists
24b15dfd3cfa: Pull complete
64625c2e355f: Pull complete
275a8dd8f358: Pull complete
eb1c8ccc797a: Pull complete
0aaf98f0c33a: Pull complete
e6e7c544c3e3: Pull complete
4ae870a5fb80: Pull complete
98833c4f4a49: Pull complete
f1a6af6bf10a: Pull complete
a56ec4dacea3: Pull complete
ab49679021a9: Pull complete
62d224267322: Pull complete
50baad31f9e0: Pull complete
0dce3ac87bb9: Pull complete
6e8719cc3579: Pull complete
69628185e06b: Pull complete
3a97cd45ec02: Pull complete
5cb43ca46b72: Pull complete
dddea2e20543: Pull complete
0efc87c94491: Pull complete
Digest: sha256:c1bb65c0bb60d22ba572a039614a855164911b39ff6a0d8e38e1e8fd6c8619f7
Status: Downloaded newer image for wordpress:latest
8c90ef7d4f121c71ae6228fa98911b3b73fa98502e38c16fc39f0317dea86347
```

- El contenido en el volumen wordpress_data:

```bash
$ docker exec wordpress ls -l /var/www/html
total 232
-rw-r--r--  1 www-data www-data   405 Feb  6  2020 index.php
-rw-r--r--  1 www-data www-data 19915 Jan  1  2021 license.txt
-rw-r--r--  1 www-data www-data  7346 Jul  6 12:23 readme.html
-rw-r--r--  1 www-data www-data  7165 Jan 21  2021 wp-activate.php
drwxr-xr-x  9 www-data www-data  4096 Sep  9 02:20 wp-admin
-rw-r--r--  1 www-data www-data   351 Feb  6  2020 wp-blog-header.php
-rw-r--r--  1 www-data www-data  2328 Feb 17  2021 wp-comments-post.php
-rw-rw-r--  1 www-data www-data  5483 Oct 22 19:50 wp-config-docker.php
-rw-r--r--  1 www-data www-data  3004 May 21 10:40 wp-config-sample.php
-rw-r--r--  1 www-data www-data  5587 Nov  7 18:40 wp-config.php
drwxr-xr-x  7 www-data www-data  4096 Nov  7 18:44 wp-content
-rw-r--r--  1 www-data www-data  3939 Jul 30  2020 wp-cron.php
drwxr-xr-x 25 www-data www-data 16384 Sep  9 02:20 wp-includes
-rw-r--r--  1 www-data www-data  2496 Feb  6  2020 wp-links-opml.php
-rw-r--r--  1 www-data www-data  3900 May 15 17:38 wp-load.php
-rw-r--r--  1 www-data www-data 45463 Apr  6  2021 wp-login.php
-rw-r--r--  1 www-data www-data  8509 Apr 14  2020 wp-mail.php
-rw-r--r--  1 www-data www-data 22297 Jun  1 23:09 wp-settings.php
-rw-r--r--  1 www-data www-data 31693 May  7  2021 wp-signup.php
-rw-r--r--  1 www-data www-data  4747 Oct  8  2020 wp-trackback.php
-rw-r--r--  1 www-data www-data  3236 Jun  8  2020 xmlrpc.php
```

- Para eliminar todo el proceso debería de hacer

```bash
$ docker rm -f wordpress mysqldb && \
docker network rm wordpress-network && \
docker volume rm mysql_data wordpress_data
```

## Análisis docker-compose.yml

```yml
version: "3.9" # Versión del docker-compose que se usamos
services: # La difinicion de todos los contenedores que voy  a dar de alta a esta aplicacion multi-contenedor, con los nombres que queramos
  db: # nombre que le hemos dado al contenedor
    image: mysql:5.7 # Imagen de donde partimos
    volumes:
      - db_data:/var/lib/mysql # el volumen se llama db_-data y mapeado a la ruta /var/lib/mysql
    restart: always # esta propiedad es si el contenedor muere por un pete, o se para, indicamos qué hacer (always, se recupere siempre)
    environment: # variables de entorno
      MYSQL_ROOT_PASSWORD: root_pwd
      MYSQL_DATABASE: wpdb
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: wp_pwd
    networks: # red a la que se tiene que conectar este contenedor
      - wordpress-network
  wordpress:
    depends_on: # hasta que el contenedor db no ha arrancado, porque tiene dependencias, no se inicia este
      - db
    image: wordpress:latest
    volumes:
      - wordpress_data:/var/www/html
    ports: # mapeo del puerto
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306 # como el contenedor se llama db, hace referencia al contenedor (antes, por comandos se llamaba de otra manera)
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: wp_pwd
      WORDPRESS_DB_NAME: wpdb
    networks:
      - wordpress-network
volumes: # definimos los volúmenes que estamos usando más arriba, deben de estar definidos aquí/ Esta definición es "rara", indicamos el nombre y ":", y no se asignamos nada. Con esto lo que estamos haciendo es que use el driver local. Podemos indicarle cualquier driver para que los datos caigan en un S3 o lo que queramos
  db_data:
  wordpress_data:
networks: # redes: las definimos aquí para el contenedor 1 y 2.
  wordpress-network:
```

## KeyDown (2)

Hay que tener en cuenta, que el propio docker-compose ejecuta los comandos que le pongamos en el orden que deben de ser, es decir, si ponemos como en el caso de networks, lo último, en los logs, vemos que es lo primero que crea. Tiene esa inteligencia.

> `depends_on`, sólo espera a los contenedores, no a lo que se ejecuta dentro del contenedor. Es decir, si ejecutamos un mongo, va a estar disponible al momento, pero si ejecutamos, un mysql, va a tardar un poquito en estar receptivo a peticiones. Este trabajo, de await-for-it, hay que estudiarlo en cada caso.

Ejecutamos el anterior `docker-compose.yml`:

```bash
$ docker-compose up
[+] Running 5/5
 ⠿ Network docker_wordpress-network Created
 ⠿ Volume "docker_wordpress_data"    Created
 ⠿ Volume "docker_db_data"           Created
 ⠿ Container docker-db-1             Created
 ⠿ Container docker-wordpress-1      Created
Attaching to docker-db-1, docker-wordpress-1
docker-db-1         | 2021-11-07 19:11:34+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.36-1debian10 started.
docker-db-1         | 2021-11-07 19:11:34+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
docker-db-1         | 2021-11-07 19:11:34+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.36-1debian10 started.
docker-db-1         | 2021-11-07 19:11:34+00:00 [Note] [Entrypoint]: Initializing database files
docker-db-1         | 2021-11-07T19:11:34.895699Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
docker-db-1         | 2021-11-07T19:11:35.052751Z 0 [Warning] InnoDB: New log files created, LSN=45790
docker-db-1         | 2021-11-07T19:11:35.080158Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.
docker-db-1         | 2021-11-07T19:11:35.085108Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: 866809a9-3ffe-11ec-beca-0242ac130002.
docker-db-1         | 2021-11-07T19:11:35.086949Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.
docker-db-1         | 2021-11-07T19:11:35.470659Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
docker-db-1         | 2021-11-07T19:11:35.470688Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
docker-db-1         | 2021-11-07T19:11:35.471038Z 0 [Warning] CA certificate ca.pem is self signed.
docker-wordpress-1  | WordPress not found in /var/www/html - copying now...
docker-db-1         | 2021-11-07T19:11:35.660505Z 1 [Warning] root@localhost is created with an empty password ! Please consider switching off the --initialize-insecure option.
docker-wordpress-1  | Complete! WordPress has been successfully copied to /var/www/html
docker-wordpress-1  | No 'wp-config.php' found in /var/www/html, but 'WORDPRESS_...' variables supplied; copying 'wp-config-docker.php' (WORDPRESS_DB_HOST WORDPRESS_DB_NAME WORDPRESS_DB_PASSWORD WORDPRESS_DB_USER)
docker-wordpress-1  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.19.0.3. Set the 'ServerName' directive globally to suppress this message
docker-wordpress-1  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.19.0.3. Set the 'ServerName' directive globally to suppress this message
docker-wordpress-1  | [Sun Nov 07 19:11:35.908163 2021] [mpm_prefork:notice] [pid 1] AH00163: Apache/2.4.51 (Debian) PHP/7.4.25 configured -- resuming normal operations
docker-wordpress-1  | [Sun Nov 07 19:11:35.908227 2021] [core:notice] [pid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
docker-db-1         | 2021-11-07 19:11:37+00:00 [Note] [Entrypoint]: Database files initialized
docker-db-1         | 2021-11-07 19:11:37+00:00 [Note] [Entrypoint]: Starting temporary server
docker-db-1         | 2021-11-07 19:11:37+00:00 [Note] [Entrypoint]: Waiting for server startup
docker-db-1         | 2021-11-07T19:11:38.166288Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
docker-db-1         | 2021-11-07T19:11:38.167324Z 0 [Note] mysqld (mysqld 5.7.36) starting as process 77 ...
docker-db-1         | 2021-11-07T19:11:38.169691Z 0 [Note] InnoDB: PUNCH HOLE support available
docker-db-1         | 2021-11-07T19:11:38.169721Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
docker-db-1         | 2021-11-07T19:11:38.169725Z 0 [Note] InnoDB: Uses event mutexes
docker-db-1         | 2021-11-07T19:11:38.169726Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
docker-db-1         | 2021-11-07T19:11:38.169728Z 0 [Note] InnoDB: Compressed tables use zlib 1.2.11
docker-db-1         | 2021-11-07T19:11:38.169729Z 0 [Note] InnoDB: Using Linux native AIO
docker-db-1         | 2021-11-07T19:11:38.169999Z 0 [Note] InnoDB: Number of pools: 1
docker-db-1         | 2021-11-07T19:11:38.170158Z 0 [Note] InnoDB: Using CPU crc32 instructions
docker-db-1         | 2021-11-07T19:11:38.171866Z 0 [Note] InnoDB: Initializing buffer pool, total size = 128M, instances = 1, chunk size = 128M
docker-db-1         | 2021-11-07T19:11:38.178143Z 0 [Note] InnoDB: Completed initialization of buffer pool
docker-db-1         | 2021-11-07T19:11:38.180645Z 0 [Note] InnoDB: If the mysqld execution user is authorized, page cleaner thread priority can be changed. See the man page of setpriority().
docker-db-1         | 2021-11-07T19:11:38.191937Z 0 [Note] InnoDB: Highest supported file format is Barracuda.
docker-db-1         | 2021-11-07T19:11:38.198016Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
docker-db-1         | 2021-11-07T19:11:38.198089Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
docker-db-1         | 2021-11-07T19:11:38.218426Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
docker-db-1         | 2021-11-07T19:11:38.218958Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
docker-db-1         | 2021-11-07T19:11:38.218986Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
docker-db-1         | 2021-11-07T19:11:38.219495Z 0 [Note] InnoDB: 5.7.36 started; log sequence number 2749723
docker-db-1         | 2021-11-07T19:11:38.219667Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
docker-db-1         | 2021-11-07T19:11:38.220041Z 0 [Note] Plugin 'FEDERATED' is disabled.
docker-db-1         | 2021-11-07T19:11:38.221070Z 0 [Note] InnoDB: Buffer pool(s) load completed at 211107 19:11:38
docker-db-1         | 2021-11-07T19:11:38.224658Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
docker-db-1         | 2021-11-07T19:11:38.224689Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
docker-db-1         | 2021-11-07T19:11:38.224694Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
docker-db-1         | 2021-11-07T19:11:38.224696Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
docker-db-1         | 2021-11-07T19:11:38.225083Z 0 [Warning] CA certificate ca.pem is self signed.
docker-db-1         | 2021-11-07T19:11:38.225129Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
docker-db-1         | 2021-11-07T19:11:38.226927Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
docker-db-1         | 2021-11-07T19:11:38.232829Z 0 [Note] Event Scheduler: Loaded 0 events
docker-db-1         | 2021-11-07T19:11:38.233124Z 0 [Note] mysqld: ready for connections.
docker-db-1         | Version: '5.7.36'  socket: '/var/run/mysqld/mysqld.sock'  port: 0  MySQL Community Server (GPL)
docker-db-1         | 2021-11-07 19:11:39+00:00 [Note] [Entrypoint]: Temporary server started.
docker-db-1         | Warning: Unable to load '/usr/share/zoneinfo/iso3166.tab' as time zone. Skipping it.
docker-db-1         | Warning: Unable to load '/usr/share/zoneinfo/leap-seconds.list' as time zone. Skipping it.
docker-db-1         | Warning: Unable to load '/usr/share/zoneinfo/zone.tab' as time zone. Skipping it.
docker-db-1         | Warning: Unable to load '/usr/share/zoneinfo/zone1970.tab' as time zone. Skipping it.
docker-db-1         | 2021-11-07 19:11:40+00:00 [Note] [Entrypoint]: Creating database wpdb
docker-db-1         | 2021-11-07 19:11:40+00:00 [Note] [Entrypoint]: Creating user wp_user
docker-db-1         | 2021-11-07 19:11:40+00:00 [Note] [Entrypoint]: Giving user wp_user access to schema wpdb
docker-db-1         |
docker-db-1         | 2021-11-07 19:11:40+00:00 [Note] [Entrypoint]: Stopping temporary server
docker-db-1         | 2021-11-07T19:11:40.957153Z 0 [Note] Giving 0 client threads a chance to die gracefully
docker-db-1         | 2021-11-07T19:11:40.957189Z 0 [Note] Shutting down slave threads
docker-db-1         | 2021-11-07T19:11:40.957194Z 0 [Note] Forcefully disconnecting 0 remaining clients
docker-db-1         | 2021-11-07T19:11:40.957199Z 0 [Note] Event Scheduler: Purging the queue. 0 events
docker-db-1         | 2021-11-07T19:11:40.957262Z 0 [Note] Binlog end
docker-db-1         | 2021-11-07T19:11:40.957710Z 0 [Note] Shutting down plugin 'ngram'
docker-db-1         | 2021-11-07T19:11:40.957736Z 0 [Note] Shutting down plugin 'partition'
docker-db-1         | 2021-11-07T19:11:40.957741Z 0 [Note] Shutting down plugin 'BLACKHOLE'
docker-db-1         | 2021-11-07T19:11:40.957743Z 0 [Note] Shutting down plugin 'ARCHIVE'
docker-db-1         | 2021-11-07T19:11:40.957744Z 0 [Note] Shutting down plugin 'PERFORMANCE_SCHEMA'
docker-db-1         | 2021-11-07T19:11:40.957759Z 0 [Note] Shutting down plugin 'MRG_MYISAM'
docker-db-1         | 2021-11-07T19:11:40.957761Z 0 [Note] Shutting down plugin 'MyISAM'
docker-db-1         | 2021-11-07T19:11:40.957766Z 0 [Note] Shutting down plugin 'INNODB_SYS_VIRTUAL'
docker-db-1         | 2021-11-07T19:11:40.957768Z 0 [Note] Shutting down plugin 'INNODB_SYS_DATAFILES'
docker-db-1         | 2021-11-07T19:11:40.957769Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLESPACES'
docker-db-1         | 2021-11-07T19:11:40.957770Z 0 [Note] Shutting down plugin 'INNODB_SYS_FOREIGN_COLS'
docker-db-1         | 2021-11-07T19:11:40.957771Z 0 [Note] Shutting down plugin 'INNODB_SYS_FOREIGN'
docker-db-1         | 2021-11-07T19:11:40.957772Z 0 [Note] Shutting down plugin 'INNODB_SYS_FIELDS'
docker-db-1         | 2021-11-07T19:11:40.957773Z 0 [Note] Shutting down plugin 'INNODB_SYS_COLUMNS'
docker-db-1         | 2021-11-07T19:11:40.957774Z 0 [Note] Shutting down plugin 'INNODB_SYS_INDEXES'
docker-db-1         | 2021-11-07T19:11:40.957775Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLESTATS'
docker-db-1         | 2021-11-07T19:11:40.957776Z 0 [Note] Shutting down plugin 'INNODB_SYS_TABLES'
docker-db-1         | 2021-11-07T19:11:40.957777Z 0 [Note] Shutting down plugin 'INNODB_FT_INDEX_TABLE'
docker-db-1         | 2021-11-07T19:11:40.957778Z 0 [Note] Shutting down plugin 'INNODB_FT_INDEX_CACHE'
docker-db-1         | 2021-11-07T19:11:40.957779Z 0 [Note] Shutting down plugin 'INNODB_FT_CONFIG'
docker-db-1         | 2021-11-07T19:11:40.957780Z 0 [Note] Shutting down plugin 'INNODB_FT_BEING_DELETED'
docker-db-1         | 2021-11-07T19:11:40.957781Z 0 [Note] Shutting down plugin 'INNODB_FT_DELETED'
docker-db-1         | 2021-11-07T19:11:40.957783Z 0 [Note] Shutting down plugin 'INNODB_FT_DEFAULT_STOPWORD'
docker-db-1         | 2021-11-07T19:11:40.957785Z 0 [Note] Shutting down plugin 'INNODB_METRICS'
docker-db-1         | 2021-11-07T19:11:40.957786Z 0 [Note] Shutting down plugin 'INNODB_TEMP_TABLE_INFO'
docker-db-1         | 2021-11-07T19:11:40.957787Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_POOL_STATS'
docker-db-1         | 2021-11-07T19:11:40.957788Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_PAGE_LRU'
docker-db-1         | 2021-11-07T19:11:40.957788Z 0 [Note] Shutting down plugin 'INNODB_BUFFER_PAGE'
docker-db-1         | 2021-11-07T19:11:40.957789Z 0 [Note] Shutting down plugin 'INNODB_CMP_PER_INDEX_RESET'
docker-db-1         | 2021-11-07T19:11:40.957790Z 0 [Note] Shutting down plugin 'INNODB_CMP_PER_INDEX'
docker-db-1         | 2021-11-07T19:11:40.957791Z 0 [Note] Shutting down plugin 'INNODB_CMPMEM_RESET'
docker-db-1         | 2021-11-07T19:11:40.957792Z 0 [Note] Shutting down plugin 'INNODB_CMPMEM'
docker-db-1         | 2021-11-07T19:11:40.957793Z 0 [Note] Shutting down plugin 'INNODB_CMP_RESET'
docker-db-1         | 2021-11-07T19:11:40.957794Z 0 [Note] Shutting down plugin 'INNODB_CMP'
docker-db-1         | 2021-11-07T19:11:40.957795Z 0 [Note] Shutting down plugin 'INNODB_LOCK_WAITS'
docker-db-1         | 2021-11-07T19:11:40.957796Z 0 [Note] Shutting down plugin 'INNODB_LOCKS'
docker-db-1         | 2021-11-07T19:11:40.957797Z 0 [Note] Shutting down plugin 'INNODB_TRX'
docker-db-1         | 2021-11-07T19:11:40.957798Z 0 [Note] Shutting down plugin 'InnoDB'
docker-db-1         | 2021-11-07T19:11:40.957862Z 0 [Note] InnoDB: FTS optimize thread exiting.
docker-db-1         | 2021-11-07T19:11:40.957997Z 0 [Note] InnoDB: Starting shutdown...
docker-db-1         | 2021-11-07T19:11:41.062382Z 0 [Note] InnoDB: Dumping buffer pool(s) to /var/lib/mysql/ib_buffer_pool
docker-db-1         | 2021-11-07T19:11:41.062800Z 0 [Note] InnoDB: Buffer pool(s) dump completed at 211107 19:11:41
docker-db-1         | 2021-11-07T19:11:42.064231Z 0 [Note] InnoDB: Shutdown completed; log sequence number 12660048
docker-db-1         | 2021-11-07T19:11:42.067220Z 0 [Note] InnoDB: Removed temporary tablespace data file: "ibtmp1"
docker-db-1         | 2021-11-07T19:11:42.067274Z 0 [Note] Shutting down plugin 'MEMORY'
docker-db-1         | 2021-11-07T19:11:42.067280Z 0 [Note] Shutting down plugin 'CSV'
docker-db-1         | 2021-11-07T19:11:42.067283Z 0 [Note] Shutting down plugin 'sha256_password'
docker-db-1         | 2021-11-07T19:11:42.067285Z 0 [Note] Shutting down plugin 'mysql_native_password'
docker-db-1         | 2021-11-07T19:11:42.067419Z 0 [Note] Shutting down plugin 'binlog'
docker-db-1         | 2021-11-07T19:11:42.070654Z 0 [Note] mysqld: Shutdown complete
docker-db-1         |
docker-db-1         | 2021-11-07 19:11:42+00:00 [Note] [Entrypoint]: Temporary server stopped
docker-db-1         |
docker-db-1         | 2021-11-07 19:11:42+00:00 [Note] [Entrypoint]: MySQL init process done. Ready for start up.
docker-db-1         |
docker-db-1         | 2021-11-07T19:11:43.113748Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
docker-db-1         | 2021-11-07T19:11:43.114731Z 0 [Note] mysqld (mysqld 5.7.36) starting as process 1 ...
docker-db-1         | 2021-11-07T19:11:43.117406Z 0 [Note] InnoDB: PUNCH HOLE support available
docker-db-1         | 2021-11-07T19:11:43.117436Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
docker-db-1         | 2021-11-07T19:11:43.117440Z 0 [Note] InnoDB: Uses event mutexes
docker-db-1         | 2021-11-07T19:11:43.117441Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
docker-db-1         | 2021-11-07T19:11:43.117443Z 0 [Note] InnoDB: Compressed tables use zlib 1.2.11
docker-db-1         | 2021-11-07T19:11:43.117444Z 0 [Note] InnoDB: Using Linux native AIO
docker-db-1         | 2021-11-07T19:11:43.117614Z 0 [Note] InnoDB: Number of pools: 1
docker-db-1         | 2021-11-07T19:11:43.117772Z 0 [Note] InnoDB: Using CPU crc32 instructions
docker-db-1         | 2021-11-07T19:11:43.119736Z 0 [Note] InnoDB: Initializing buffer pool, total size = 128M, instances = 1, chunk size = 128M
docker-db-1         | 2021-11-07T19:11:43.127639Z 0 [Note] InnoDB: Completed initialization of buffer pool
docker-db-1         | 2021-11-07T19:11:43.129866Z 0 [Note] InnoDB: If the mysqld execution user is authorized, page cleaner thread priority can be changed. See the man page of setpriority().
docker-db-1         | 2021-11-07T19:11:43.141358Z 0 [Note] InnoDB: Highest supported file format is Barracuda.
docker-db-1         | 2021-11-07T19:11:43.147658Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
docker-db-1         | 2021-11-07T19:11:43.147734Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
docker-db-1         | 2021-11-07T19:11:43.161661Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
docker-db-1         | 2021-11-07T19:11:43.162223Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
docker-db-1         | 2021-11-07T19:11:43.162254Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
docker-db-1         | 2021-11-07T19:11:43.162777Z 0 [Note] InnoDB: Waiting for purge to start
docker-db-1         | 2021-11-07T19:11:43.213308Z 0 [Note] InnoDB: 5.7.36 started; log sequence number 12660048
docker-db-1         | 2021-11-07T19:11:43.213517Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
docker-db-1         | 2021-11-07T19:11:43.213705Z 0 [Note] Plugin 'FEDERATED' is disabled.
docker-db-1         | 2021-11-07T19:11:43.216064Z 0 [Note] InnoDB: Buffer pool(s) load completed at 211107 19:11:43
docker-db-1         | 2021-11-07T19:11:43.218328Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
docker-db-1         | 2021-11-07T19:11:43.218357Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
docker-db-1         | 2021-11-07T19:11:43.218362Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
docker-db-1         | 2021-11-07T19:11:43.218364Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
docker-db-1         | 2021-11-07T19:11:43.218786Z 0 [Warning] CA certificate ca.pem is self signed.
docker-db-1         | 2021-11-07T19:11:43.218833Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
docker-db-1         | 2021-11-07T19:11:43.219240Z 0 [Note] Server hostname (bind-address): '*'; port: 3306
docker-db-1         | 2021-11-07T19:11:43.219321Z 0 [Note] IPv6 is available.
docker-db-1         | 2021-11-07T19:11:43.219333Z 0 [Note]   - '::' resolves to '::';
docker-db-1         | 2021-11-07T19:11:43.219343Z 0 [Note] Server socket created on IP: '::'.
docker-db-1         | 2021-11-07T19:11:43.221340Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
docker-db-1         | 2021-11-07T19:11:43.227309Z 0 [Note] Event Scheduler: Loaded 0 events
docker-db-1         | 2021-11-07T19:11:43.227609Z 0 [Note] mysqld: ready for connections.
docker-db-1         | Version: '5.7.36'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
```

## Comandos Docker-Compose

Para **parar** los contenedores, con el comando `ctrl+c`:

```bash
$ Gracefully stopping... (press Ctrl+C again to force)
[+] Running 2/2
 ⠿ Container docker-wordpress-1  Stopped
 ⠿ Container docker-db-1         Stopped
canceled
```

Para **volver a levantarlos**, y desatacharlos del terminal con el comando `docker-compose up -d`:

```bash
$ docker-compose up -d
[+] Running 2/2
 ⠿ Container docker-db-1         Started
 ⠿ Container docker-wordpress-1  Started
```

Y para **parar** este tipo de inicialización, se haría con el comando `docker-compose stop`

```bash
$ docker-compose stop
[+] Running 2/2
 ⠿ Container docker-wordpress-1  Stopped
 ⠿ Container docker-db-1         Stopped
```

Si queremos ya **no sólo pararlo, eliminar los contenedores** (ni los volumenes ni la network la borra), con el comando `docker-compose down`:

```bash
$ docker-compose down
[+] Running 2/2
 ⠿ Container docker-wordpress-1  Removed
 ⠿ Container docker-db-1         Removed
```

Para **eliminarlo contendores, network y volume** del sistema con el comando `docker-compose down -v`:

```bash
$ docker-compose down -v
[+] Running 5/5
 ⠿ Container docker-wordpress-1      Removed
 ⠿ Container docker-db-1             Removed
 ⠿ Volume docker_db_data             Removed
 ⠿ Volume docker_wordpress_data      Removed
 ⠿ Network docker_wordpress-network  Removed
```

Para **eliminarlo completamente** (contenedor, volumen, network e imagenes) con el comando `docker-compose down -v --rmi local`:

```bash
$ docker-compose down -v --rmi local
Running 5/5
 ⠿ Container docker-wordpress-1      Removed
 ⠿ Container docker-db-1             Removed
 ⠿ Volume docker_db_data             Removed
 ⠿ Volume docker_wordpress_data      Removed
 ⠿ Network docker_wordpress-network  Removed
```

## Custom images

Si quisiera usar imágenes que me he construido yo, se tendría que hacer de esta manera (ver [my-app](./my-app)):

En vez de usar la propiedad `image`, usamos la propiedad `build`. Que le indicamos el contexto donde generar la imagen.

```yml
version: "3.9"
services:
  frontend:
    build: # En ver de usar la propiedad image, usamos la build, y le indicamos el contexto donde está el archivo dockerfile y su nombre si no es Dockerfile (que lo es por defecto)
      context: ./frontend # contexto donde buscar el archivo Dockerfile
      # dockerfile: Dockerfile  # nombre por defecto del archivo Dockerfile
    deploy: # De este contenedor tenemos dos replicas (frontend 1 y 2)
      replicas: 2
    ports:
      - 3000 # tenemos dos contenedores y no le hemos asignado un puerto, porque directamente no podemos decirle que dos contenedores usen el mismo puerto, luego hay que ver qué puerto nos ha asignado Docker
    depends_on:
      - backend
  backend:
    build:
      context: ./backend
      # dockerfile: Dockerfile
    ports:
      - 8080:8080
    depends_on:
      - mongodb
  mongodb:
    image: mongo:latest
```

Para ejecutar este contenedor, tenemos que hacer:

```bash
$docker-compose up --build &
[1] 15096
[+] Building 56.4s (17/17) FINISHED
=> [my-app_backend internal] load build definition from Dockerfile
 => => transferring dockerfile: 181B
 => [my-app_frontend internal] load build definition from Dockerfile
 => => transferring dockerfile: 181B
 => [my-app_backend internal] load .dockerignore
 => => transferring context: 2B
 => [my-app_frontend internal] load .dockerignore
 => => transferring context: 167B
 => [my-app_backend internal] load metadata for docker.io/library/node:10.13-alpine
 => [auth] library/node:pull token for registry-1.docker.io
 => [my-app_backend 1/5] FROM docker.io/library/node:10.13-alpine@sha256:22c8219b21f86dfd7398ce1f62c48a022fecdcf0ad7bf3b0681131bd04a023a2
 => => resolve docker.io/library/node:10.13-alpine@sha256:22c8219b21f86dfd7398ce1f62c48a022fecdcf0ad7bf3b0681131bd04a023a2
 => => sha256:c245f6a8ecc59b205ac5e40f7e49ec7e73e6e449cd957c4b5c01f3248497833f 20.27MB / 20.27MB
 => => sha256:82bdc9503d509b4d9a45c074f0377b9337b5bf9b14086e08934a5a06b2ad056c 1.26MB / 1.26MB
 => => sha256:22c8219b21f86dfd7398ce1f62c48a022fecdcf0ad7bf3b0681131bd04a023a2 2.03kB / 2.03kB
 => => sha256:e29c348960786753767bba75889dd8bbd8aa549ed8bdfdc73da314b29fa6466c 951B / 951B
 => => sha256:93f2dcbcddfe316c539840c1ecae800605270cd27d3d4044dfa18ff65fc8c64a 5.14kB / 5.14kB
 => => sha256:4fe2ade4980c2dda4fc95858ebb981489baec8c1e4bd282ab1c3560be8ff9bde 2.21MB / 2.21MB
 => => extracting sha256:4fe2ade4980c2dda4fc95858ebb981489baec8c1e4bd282ab1c3560be8ff9bde
 => => extracting sha256:c245f6a8ecc59b205ac5e40f7e49ec7e73e6e449cd957c4b5c01f3248497833f
 => => extracting sha256:82bdc9503d509b4d9a45c074f0377b9337b5bf9b14086e08934a5a06b2ad056c
 => [my-app_backend internal] load build context
 => => transferring context: 25.76kB
 => [my-app_frontend internal] load build context
 => => transferring context: 1.17MB
 => [my-app_backend 2/5] WORKDIR /app
 => [my-app_backend 3/5] COPY [package.json, package-lock.json*, ./]
 => [my-app_frontend 3/5] COPY [package.json, package-lock.json*, ./]
 => [my-app_backend 4/5] RUN npm install
 => [my-app_frontend 4/5] RUN npm install
 => [my-app_backend 5/5] COPY . .
 => [my-app_frontend] exporting to image
 => => exporting layers
 => => writing image sha256:69fe20088e2f7dd837b69d2940a2ce4f65cae7193fd735cc2bb8890b8c8d9203
 => => naming to docker.io/library/my-app_backend
 => => writing image sha256:bea59083593edbe3732fc0847d1cf684265e4a1f039283efc14d9a21d732593c
 => => naming to docker.io/library/my-app_frontend
 => [my-app_frontend 5/5] COPY . .

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
[+] Running 5/3
 ⠿ Network my-app_default       Created
 ⠿ Container my-app-mongodb-1   Created
 ⠿ Container my-app-backend-1   Created
 ⠿ Container my-app-frontend-2  Created
 ⠿ Container my-app-frontend-1  Created
Attaching to my-app-backend-1, my-app-frontend-1, my-app-frontend-2, my-app-mongodb-1
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.015+00:00"},"s":"I",  "c":"CONTROL",  "id":23285,   "ctx":"main","msg":"Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'"}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.031+00:00"},"s":"W",  "c":"ASIO",     "id":22601,   "ctx":"main","msg":"No TransportLayer configured during NetworkInterface startup"}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.031+00:00"},"s":"I",  "c":"NETWORK",  "id":4648601, "ctx":"main","msg":"Implicit TCP FastOpen unavailable. If TCP FastOpen is required, set tcpFastOpenServer, tcpFastOpenClient, and tcpFastOpenQueueSize."}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.032+00:00"},"s":"I",  "c":"STORAGE",  "id":4615611, "ctx":"initandlisten","msg":"MongoDB starting","attr":{"pid":1,"port":27017,"dbPath":"/data/db","architecture":"64-bit","host":"0a2266b06418"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.032+00:00"},"s":"I",  "c":"CONTROL",  "id":23403,   "ctx":"initandlisten","msg":"Build Info","attr":{"buildInfo":{"version":"4.4.4","gitVersion":"8db30a63db1a9d84bdcad0c83369623f708e0397","openSSLVersion":"OpenSSL 1.1.1  11 Sep 2018","modules":[],"allocator":"tcmalloc","environment":{"distmod":"ubuntu1804","distarch":"x86_64","target_arch":"x86_64"}}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.032+00:00"},"s":"I",  "c":"CONTROL",  "id":51765,   "ctx":"initandlisten","msg":"Operating System","attr":{"os":{"name":"Ubuntu","version":"18.04"}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.032+00:00"},"s":"I",  "c":"CONTROL",  "id":21951,   "ctx":"initandlisten","msg":"Options set by command line","attr":{"options":{"net":{"bindIp":"*"}}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.035+00:00"},"s":"I",  "c":"STORAGE",  "id":22297,   "ctx":"initandlisten","msg":"Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem","tags":["startupWarnings"]}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.036+00:00"},"s":"I",  "c":"STORAGE",  "id":22315,   "ctx":"initandlisten","msg":"Opening WiredTiger","attr":{"config":"create,cache_size=480M,session_max=33000,eviction=(threads_min=4,threads_max=4),config_base=false,statistics=(fast),log=(enabled=true,archive=true,path=journal,compressor=snappy),file_manager=(close_idle_time=100000,close_scan_interval=10,close_handle_minimum=250),statistics_log=(wait=0),verbose=[recovery_progress,checkpoint_progress,compact_progress],"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.540+00:00"},"s":"I",  "c":"STORAGE",  "id":22430,   "ctx":"initandlisten","msg":"WiredTiger message","attr":{"message":"[1636314334:540493][1:0x7f0eddac3ac0], txn-recover: [WT_VERB_RECOVERY | WT_VERB_RECOVERY_PROGRESS] Set global recovery timestamp: (0, 0)"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.540+00:00"},"s":"I",  "c":"STORAGE",  "id":22430,   "ctx":"initandlisten","msg":"WiredTiger message","attr":{"message":"[1636314334:540559][1:0x7f0eddac3ac0], txn-recover: [WT_VERB_RECOVERY | WT_VERB_RECOVERY_PROGRESS] Set global oldest timestamp: (0, 0)"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.546+00:00"},"s":"I",  "c":"STORAGE",  "id":4795906, "ctx":"initandlisten","msg":"WiredTiger opened","attr":{"durationMillis":510}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.546+00:00"},"s":"I",  "c":"RECOVERY", "id":23987,   "ctx":"initandlisten","msg":"WiredTiger recoveryTimestamp","attr":{"recoveryTimestamp":{"$timestamp":{"t":0,"i":0}}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.558+00:00"},"s":"I",  "c":"STORAGE",  "id":4366408, "ctx":"initandlisten","msg":"No table logging settings modifications are required for existing WiredTiger tables","attr":{"loggingEnabled":true}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.559+00:00"},"s":"I",  "c":"STORAGE",  "id":22262,   "ctx":"initandlisten","msg":"Timestamp monitor starting"}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.563+00:00"},"s":"W",  "c":"CONTROL",  "id":22120,   "ctx":"initandlisten","msg":"Access control is not enabled for the database. Read and write access to data and configuration is unrestricted","tags":["startupWarnings"]}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.570+00:00"},"s":"I",  "c":"STORAGE",  "id":20320,   "ctx":"initandlisten","msg":"createCollection","attr":{"namespace":"admin.system.version","uuidDisposition":"provided","uuid":{"uuid":{"$uuid":"cdd079f2-c8b1-44eb-b6c5-299aa59342bc"}},"options":{"uuid":{"$uuid":"cdd079f2-c8b1-44eb-b6c5-299aa59342bc"}}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.579+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"initandlisten","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"admin.system.version","index":"_id_","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.580+00:00"},"s":"I",  "c":"COMMAND",  "id":20459,   "ctx":"initandlisten","msg":"Setting featureCompatibilityVersion","attr":{"newVersion":"4.4"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.582+00:00"},"s":"I",  "c":"STORAGE",  "id":20536,   "ctx":"initandlisten","msg":"Flow Control is enabled on this deployment"}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.585+00:00"},"s":"I",  "c":"STORAGE",  "id":20320,   "ctx":"initandlisten","msg":"createCollection","attr":{"namespace":"local.startup_log","uuidDisposition":"generated","uuid":{"uuid":{"$uuid":"6bdf7688-a915-4ea8-a8de-0e44bb96e31f"}},"options":{"capped":true,"size":10485760}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.592+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"initandlisten","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"local.startup_log","index":"_id_","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.593+00:00"},"s":"I",  "c":"FTDC",     "id":20625,   "ctx":"initandlisten","msg":"Initializing full-time diagnostic data capture","attr":{"dataDirectory":"/data/db/diagnostic.data"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.595+00:00"},"s":"I",  "c":"NETWORK",  "id":23015,   "ctx":"listener","msg":"Listening on","attr":{"address":"/tmp/mongodb-27017.sock"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.595+00:00"},"s":"I",  "c":"NETWORK",  "id":23015,   "ctx":"listener","msg":"Listening on","attr":{"address":"0.0.0.0"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.595+00:00"},"s":"I",  "c":"NETWORK",  "id":23016,   "ctx":"listener","msg":"Waiting for connections","attr":{"port":27017,"ssl":"off"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.610+00:00"},"s":"I",  "c":"STORAGE",  "id":20320,   "ctx":"LogicalSessionCacheRefresh","msg":"createCollection","attr":{"namespace":"config.system.sessions","uuidDisposition":"generated","uuid":{"uuid":{"$uuid":"d720a9f0-a02b-49cb-8908-a6f5b9277742"}},"options":{}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.610+00:00"},"s":"I",  "c":"CONTROL",  "id":20712,   "ctx":"LogicalSessionCacheReap","msg":"Sessions collection is not set up; waiting until next sessions reap interval","attr":{"error":"NamespaceNotFound: config.system.sessions does not exist"}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.624+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"LogicalSessionCacheRefresh","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"config.system.sessions","index":"_id_","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:34.624+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"LogicalSessionCacheRefresh","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"config.system.sessions","index":"lsidTTLIndex","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
my-app-backend-1   |
my-app-backend-1   | > backend@1.0.0 start /app
my-app-backend-1   | > node index.js
my-app-backend-1   |
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:35.528+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"172.20.0.3:49816","connectionId":1,"connectionCount":1}}
my-app-backend-1   | Server up and running on port 8080
my-app-backend-1   | (node:17) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
my-app-backend-1   | (node:17) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
my-app-mongodb-1   | {"t":{"$date":"2021-11-07T19:45:35.532+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn1","msg":"client metadata","attr":{"remote":"172.20.0.3:49816","client":"conn1","doc":{"driver":{"name":"nodejs","version":"3.6.2"},"os":{"type":"Linux","name":"linux","architecture":"x64","version":"5.10.47-linuxkit"},"platform":"'Node.js v10.13.0, LE (legacy)"}}}
my-app-backend-1   | Connected to mongodb
my-app-frontend-1  |
my-app-frontend-1  | > frontend@0.1.0 start /app
my-app-frontend-1  | > react-scripts start
my-app-frontend-1  |
my-app-frontend-2  |
my-app-frontend-2  | > frontend@0.1.0 start /app
my-app-frontend-2  | > react-scripts start
my-app-frontend-2  |
my-app-frontend-2  | ℹ ｢wds｣: Project is running at http://172.20.0.4/
my-app-frontend-2  | ℹ ｢wds｣: webpack output is served from
my-app-frontend-2  | ℹ ｢wds｣: Content not from webpack is served from /app/public
my-app-frontend-2  | ℹ ｢wds｣: 404s will fallback to /
my-app-frontend-2  | Starting the development server...
my-app-frontend-2  |
my-app-frontend-1  | ℹ ｢wds｣: Project is running at http://172.20.0.5/
my-app-frontend-1  | ℹ ｢wds｣: webpack output is served from
my-app-frontend-1  | ℹ ｢wds｣: Content not from webpack is served from /app/public
my-app-frontend-1  | ℹ ｢wds｣: 404s will fallback to /
my-app-frontend-1  | Starting the development server...
my-app-frontend-1  |
my-app-frontend-2  | Browserslist: caniuse-lite is outdated. Please run:
my-app-frontend-2  | npx browserslist@latest --update-db
my-app-frontend-1  | Browserslist: caniuse-lite is outdated. Please run:
my-app-frontend-1  | npx browserslist@latest --update-db
my-app-frontend-1  |
my-app-frontend-1  | Why you should do it regularly:
my-app-frontend-1  | https://github.com/browserslist/browserslist#browsers-data-updating
my-app-frontend-2  |
my-app-frontend-2  | Why you should do it regularly:
my-app-frontend-2  | https://github.com/browserslist/browserslist#browsers-data-updating
my-app-frontend-2  | Compiled successfully!
my-app-frontend-2  |
my-app-frontend-2  | You can now view frontend in the browser.
my-app-frontend-2  |
my-app-frontend-2  |   Local:            http://localhost:3000
my-app-frontend-2  |   On Your Network:  http://172.20.0.4:3000
my-app-frontend-2  |
my-app-frontend-2  | Note that the development build is not optimized.
my-app-frontend-2  | To create a production build, use yarn build.
my-app-frontend-2  |
my-app-frontend-1  | Compiled successfully!
my-app-frontend-1  |
my-app-frontend-1  | You can now view frontend in the browser.
my-app-frontend-1  |
my-app-frontend-1  |   Local:            http://localhost:3000
my-app-frontend-1  |   On Your Network:  http://172.20.0.5:3000
my-app-frontend-1  |
my-app-frontend-1  | Note that the development build is not optimized.
my-app-frontend-1  | To create a production build, use yarn build.
my-app-frontend-1  |
```

Para ver el puerto que nos ha asignado para los dos front-ends:

```bash
docker ps
CONTAINER ID   IMAGE                   COMMAND                  CREATED         STATUS             PORTS                     NAMES
35eb3d49a0ba   my-app_frontend         "/bin/sh -c 'npm sta…"   6 minutes ago   Up 6 minutes       0.0.0.0:53793->3000/tcp   my-app-frontend-2
bfd68a878088   my-app_frontend         "/bin/sh -c 'npm sta…"   6 minutes ago   Up 6 minutes       0.0.0.0:53792->3000/tcp   my-app-frontend-1
d0af19c9c76f   my-app_backend          "/bin/sh -c 'npm sta…"   6 minutes ago   Up 6 minutes       0.0.0.0:8080->8080/tcp    my-app-backend-1
0a2266b06418   mongo:latest            "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes       27017/tcp                 my-app-mongodb-1
```

Vemos que:

- 0.0.0.0:53793->3000/tcp my-app-frontend-2
- 0.0.0.0:53792->3000/tcp my-app-frontend-1

Podemos agrupar los contenedores y las imagenes creadas con el flag `--project-name`, para ponerle nombre:

```bashdocker compose --project-name my-wordpress up -d
[+] Building 1.8s (17/17) FINISHED                                                                                                                      => [my-wordpress_backend internal] load build definition from Dockerfile
 => => transferring dockerfile: 181B
 => [my-wordpress_frontend internal] load build definition from Dockerfile
 => => transferring dockerfile: 181B
 => [my-wordpress_backend internal] load .dockerignore
 => => transferring context: 2B
 => [my-wordpress_frontend internal] load .dockerignore
 => => transferring context: 34B
 => [my-wordpress_frontend internal] load metadata for docker.io/library/node:10.13-alpine
 => [auth] library/node:pull token for registry-1.docker.io
 => [my-wordpress_frontend 1/5] FROM docker.io/library/node:10.13-alpine@sha256:22c8219b21f86dfd7398ce1f62c48a022fecdcf0ad7bf3b0681131bd04a023a2
 => [my-wordpress_frontend internal] load build context
 => => transferring context: 1.17MB
 => [my-wordpress_backend internal] load build context
 => => transferring context: 25.76kB
 => CACHED [my-wordpress_frontend 2/5] WORKDIR /app
 => CACHED [my-wordpress_backend 3/5] COPY [package.json, package-lock.json*, ./]
 => CACHED [my-wordpress_backend 4/5] RUN npm install
 => CACHED [my-wordpress_backend 5/5] COPY . .
 => [my-wordpress_frontend] exporting to image
 => => exporting layers
 => => writing image sha256:69fe20088e2f7dd837b69d2940a2ce4f65cae7193fd735cc2bb8890b8c8d9203
 => => naming to docker.io/library/my-wordpress_backend
 => => writing image sha256:bea59083593edbe3732fc0847d1cf684265e4a1f039283efc14d9a21d732593c
 => => naming to docker.io/library/my-wordpress_frontend
 => CACHED [my-wordpress_frontend 3/5] COPY [package.json, package-lock.json*, ./]
 => CACHED [my-wordpress_frontend 4/5] RUN npm install
 => CACHED [my-wordpress_frontend 5/5] COPY . .

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
[+] Running 5/5
 ⠿ Network my-wordpress_default       Created
 ⠿ Container my-wordpress-mongodb-1   Started
 ⠿ Container my-wordpress-backend-1   Started
 ⠿ Container my-wordpress-frontend-2  Started
 ⠿ Container my-wordpress-frontend-1  Started
```

Para reiniciar todos los contenedores que pertenecen a esta aplicación:

```bash
docker-compose -p my-wordpress restart
[+] Running 4/4
 ⠿ Container my-wordpress-mongodb-1   Started
 ⠿ Container my-wordpress-backend-1   Started
 ⠿ Container my-wordpress-frontend-2  Started
 ⠿ Container my-wordpress-frontend-1  Started
```
