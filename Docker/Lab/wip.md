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
/data/db.

Se cambia en appsettings.json la url donde ataca a mongo
/data/db. -->

## docker run --rm -dit --network lemoncode-challenge --name some-mongo -p 27017:27017/tcp mongo:latest

No sé como se meten variables de entorno en .NET, tengo que buscar para meter la variable ENV en el dockerfile

#>docker cp Topics.json some--mongo:/tmp/topics.json

docker exec some-mongo cat /tmp/topics.json
[{
"_id": {
"$oid": "6190f85c4d4467c4deaa347f"
},
"Name": "Contenedores"
},{
"_id": {
"$oid": "61784541656594b2054a38d1"
},
"Name": "k8s"
}]

docker exec some-mongo mongoimport --db TopicstoreDb --collection Topics --file /tmp/topics.json

docker exec -it <container-name> mongo

#>docker exec <container-name-or-id> mongoimport -d <db-name> -c <c-name> --file /tmp/xxx.json
mongoimport --db users --collection contacts --file contacts.json
