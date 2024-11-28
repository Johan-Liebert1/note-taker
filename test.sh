#!/bin/bash

set -x

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
        curl -X POST "$base/notes/create" -H 'content-type: application/json' \
            -H "Authorization: Bearer $token" \
            -d '{ "title": "firstNote", "note": "this is a note" }'
        ;;

    "get-all-notes")
        curl "$base/users/notes" -H "Authorization: Bearer $token"
        ;;

    "get-note-by-id")
        noteId=$2

        curl "$base/notes/$noteId" -H "Authorization: Bearer $token"
        ;;

    "update-note-title")
        noteId=$2

        curl -X PUT "$base/notes/update/$noteId" -H "Authorization: Bearer $token" -H 'content-type: application/json' \
            -d '{ "title": "This is new updated title once more" }'
        ;;

    "update-note-message")
        noteId=$2

        curl -X PUT "$base/notes/update/$noteId" -H "Authorization: Bearer $token" -H 'content-type: application/json'  \
            -d '{ "message": "This is new updated message" }'
        ;;

    "update-note")
        noteId=$2

        curl -X PUT "$base/notes/update/$noteId" -H "Authorization: Bearer $token"  -H 'content-type: application/json'   \
            -d '{ "title": "updated title", "message": "updated message" }'
        ;;

    *)
        echo "Route $route not recognised"
        ;;
esac
