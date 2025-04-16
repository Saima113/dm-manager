const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

// Analyze one message and return its classification
async function classifyMessage(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that classifies LinkedIn DMs as 'genuine', 'spam', or 'low priority'.",
        },
        {
          role: "user",
          content: `Message: "${message}"\nClassify this message:`,
        },
      ],
    });

    const classification = response.choices[0].message.content.trim();
    return classification;
  } catch (err) {
    console.error("OpenAI error:", err);
    return "error";
  }
}

module.exports = classifyMessage;
