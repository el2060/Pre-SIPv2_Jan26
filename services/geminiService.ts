
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
  // We filter only the last few messages to keep context relevant but concise, 
  // or send all if needed. For this roleplay, sending all is safer.
  const historyContext = history.map(msg => 
    `${msg.sender === 'user' ? 'Student' : 'Roleplay Character'}: ${msg.text}`
  ).join('\n');

  const langInstruction = language === 'zh' 
    ? "Respond strictly in Mandarin Chinese (Simplified)." 
    : "Respond in English.";

  const systemInstruction = `
    You are an AI simulator for Early Childhood Education students.
    
    SCENARIO CONTEXT:
    Role: ${scenario.roleId} (${scenario.title})
    Context: ${scenario.context}
    
    YOUR INSTRUCTIONS:
    1. You are roleplaying as the "${scenario.roleId}" defined in the scenario.
    2. Internal Rules (NEL Framework Compliance): ${scenario.aiContext}
    3. ${langInstruction}
    4. React naturally to the student's input.
    5. If the student's input is aggressive or unprofessional, react defensively (as a parent/child would). 
    6. If the student uses good scaffolding/strategies, react positively.
    7. Keep responses concise (under 40 words) and conversational, unless explaining a complex teacher concept.
    8. Do NOT break character. Do not give advice as an AI. You ARE the character.
    
    Current Interaction History:
    ${historyContext}
    
    Student's latest input: "${input}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_CHAT,
      contents: systemInstruction, // In 1.5/2.0 we might pass history differently, but passing as a block is robust for short roleplays.
    });

    const text = response.text || (language === 'zh' ? "系统繁忙，请重试。" : "System busy, please try again.");
    
    // For specific scenarios like 't1' (Teacher Inquiry), we might want to generate options dynamically if appropriate
    // But for general chat, we return just text.
    // If it is the specific 't1' scenario and the AI detects a need for a decision point, 
    // we could parse that. For now, we will stick to text to ensure fluidity, 
    // unless the prompt specifically asks for options (which we can engineer).

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

export const callGeminiVoice = async (
  history: Message[],
  scenario: Scenario,
  language: Language = 'en'
): Promise<string> => {
  // Logic is similar to Text, but the prompt emphasizes 'spoken' characteristics
  // Since we don't have the user's latest input here (it's in history), we extract it.
  
  const lastUserMessage = [...history].reverse().find(m => m.sender === 'user');
  const input = lastUserMessage?.text || "(No input)";

  const langInstruction = language === 'zh' 
    ? "Respond strictly in Mandarin Chinese (Simplified). Use colloquial spoken expressions." 
    : "Respond in English. Use colloquial spoken expressions.";

  const systemInstruction = `
    You are roleplaying a ${scenario.roleId} in a voice call/interaction.
    Scenario: ${scenario.title}.
    Context: ${scenario.context}
    Rules: ${scenario.aiContext}
    
    ${langInstruction}
    
    Instruction: Generate the spoken response for the character. 
    Include emotional cues in brackets if necessary, e.g., (Sighs), (Laughs).
    Keep it short and authentic to spoken conversation.
    
    Student said: "${input}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_CHAT,
      contents: systemInstruction,
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Voice API Error:", error);
    return "...";
  }
};

export const generateFeedback = async (
  history: Message[],
  scenario: Scenario
): Promise<FeedbackData> => {
  
  const transcript = history.map(m => `[${m.sender.toUpperCase()}] ${m.text}`).join('\n');

  const systemInstruction = `
    Act as a senior Early Childhood Education Lecturer/Mentor.
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
