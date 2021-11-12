docker mongo

docker run -dit --rm --network lemoncode-challenge --name some-mongo \
 -p 27017:27017 \
 --mount type=bind,source="$(pwd)"/../db_data,target=/data/db \
 mongo

docker run -d --name some-mongo \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=root \
 -e MONGO_INITDB_ROOT_PASSWORD=qwerty \
 mongo

instalacion local mongoCompass
introducir datos mongoCompass
user/pass
create database TopicstoreDb
create collection Topics
add Topics.json to mongoCompass

instalar dotnet
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install apt-transport-https
sudo apt install dotnet-sdk-3.1

instalar node

MONGO

<!-- $ docker run -dit --network lemoncode-challenge --rm mongo mongo --host some-mongo -v /my/own/datadir:/data/db test
URL mongodb://some-mongo:27017
/data/db. -->

$ docker run -dit --rm --network lemoncode-challenge --name some-mongo \
 -p 27017:27017 \
 --mount type=bind,source="$(pwd)"/../db_data,target=/data/db \
 mongo

BACKEND
$ docker run -dit --rm --network lemoncode-challenge --name backend \
--publish-all \
backend

FRONTEND
$ docker run -dit --rm --network lemoncode-challenge --name frontend \
--publish-all \
frontend

## docker run --rm -dit --network lemoncode-challenge --name some-mongo -p 27017:27017/tcp mongo:latest

No sé como se meten variables de entorno en .NET, tengo que buscar para meter la variable ENV en el dockerfile
