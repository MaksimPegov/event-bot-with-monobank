import { Bot, InlineKeyboard } from 'grammy';
import { config } from 'dotenv';
import { handleMessage } from './messageHandler';
import {
  RegistrationSteps,
  Journeys,
  UserState,
} from './routers/state';

// Load environment variables from ~/.zshrc
config();

const bot = new Bot(process.env.BOT_TOKEN || ''); // Ensure BOT_TOKEN is set in the .env file

export const USER_STATES = new Map<
  number,
  UserState | undefined
>(); // userId -> state

const inlineKeyboard = new InlineKeyboard().text(
  'REGISTER',
  'register',
);

// Handle the /start command.
bot.command('start', async (ctx) => {
  await ctx.replyWithPhoto(
    'https://media.licdn.com/dms/image/v2/D4D22AQEJQ_mqN4VY4A/feedshare-shrink_2048_1536/B4DZX9YfhWGkAw-/0/1743712814429?e=1750291200&v=beta&t=BF1m3T-Jx4YYeysgd6DeIIRcQWDW9GoayLz_TExtNo4', // Replace with the URL or file path of your image
    {
      caption:
        'Hello lady/gentlemen! I am a bot that can register you for an event by Olena Mir!',
      parse_mode: 'HTML',
      reply_markup: inlineKeyboard,
    },
  );
});

// Handle the /register command.
bot.callbackQuery('register', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  // Set the user's state to 'awaiting_name'
  USER_STATES.set(userId, {
    journey: Journeys.registration,
    step: RegistrationSteps.awaiting_name,
    user: { id: userId }, // Initialize with an empty user object
    // step: RegistrationSteps.awaiting_payment,
  });

  ctx.reply(
    'Please send your name so we can register you for the event.\nYou can cancel registration process anytime by typing /cancel.',
    { parse_mode: 'HTML' },
  );
});

// Handle the /help command.
bot.command('help', (ctx) =>
  ctx.reply('For help, please contact Olena Mir.', {
    parse_mode: 'HTML',
  }),
);

// Handle other messages.
bot.on('message', async (ctx) =>
  // Check if the user is in the 'awaiting_name' state
  {
    const userId = ctx.from?.id;
    if (!userId) return;

    const state = USER_STATES.get(userId);
    if (!state) {
      ctx.reply(
        'Oh! I am not sure what you mean. Please use /commands to see the list of commands.',
        { parse_mode: 'HTML' },
      );
      return;
    }

    const input = ctx.message?.text;
    if (!input) {
      ctx.reply(
        'Hmm... I am not sure what you mean. Please verify your message and try again.',
        { parse_mode: 'HTML' },
      );
      return;
    }

    const { message, newUserState } = await handleMessage(
      ctx,
      state,
      input,
    );
    ctx.reply(message, { parse_mode: 'HTML' });
    USER_STATES.set(userId, newUserState);
  },
);

bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Get started with the bot',
  },
  {
    command: 'help',
    description: 'Contact information for help',
  },
]);

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
