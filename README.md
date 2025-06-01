# 💬 Telegram Bot (Grammy.js + Monobank + Google Sheets)

This is a Telegram bot built with [grammY](https://grammy.dev/), designed to verify payments from a Monobank "jar" and add users to a Google Spreadsheet.

---

## ✅ Features

- 🏦 Verifies payments made to a Monobank jar
- 📋 Automatically records user data in a Google Sheet
- 🤖 Built with [grammY](https://grammy.dev/)
- 🔐 Uses a service account to authenticate with the Google Sheets API

---

## ⚙️ Requirements

- Node.js (v18+ recommended)
- Monobank Jar (token + jar ID + link)
- Telegram Bot token (from @BotFather)
- Google Service Account with access to Google Sheets

---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-bot-repo.git
cd your-bot-repo
```

---

### 2. Set Up Environment Variables

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Fill in the following values in `.env`:

| Key                  | Description                            |
| -------------------- | -------------------------------------- |
| `BOT_TOKEN`          | Your Telegram bot token from BotFather |
| `MONOBANK_API_TOKEN` | Monobank token of the jar owner        |
| `MONOBANK_JAR_ID`    | The Jar ID (from Monobank)             |
| `MONOBANK_JAR_LINK`  | The public Jar link                    |
| `SPREADSHEET_ID`     | The ID of your Google Spreadsheet      |

---

### 3. Add Google API Credentials

You need a **service account key** to access Google Sheets from your bot.

#### How to Create One:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create or select a project

3. Enable the **Google Sheets API**

4. Go to **IAM & Admin > Service Accounts**

5. Click **"Create Service Account"**

   - Grant it basic permissions (e.g., "Editor")

6. After creating it:

   - Go to the "Keys" tab
   - Click **"Add Key > Create new key > JSON"**
   - Download the file and rename it to:

     ```bash
     google_api_credentials.json
     ```

7. Place `google_api_credentials.json` in the project root.

8. Share your Google Sheet with the **service account email**
   (e.g., `your-bot@your-project.iam.gserviceaccount.com`) with **Editor** access.

---

## 🚀 Run the Bot Locally

#### To build and run your bot with npm:

```bash
./scripts/local/build_and_run.sh
```

This script will compile your TypeScript code (if needed) and start the bot.

#### If you want to run the bot using docker:

```bash
./scripts/local/build_and_run_docker.sh
```

This script will build the Docker image and run the bot inside a container.

---

## 📦 Deploying to Fly.io

To deploy your bot to [Fly.io](https://fly.io/):

1. Make sure you have the [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/) installed and logged in.
2. Rename `scripts/fly/setup_fly_env_example.sh` to `scripts/fly/setup_fly_env.sh` and fill in the necessary environment variables in that file.
3. Setup your Fly environment:
   ```bash
   ./scripts/fly/setup_fly_env.sh
   ```
4. Deploy your bot:
   ```bash
   flyctl deploy
   ```
5. Provide your google_api_credentials.json file to Fly volume:
   ```bash
   ./scripts/fly/upload_credentials_file.sh
   ```
6. Get your machine's ID:
   ```bash
   flyctl status
   ```
7. Restart your bot:
   ```bash
   flyctl machines restart <your-machine-id>
   ```
8. Inspect logs:
   ```bash
   flyctl logs
   ```

---

## 🛠 Project Structure (Simplified)

```

src/
├── api/
├── routers/
├── helpers/
├── scripts/
| ├── local/
| └── fly/
├── bot.ts
├── ...
.env
google_api_credentials.json

```

---

## 🛯 Troubleshooting

- Make sure your `.env` and credentials are filled correctly
- Ensure the Google Sheet is shared with your service account
- Check logs printed by the bot for issues

---

## 📄 License

MIT – Use freely and contribute if you'd like!

```

```
