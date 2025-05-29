import { Context } from 'grammy';
import { RegistrationSteps } from '../handlers/state';
import { fetchMonobankData } from './monobankHelper';

/**
 * Validates the payment by checking the Monobank API for transactions.
 * @param ctx - The context of the message.
 * @param jarId - The ID of the jar to check transactions against.
 * @returns An object containing a message and the new step of the registration process.
 */

export const validatePayment = async (
  ctx: Context,
  jarId: string,
): Promise<{
  message: string;
  newStep: RegistrationSteps;
}> => {
  try {
    const nowTimestamp = Math.floor(Date.now() / 1000);

    // Call fetchMonobankData
    let response = await fetchMonobankData(
      jarId,
      nowTimestamp,
    );

    // If timeLeft is returned, notify the user and update the message in real time
    if (
      response.timeLeft !== null &&
      response.timeLeft > 0
    ) {
      const message = await ctx.reply(
        `Your payment validation is performing. ${response.timeLeft} seconds left. Please wait...`,
      );

      // this blocks event loop
      for (let i = response.timeLeft; i > 0; i--) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000),
        );
        await ctx.api.editMessageText(
          ctx.chat?.id!,
          message.message_id,
          `Your payment validation is performing. ${i - 1} seconds left. Please wait...`,
        );
      }

      // Perform another call to fetchMonobankData after waiting
      response = await fetchMonobankData(
        jarId,
        nowTimestamp,
      );

      if (
        response.timeLeft !== null &&
        response.timeLeft > 0
      ) {
        return {
          message:
            'Something went wrong during payment validation. Please try again later.',
          newStep: RegistrationSteps.awaiting_payment,
        };
      }
    }

    // Proceed with transaction validation
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
    }

    throw new Error(
      'Unexpected response format from Monobank API.',
    );
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
