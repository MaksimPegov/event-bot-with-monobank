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

To build and run your bot:

```bash
./build_and_run.sh
```

This script will compile your TypeScript code (if needed) and start the bot.

---

## 🛠 Project Structure (Simplified)

```
src/
├── api/
├── routers/
├── helpers/
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
