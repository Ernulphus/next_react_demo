#!/bin/sh
# Run your React frontend against a local API server.
export NEXT_PUBLIC_URL_PRE="http://127.0.0.1:8000"
echo 'NEXT_PUBLIC_URL_PRE="http://127.0.0.1:8000"' > .env.local
echo 'Connecting to backend:'
echo $NEXT_PUBLIC_URL_PRE
npm run dev