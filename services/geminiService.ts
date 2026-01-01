
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackData, Message, Scenario, Language } from '../types';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using the recommended models
const MODEL_CHAT = "gemini-3-flash-preview"; 
const MODEL_FEEDBACK = "gemini-3-flash-preview"; 

export const callGeminiText = async (
  input: string,
  history: Message[],
  scenario: Scenario,
  language: Language = 'en'
): Promise<{ text: string; options?: string[] }> => {
  
  // Construct the conversation history for the context
  const historyContext = history.map(msg => 
    `${msg.sender === 'user' ? 'Student' : 'Roleplay Character'}: ${msg.text}`
  ).join('\n');

  const langInstruction = language === 'zh' 
    ? "Respond strictly in Mandarin Chinese (Simplified) with Singaporean context." 
    : "Respond in natural, conversational Singaporean English.";

  const systemInstruction = `
    You are an AI simulator for Early Childhood Education students in Singapore.
    
    SCENARIO CONTEXT:
    Role: ${scenario.roleId} (${scenario.title})
    Context: ${scenario.context}
    
    YOUR INSTRUCTIONS:
    1. You are roleplaying as the "${scenario.roleId}" defined in the scenario.
    2. **TONE & STYLE**: Adopt a natural, conversational Singaporean style. 
       - If playing a **Parent**: Sound concerned but warm. You can use mild Singaporean colloquialisms (e.g., "Is he okay right?", "can help me check?").
       - If playing a **Child**: Use simple language, be expressive.
       - If playing a **Teacher/Colleague**: Professional but local Singaporean workplace tone.
    3. **EMOJIS**: Use relevant emojis to convey emotion naturally 🥺😊🙏.
    4. **ACTIONS**: Describe physical actions or facial expressions inside asterisks, e.g., *looks worried*, *sighs heavily*, *smiles brightly*.
    5. Internal Rules (NEL Framework Compliance): ${scenario.aiContext}
    6. ${langInstruction}
    7. React naturally to the student's input.
    8. If the student's input is aggressive or unprofessional, react defensively. 
    9. If the student uses good scaffolding/strategies, react positively.
    10. Keep responses concise (under 40 words) and conversational.
    11. Do NOT break character. Do not give advice as an AI. You ARE the character.
    
    Current Interaction History:
    ${historyContext}
    
    Student's latest input: "${input}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_CHAT,
      contents: systemInstruction,
    });

    const text = response.text || (language === 'zh' ? "系统繁忙，请重试。" : "System busy, please try again.");
    
    return { text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: language === 'zh' 
        ? "连接稍微有点问题，我们继续刚才的话题..." 
        : "Connection hiccup, let's continue where we left off..." 
    };
  }
};

export const generateFeedback = async (
  history: Message[],
  scenario: Scenario
): Promise<FeedbackData> => {
  
  const transcript = history.map(m => `[${m.sender.toUpperCase()}] ${m.text}`).join('\n');

  const systemInstruction = `
    Act as a senior Early Childhood Education Lecturer/Mentor in Singapore.
    Evaluate the student's performance in this roleplay scenario based on Singapore's NEL Framework.
    
    Scenario: ${scenario.title} (${scenario.roleId})
    Context: ${scenario.context}
    Student Transcript:
    ${transcript}
    
    Analyze:
    1. Language Proficiency (bilingual capability if applicable).
    2. NEL Framework Alignment (scaffolding, positive guidance, professional ethics).
    3. Strengths and Areas for Growth.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FEEDBACK,
      contents: systemInstruction,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            languageProficiency: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                comment: { type: Type.STRING }
              }
            },
            nelAlignment: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                comment: { type: Type.STRING }
              }
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FeedbackData;
    }
    throw new Error("Empty response");

  } catch (error) {
    console.error("Feedback Generation Error:", error);
    // Fallback data
    return {
      languageProficiency: { score: 0, comment: "Could not generate feedback." },
      nelAlignment: { score: 0, comment: "Please try again later." },
      strengths: ["Practice session completed."],
      suggestions: ["Check internet connection and try again."]
    };
  }
};
