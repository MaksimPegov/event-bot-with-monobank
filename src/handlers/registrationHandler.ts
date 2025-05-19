import { Context } from 'grammy';
import { Journeys, RegistrationSteps } from './state';
import {
  validateEmail,
  validatePhone,
} from '../helpers/registrationHelpers';
import { validatePayment } from '../helpers/paymentsHelper';

export interface RegistrationHandlerResponse {
  message: string;
  newStep: RegistrationSteps;
}

/**
 * Handles user messages in case of registration journey.
 * @param ctx - The context of the message.
 * @param step - The current step of the registration process.
 * @param userMessage - The message sent by the user.
 * @param userId - The ID of the user.
 * @returns An object containing the message and the new step of the registration process.
 */
export const handleRegistration = async (
  ctx: Context,
  step: RegistrationSteps,
  userMessage: string,
): Promise<{
  message: string;
  newStep: RegistrationSteps;
}> => {
  switch (step) {
    case RegistrationSteps.awaiting_name:
      return {
        message: `Great ${userMessage}, we almost there! We need is your email address.`,
        newStep: RegistrationSteps.awaiting_email,
      };

    case RegistrationSteps.awaiting_email:
      if (validateEmail(userMessage)) {
        return {
          message:
            'Thank you! Your email has been verified. Please send your phone number.',
          newStep: RegistrationSteps.awaiting_phone,
        };
      } else {
        return {
          message: 'The email you provided is invalid.',
          newStep: step,
        };
      }

    case RegistrationSteps.awaiting_phone:
      const phone = userMessage.replace(/[\s\-()]/g, '');
      if (validatePhone(phone)) {
        return {
          message:
            'Thank you! Your phone number has been verified successfully.\nNow perform the payment and send me a screenshot of the transfer.',
          newStep: RegistrationSteps.awaiting_payment,
        };
      } else {
        return {
          message:
            'The phone number you provided is invalid. Please send a valid phone number.',
          newStep: step,
        };
      }

    case RegistrationSteps.awaiting_payment:
      // if (userMessage !== 'confirm') {
      //   return {
      //     message:
      //       'Please confirm your payment by typing "/confirm".',
      //     newStep: step,
      //   };
      // }

      return await validatePayment(ctx);

    default:
      return {
        message:
          'Hmm... Something went wrong. (handleRegistration)',
        newStep: step,
      };
  }
};

/**
 * Processes the response from the registration handler.
 * Sometimes we need to clear the user state, sometimes we need to keep it.
 * @param response - The response from the handleRegistration.
 * @returns An object containing the message and the new user state.
 */
export const processRegistrationHandler = (
  response: RegistrationHandlerResponse,
) => {
  if (response.newStep === RegistrationSteps.registered) {
    return {
      message: response.message,
      newUserState: undefined,
    };
  }

  return {
    message: response.message,
    newUserState: {
      journey: Journeys.registration,
      step: response.newStep,
    },
  };
};
