#!/bin/bash

sudo systemctl start docker
docker run \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -e MYSQL_DATABASE=primary \
    -e MYSQL_USER=user \
    -e MYSQL_PASSWORD=password \
    -p 3306:3306 \
    -v /path/to/mysql/data:/var/lib/mysql mysql:latest 
