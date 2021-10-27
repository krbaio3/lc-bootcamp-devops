docker mongo

docker run -d --name some-mongo \  
 -p 27017:27017 \
 mongo

instalacion local mongoCompass
introducir datos mongoCompass
user/pass
create database TopicstoreDb
create collection Topics
add structure

instalar dotnet
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install apt-transport-https
sudo apt install dotnet-sdk-3.1

instalar node

MONGO
$ docker run -it --network lemoncode-challenge --rm mongo mongo --host some-mongo -v /my/own/datadir:/data/db test
URL mongodb://some-mongo:27017
/data/db.
