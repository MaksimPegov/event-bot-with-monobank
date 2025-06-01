import { google } from 'googleapis';
import fs from 'fs';
import { User } from '../routers/state';
import { Context } from 'grammy';

import dotenv from 'dotenv';

dotenv.config();

// Authenticate with Google API
const authenticateGoogle = () => {
  const credentialsPath =
    process.env.GOOGLE_CREDENTIALS_PATH ||
    'google_api_credentials.json';
  const credentials = JSON.parse(
    fs.readFileSync(credentialsPath, 'utf8'),
  );
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
  return auth;
};

// Insert user information into a Google Sheet
const insertUserInfoToGoogleSheet = async (user: User) => {
  const auth = authenticateGoogle();
  const sheets = google.sheets({ version: 'v4', auth });

  // Replace with your Google Sheet ID
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID || '';

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1', // Replace with your sheet name
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          [
            user.email ?? 'unknown email',
            user.phone ?? 'unknown phone',
            user.name ?? 'unknown name',
            new Date().toISOString(),
          ],
        ],
      },
    });
    console.log(
      'User information inserted into Google Sheet.',
    );
  } catch (error) {
    console.error(
      'Error inserting user information into Google Sheet:',
      error,
    );
  }
};

export const addUserToGoogleSheet = async (
  ctx: Context,
  user: User,
) => {
  try {
    await insertUserInfoToGoogleSheet(user);
  } catch (error) {
    console.error(
      'Error while inserting user information into Google Sheet:',
      error,
    );

    ctx.reply(
      'We validated your payment but there was an error while adding you as a participant to our list. Please contact organizers with this problem.',
    );
  }
};
