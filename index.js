const { App } = require("@slack/bolt");
const { Configuration, OpenAIApi } = require("openai");

// Initialize the Slack bot
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the OpenAI API
const openaiApi = new OpenAIApi(configuration);

app.event('app_mention', async ({ event, context, client, say }) => {
  const text = event.text.replace(/<@.*?> /, "");
  console.log(`message received: ${text}`);
  // Check if the message is a question
  try {
    // Generate a response using the GPT-3.5 API
    const response = await openaiApi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: text}
      ]
    });
    console.log(response.data.choices[0].message.content);

    say(response.data.choices[0].message.content);
  } catch (error) {
    console.log(error);
    if (error.response) {
      say(error.reponse.data.message);
    }
  }
});

// Start the bot
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("Bot is running!");
})();

