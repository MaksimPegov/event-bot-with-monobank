# Upload the google_api_credentials.json file to the Fly.io machine, ensuring it overwrites if it exists
flyctl ssh console << 'EOF'
rm -f /app/credentials/google_api_credentials.json
mkdir -p /app/credentials
exit
EOF

flyctl ssh sftp shell << 'EOF'
put google_api_credentials.json /app/credentials/google_api_credentials.json
EOF