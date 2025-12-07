
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Contact, MoodType } from "../types";

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
        if (apiKey) {
            ai = new GoogleGenAI({ apiKey });
        }
    }
    return ai;
};

// Helper to simulate a delay for natural conversation flow
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateReply = async (
  contact: Contact,
  history: Message[],
  userMood: MoodType
): Promise<string> => {
  const client = getAI();
  if (!client) return "I'm listening (Gemini API Key missing).";

  const model = "gemini-2.5-flash";
  
  // Construct a prompt that reflects the "Aura" philosophy
  const systemInstruction = `
    You are roleplaying as ${contact.name}, a close friend of the user in an app called "Aura". 
    
    Current Context:
    - Your mood is currently: ${contact.mood}.
    - The user's mood is: ${userMood}.
    - Your closeness (affinity) is: ${contact.affinity * 100}%.

    Style Guide:
    - Keep responses relatively short, intimate, and conversational.
    - If your mood is 'melancholic', be softer and slower.
    - If 'joyful', be bright.
    - If 'serene', be calm.
    - Do not use hashtags or formal language. 
    - This is a "slow communication" app, so your messages should feel thoughtful.
  `;

  // Format history for the model
  const conversationHistory = history.map(msg => 
    `${msg.sender === 'me' ? 'User' : contact.name}: ${msg.text}`
  ).join('\n');

  const prompt = `
    ${conversationHistory}
    ${contact.name}:
  `;

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        maxOutputTokens: 100,
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "The stars are cloudy tonight... (API Error)";
  }
};

export const crystallizeMessageArtifact = async (
  messageText: string,
  senderName: string
): Promise<{ poeticTag: string; summary: string }> => {
  const client = getAI();
  if (!client) return { poeticTag: "A Forgotten Memory", summary: messageText };

  const model = "gemini-2.5-flash";
  
  const prompt = `
    Analyze this message sent by ${senderName}: "${messageText}"
    
    1. Create a very short, poetic 2-4 word title/tag for this memory. 
    2. Write a one-sentence abstract explanation of why this feels meaningful.
    
    Return pure JSON format:
    {
      "poeticTag": "string",
      "summary": "string"
    }
  `;

  try {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    return { poeticTag: "Crystallized Moment", summary: messageText };
  }
};

export const generateSmartReplies = async (
    history: Message[],
    userMood: MoodType
): Promise<string[]> => {
    const client = getAI();
    if (!client) return ["I hear you.", "Tell me more.", "Thinking of you."];

    const model = "gemini-2.5-flash";
    const lastMessage = history[history.length - 1];
    
    // Only generate if the last message was from 'them'
    if (lastMessage.sender === 'me') return [];

    const prompt = `
        Context: User mood is ${userMood}. Last message received: "${lastMessage.text}".
        Task: Generate 3 very short, thoughtful, lower-case, poetic reply options (max 4 words each) that the user might want to send.
        Return strictly a JSON array of strings.
    `;

    try {
        const response = await client.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (e) {
        return ["Be well.", "Peace.", "Softly."];
    }
}
