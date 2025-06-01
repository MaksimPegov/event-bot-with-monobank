export type User = {
  id: number;
  email?: string;
  phone?: string;
  name?: string;
};

export type UserState = {
  journey: Journeys;
  step: RegistrationSteps;
  user: User;
};

export enum Journeys {
  registration = 'registration',
}

export enum RegistrationSteps {
  awaiting_name = 'awaiting_name',
  awaiting_phone = 'awaiting_phone',
  awaiting_email = 'awaiting_email',
  awaiting_payment = 'awaiting_payment',
  registered = 'registered',
}

export const USER_STATES = new Map<
  number,
  UserState | undefined
>();
