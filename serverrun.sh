docker pull chunglv42/gapita:latest
docker stop gapita
docker rm gapita
docker run --name gapita -itd -p 9191:80 chunglv42/gapita:latest