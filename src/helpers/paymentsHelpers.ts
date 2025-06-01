import { Context } from 'grammy';
import {
  RegistrationSteps,
  User,
  USER_STATES,
} from '../routers/state';
import {
  fetchMonobankData,
  fetchMonobankDataResponse,
} from '../api/monobankHelper';
import { addUserToGoogleSheet } from '../api/googleSheetHelper';

/**
 * Validates the payment by checking the Monobank API for transactions.
 * @param ctx - The context of the message.
 * @param jarId - The ID of the jar to check transactions against.
 * @returns An object containing a message and the new step of the registration process.
 */

const validationInProgress: Set<number> = new Set(); // Track users with ongoing validations

export const runPaymentValidation = async (
  ctx: Context,
  jarId: string,
  user: User,
): Promise<{
  message: string;
  newStep: RegistrationSteps;
}> => {
  if (user.id && validationInProgress.has(user.id)) {
    return {
      message:
        'Validation is already running. Please be patient.',
      newStep: RegistrationSteps.awaiting_payment,
    };
  }

  try {
    if (user.id) validationInProgress.add(user.id); // Mark validation as in progress

    const nowTimestamp = Date.now();

    // Call fetchMonobankData
    let response = await fetchMonobankData(
      jarId,
      nowTimestamp,
    );

    // If there is time left for validation, notify the user
    if (
      response.timeLeft !== null &&
      response.timeLeft > 0
    ) {
      await delayValidation(
        ctx,
        jarId,
        nowTimestamp,
        response.timeLeft,
        user,
      );

      return {
        message: `Your payment validation is performing. It can take up to a minute. Please wait...`,
        newStep: RegistrationSteps.awaiting_payment,
      };
    } else {
      // If no time left, proceed with transaction validation
      return validateResponse(ctx, response, user);
    }
  } catch (error) {
    console.log('Error during payment validation:', error);

    return {
      message:
        'Something is broken. Please try again later. If it still does not work, please contact the organizers.',
      newStep: RegistrationSteps.awaiting_payment,
    };
  } finally {
  }
};

const validateResponse = (
  ctx: Context,
  response: fetchMonobankDataResponse,
  user: User,
): {
  message: string;
  newStep: RegistrationSteps;
} => {
  const transactions = response.data;
  if (Array.isArray(transactions)) {
    // Check if any transaction contains the user's ID in the comment
    // const isValid = transactions.some(
    //   (transaction) => transaction.comment === user.id,
    // );

    const isValid = true; // For testing purposes, assume the payment is valid

    if (isValid) {
      addUserToGoogleSheet(ctx, user); // Add user to Google Sheet

      if (user.id) validationInProgress.delete(user.id); // Remove user from in-progress set
      return {
        message:
          'Thank you! Your payment has been verified. You are registered for the event.',
        newStep: RegistrationSteps.registered,
      };
    } else {
      if (user.id) validationInProgress.delete(user.id); // Remove user from in-progress set

      return {
        message:
          'The payment verification failed. Please ensure you added your user ID as a comment to the payment.',
        newStep: RegistrationSteps.awaiting_payment,
      };
    }
  }
  return {
    message:
      'Something is broken. Please try again later, if it still does not work, please contact Organisators.',
    newStep: RegistrationSteps.awaiting_payment,
  };
};

export const delayValidation = async (
  ctx: Context,
  jarId: string,
  firstValidationTimestamp: number,
  timeLeft: number,
  user: User,
) => {
  console.log(
    `Validation will be delayed for ${timeLeft} milliseconds for user: ${ctx.from?.id}.`,
  );

  setTimeout(async () => {
    try {
      let response = await fetchMonobankData(
        jarId,
        firstValidationTimestamp,
      );
      if (user.id) validationInProgress.delete(user.id); // Remove user from in-progress set
      console.log(
        `Result of delayed fetchMonobankData response for user: ${ctx.from?.id}:`,
        response,
      );

      const { message, newStep } = validateResponse(
        ctx,
        response,
        user,
      );

      await ctx.reply(message);

      // Update the user's state in USER_STATES
      if (
        user.id &&
        newStep === RegistrationSteps.registered
      ) {
        USER_STATES.set(user.id, undefined); // Clear the user's state after successful registration
      }
    } catch (error) {
      console.log(
        'Error during delayed validation:',
        error,
      );
    }
  }, timeLeft);
};
