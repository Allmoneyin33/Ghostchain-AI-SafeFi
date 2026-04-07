import { GoogleGenAI } from "@google/genai";
import { Transaction, ChatMessage } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiAgent = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const generateFinancialAdvice = async (
  transactions: Transaction[],
  userMessage: string,
  history: ChatMessage[]
) => {
  const ai = getGeminiAgent();
  
  const systemInstruction = `
    You are LiquidAgent, a world-class financial strategist and cash flow expert.
    Your goal is to help the user optimize their cash flow, identify saving opportunities, and build wealth.
    
    Current Financial Data:
    ${JSON.stringify(transactions, null, 2)}
    
    Guidelines:
    1. Be precise, strategic, and encouraging.
    2. Analyze the provided transactions to give specific advice.
    3. If the user asks about a "what-if" scenario (e.g., "What if I buy a car?"), simulate the impact based on their current flow.
    4. Use Markdown for formatting.
    5. Keep responses concise but high-value.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
};
