import { Context } from 'grammy';
import { Journeys, RegistrationSteps, User } from './state';
import {
  validateEmail,
  validatePhone,
} from '../helpers/registrationHelpers';
import dotenv from 'dotenv';
import { runPaymentValidation } from '../helpers/paymentsHelpers';

dotenv.config();

const jarLink = process.env.JAR_LINK || '';
const jarId = process.env.JAR_ID || '';

export interface RegistrationHandlerResponse {
  message: string;
  newStep: RegistrationSteps;
  user: User;
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
  user: User,
): Promise<RegistrationHandlerResponse> => {
  switch (step) {
    case RegistrationSteps.awaiting_name:
      return {
        message: `Great ${userMessage}, we're almost there! Please provide your email address.`,
        newStep: RegistrationSteps.awaiting_email,
        user: { ...user, name: userMessage },
      };

    case RegistrationSteps.awaiting_email:
      if (validateEmail(userMessage)) {
        return {
          message:
            'Thank you! Your email has been verified. Please send your phone number.',
          newStep: RegistrationSteps.awaiting_phone,
          user: { ...user, email: userMessage },
        };
      } else {
        return {
          message: 'The email you provided is invalid.',
          newStep: step,
          user,
        };
      }

    case RegistrationSteps.awaiting_phone:
      const phone = userMessage.replace(/[\s\-()]/g, '');
      if (validatePhone(phone)) {
        return {
          message: `Thank you! Your phone number has been verified successfully.\nFinal step: please donate to the JAR:\n${jarLink}\nIMPORTANT: Please provide this code as a comment to your donation: <b><code>${ctx.from?.id}</code></b>.\nType /confirm when you are done.`,
          newStep: RegistrationSteps.awaiting_payment,
          user: { ...user, phone },
        };
      } else {
        return {
          message:
            'The phone number you provided is invalid. Please send a valid phone number.',
          newStep: step,
          user,
        };
      }

    case RegistrationSteps.awaiting_payment:
      const { message, newStep } =
        await runPaymentValidation(ctx, jarId, user);
      return {
        message,
        newStep,
        user,
      };

    default:
      return {
        message: 'Hmm... Something went wrong.',
        newStep: step,
        user,
      };
  }
};

/**
 * Processes the response from the registration handler.
 * Sometimes we need to clear the user state, sometimes we need to keep it.
 * @param response - The response from the handleRegistration.
 * @returns An object containing the message and the new user state.
 */
export const processRegistrationHandlerResponse = (
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
      user: response.user,
    },
  };
};
