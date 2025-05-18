import { Bot } from 'grammy';
import fs from 'fs';
import { config } from 'dotenv';
import path from 'path';
import { start } from 'repl';

// Load environment variables from ~/.zshrc
config();

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.BOT_TOKEN || ''); // Ensure BOT_TOKEN is set in the .env file

const commands = {
  start: 'Back to the start',
  register: 'Register for the event',
  commands: 'List of commands',
  help: 'Contact information for help',
};

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command('start', async (ctx) => {
  await ctx.replyWithPhoto(
    'https://media.licdn.com/dms/image/v2/D4D22AQEJQ_mqN4VY4A/feedshare-shrink_2048_1536/B4DZX9YfhWGkAw-/0/1743712814429?e=1750291200&v=beta&t=BF1m3T-Jx4YYeysgd6DeIIRcQWDW9GoayLz_TExtNo4', // Replace with the URL or file path of your image
    {
      caption:
        'Hello lady/gentlemen! I am a bot that can register you for an event by Olena Mir!\n---\n/register - to register for the event',
      parse_mode: 'HTML',
    },
  );
});

bot.command('register', (ctx) =>
  ctx.reply('You are now attending the event.'),
);

// Handle the /commands command.
bot.command('commands', (ctx) => {
  const commandList = Object.entries(commands)
    .map(
      ([command, description]) =>
        `/${command} - ${description}`,
    )
    .join('\n');
  ctx.reply(
    `Here are the available commands:\n${commandList}`,
    { parse_mode: 'HTML' },
  );
});
// Handle other messages.
bot.on('message', (ctx) =>
  ctx.reply(
    'Oh! I am not sure what you mean. Please use /commands to see the list of commands.',
    { parse_mode: 'HTML' },
  ),
);

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
