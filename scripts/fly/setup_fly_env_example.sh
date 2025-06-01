flyctl secrets set BOT_TOKEN=
flyctl secrets set MONOBANK_API_TOKEN=
flyctl secrets set JAR_LINK=
flyctl secrets set JAR_ID=
flyctl secrets set GOOGLE_SPREADSHEET_ID=
flyctl secrets set GOOGLE_CREDENTIALS_PATH=/app/credentials/google_api_credentials.json

flyctl volumes create google_credentials --size 1 --region waw --yes