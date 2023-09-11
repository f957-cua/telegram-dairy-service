import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import chatGPT from './chatgpt.js';
import createNotion from './notion.js';
import Loader from './loader.js';
import config from 'config';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
    handlerTimeout: Infinity,
})

bot.command('start', ctx => {
    ctx.reply('Welcome to the dairy creator GPT. Type the most impressed daily environment and receive completed story stored in notion due to link')
});

bot.on(message('text'), async (ctx) => {
    try {
        const text = ctx.message.text;
        if (!text.trim()) return ctx.reply('Your message was empty, type something and send again');

        const loader = new Loader(ctx);
        loader.show();

        const responseGpt = await chatGPT(text);
        if (!responseGpt) return ctx.reply('Api error with GPT server')

        const responseNotion = await createNotion(text, responseGpt.content);

        loader.hide();

        ctx.reply(`Your notion page: ${responseNotion.url}`);
    } catch (e) {
        ctx.reply('Error while processing text: ', e.message)
    }
})

bot.launch();