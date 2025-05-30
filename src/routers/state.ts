export type UserState = {
  journey: Journeys;
  step: RegistrationSteps;
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
