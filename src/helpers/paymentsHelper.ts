import { RegistrationSteps } from '../handlers/state';
import Tesseract from 'tesseract.js';
import OpenAI from 'openai';
import { Context } from 'grammy';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const validatePayment = async (
  ctx: Context,
): Promise<{
  message: string;
  newStep: RegistrationSteps;
}> => {
  try {
    // Check if the message contains a file
    if (!ctx.message?.document && !ctx.message?.photo) {
      throw new Error(
        'No file found in the message. Please send an image of the payment.',
      );
    }

    // Retrieve file metadata from Telegram
    const file = await ctx.getFile();
    const filePath = file.file_path;

    if (!filePath) {
      throw new Error('File path is undefined.');
    }

    // Download the file from Telegram servers
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });

    // Save the file locally for Tesseract.js processing
    const localFilePath = path.join(
      __dirname,
      'temp_image.png',
    );
    await fs.writeFile(localFilePath, response.data);

    // Extract text from the image using Tesseract.js
    const {
      data: { text },
    } = await Tesseract.recognize(localFilePath, 'eng'); // Changed language to 'eng' for better support

    // Clean up the temporary file
    await fs.unlink(localFilePath);

    // Use OpenAI to validate the extracted text
    const prompt = `Validate the following text for a completed transfer: "${text}" Respond with 'valid' if the text meets the criteria, otherwise respond with 'invalid'.`;
    const responseAI = await openai.chat.completions.create(
      {
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content:
              'You are a payment validation assistant.',
          },
          { role: 'user', content: prompt },
        ],
      },
    );

    const validation =
      responseAI.choices[0].message?.content?.trim();

    if (validation === 'valid') {
      return {
        message:
          'Thank you! Your payment has been verified. You are registered for the event.',
        newStep: RegistrationSteps.registered,
      };
    } else {
      return {
        message:
          'The payment verification failed. Please ensure the image clearly shows a completed transfer of the bank name Monobank.',
        newStep: RegistrationSteps.awaiting_payment,
      };
    }
  } catch (error) {
    console.error(
      'Error during payment validation:',
      error,
    );
    return {
      message:
        'An error occurred during payment validation. Please try again later.',
      newStep: RegistrationSteps.awaiting_payment,
    };
  }
};
