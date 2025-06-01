docker build -t 2cg-bot-monobank .

docker run \
  --name 2cg-bot-container \
  --env-file .env \
  -v $(pwd)/google_api_credentials.json:/app/google_api_credentials.json \
  2cg-bot-monobank