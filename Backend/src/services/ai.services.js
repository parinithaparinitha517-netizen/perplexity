import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

// Gemini (Title Generator)
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7,
});

// Mistral (Chat Model)
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0.7,
});

export async function generateChatTitle(firstMessage) {
  try {
    const response = await mistralModel.invoke([
      new SystemMessage(
        "Generate a short chat title (maximum 8 words). Return only the title."
      ),
      new HumanMessage(firstMessage),
    ]);

    return response.content;
  } catch (error) {
    console.error("Title Error:", error);
    throw new Error("Failed to generate title");
  }
}

export async function generateResponses(messages) {
  try {

    const formattedMessages = [
      new SystemMessage(
        "You are a helpful AI assistant. Answer clearly and accurately."
      ),
    ];

    for (const message of messages) {

      if (message.role === "user") {
        formattedMessages.push(
          new HumanMessage(message.content)
        );
      }

      else if (message.role === "assistant") {
        formattedMessages.push(
          new AIMessage(message.content)
        );
      }

      else {
        formattedMessages.push(
          new SystemMessage(message.content)
        );
      }
    }

    const response = await mistralModel.invoke(formattedMessages);

    return response.content;

  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate AI response");
  }
}