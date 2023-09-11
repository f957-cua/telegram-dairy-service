import OpenAI from 'openai';
import config from 'config';

const CHATGPT_MODEL = "gpt-3.5-turbo";
const ROLES = {
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    USER: 'user'
}

const openai = new OpenAI({
  apiKey: config.get("OPENAI_KEY"),
});

const getMessage = (m) => `
    Write supporting following thesis consecutive emotional story: ${m}

    These thesis described key moments of the day.
    You should develope those story, which I can publish on social media, or tell my friends.
    Story should be emotional, consistent and contain not more than 100 words.
    First a full follow by the context of thesis.
`

export default async function chatGPT(message = '') {
    const messages = [{
        role: ROLES.SYSTEM,
        content: "You are experienced copywriter, who is writing short emotional articles for social media"
    }, {
        role: ROLES.USER,
        content: getMessage(message)
    }]
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error while chat completion', error.message)
  }
}
