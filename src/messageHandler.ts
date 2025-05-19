import { Context } from 'grammy';
import { Journeys, UserState } from './handlers/state';
import {
  handleRegistration,
  processRegistrationHandler,
} from './handlers/registrationHandler';

export interface RegistrationHandlerResponse {
  message: string;
  newUserState: UserState | undefined;
}

/**
 * Handles user messages based on the journey the user is currently in.
 * @param ctx - The context of the message.
 * @param userState - The current state of the user.
 * @param userMessage - The message sent by the user.
 * @param userId - The ID of the user.
 * @returns An object containing the message and the new state of the user.
 */
export const handleMessage = async (
  ctx: Context,
  userState: UserState,
  userMessage: string,
): Promise<RegistrationHandlerResponse> => {
  if (userMessage === '/cancel') {
    return {
      message:
        'Process has been canceled! You can start over by typing /start.',
      newUserState: undefined,
    };
  }
  switch (userState.journey) {
    case Journeys.registration:
      const registrationResponse = await handleRegistration(
        ctx,
        userState.step,
        userMessage,
      );
      const { message, newUserState } =
        processRegistrationHandler(registrationResponse);

      return {
        message:
          message +
          '\n---\nYou can cancel registration anytime by typing /cancel.',
        newUserState,
      };
    default:
      return {
        message:
          'Something went wrong. Please try again. (handleMessage)',
        newUserState: userState,
      };
  }
};
