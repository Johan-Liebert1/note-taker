#!/bin/bash

route=$1

if [[ -z $route ]]; then 
    echo "Required route to test..."
    exit 1
fi

base="http://localhost:3000"

case "$route" in
    "register")
        curl -X POST "$base/users/register" -H 'content-type: application/json' \
            -d '{"username": "user1", "password": "pass1", "email": "hello@example.com"}'
        ;;

    "login")
        curl -X POST "$base/users/login" -H 'content-type: application/json' \
            -d '{"password": "pass1", "email": "hello@example.com"}'
        ;;

    "create-note")
        token=$2
        curl -X POST "$base/notes/create" -H 'content-type: application/json' \
            -H "Authorization: Bearer $token" \
            -d '{ "title": "firstNote", "note": "this is a note" }'
        ;;

    *)
        echo "Route $route not recognised"
        ;;
esac
