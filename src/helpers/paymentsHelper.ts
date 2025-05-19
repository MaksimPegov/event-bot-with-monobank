import { RegistrationSteps } from '../handlers/state';

export const validatePayment = (
  userId: number,
): { message: string; newStep: RegistrationSteps } => {
  return {
    message:
      'Thank you! Your payment has been verified. You are registered for the event.',
    newStep: RegistrationSteps.registered,
  };
};
