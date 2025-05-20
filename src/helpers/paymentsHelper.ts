import { Context } from 'grammy';
import { RegistrationSteps } from '../handlers/state';
import axios from 'axios';

export const validatePayment = async (
  ctx: Context,
  jarId: string,
): Promise<{
  message: string;
  newStep: RegistrationSteps;
}> => {
  try {
    // Calculate timestamps for the last 30 days
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const timestamp30daysAgo =
      nowTimestamp - 30 * 24 * 60 * 60;

    // Make a request to the Monobank API
    const response = await axios.get(
      `https://api.monobank.ua/personal/statement/${jarId}/${timestamp30daysAgo}/${nowTimestamp}`,
      {
        headers: {
          'X-Token': process.env.MONOBANK_API_TOKEN || '',
        },
      },
    );
    console.log(
      'Response from Monobank API:',
      response.data,
    );

    // Check if the response contains the expected data
    const transactions = response.data;
    if (Array.isArray(transactions)) {
      const userId = ctx.from?.id?.toString();
      const isValid = transactions.some(
        (transaction) => transaction.comment === userId,
      );

      if (isValid) {
        return {
          message:
            'Thank you! Your payment has been verified. You are registered for the event.',
          newStep: RegistrationSteps.registered,
        };
      } else {
        return {
          message:
            'The payment verification failed. Please ensure you added your user ID as a comment to the payment.',
          newStep: RegistrationSteps.awaiting_payment,
        };
      }
    } else {
      throw new Error(
        'Unexpected response format from Monobank API.',
      );
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
