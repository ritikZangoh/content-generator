#!/bin/bash

cd backend

gunicorn -k eventlet -w 1 runServer:app &

sleep 6

cd ..
cd frontend

npm run dev
