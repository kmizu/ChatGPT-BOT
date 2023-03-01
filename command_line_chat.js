const { Configuration, OpenAIApi } = require("openai");
const { stdin, stdout } = require("process");

if(!process.env.OPENAI_API_KEY) return;

const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the OpenAI API
const openaiApi = new OpenAIApi(configuration);
const text = process.argv[0];

process.stdin.setEncoding("utf8");
var reader = require("readline").createInterface({
        input: process.stdin,
});

async function chat() {
        try {
                console.log("chat start");
                process.stdout.write('prompt: ');
                reader.on("line", async prompt => {
                        if(prompt === '' || prompt === null) {
                                console.log("Chat finished.  Thank you!");
                                process.exit(0);
                                return;
                        }
                        // Generate a response using the GPT-3.5 API
                        const response = await openaiApi.createChatCompletion({
                                model: "gpt-3.5-turbo",
                                messages: [
                                        {role: "user", content: prompt}
                                ]
                        });
                        console.log(response.data.choices[0].message.content);
                        process.stdout.write('input prompt: ');
                });
        } catch (error) {
                console.log(error);
                if (error.response) {
                        say(error.reponse.data.message);
                }
        }
}
(async () => {
        chat();
})();
