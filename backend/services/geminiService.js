import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';

export const generateAIResponse = async (history) => {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not defined in the environment variables.');
    }

    // Format message history for OpenRouter (OpenAI chat completion standard format):
    // [{ role: 'user' | 'assistant', content: string }]
    const messages = history.map((msg) => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.content
    }));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'K-Hub AI Chatbot',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || `Server responded with status ${response.status}`;
      throw new Error(errorMsg);
    }

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
      throw new Error('Received an empty response from OpenRouter API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    const errorString = error.message || '';
    
    // Provide nice error messages for typical failure conditions
    if (errorString.includes('quota') || errorString.includes('429') || errorString.includes('credit')) {
      throw new Error('The OpenRouter API rate limit or billing quota has been exceeded for this key. Please check your credit balance or try again in a minute.');
    } else if (errorString.includes('API key') || errorString.includes('401')) {
      throw new Error('Invalid OpenRouter API Key. Please verify your credentials.');
    } else if (errorString.includes('network') || error.code === 'ENOTFOUND') {
      throw new Error('Network error. Unable to connect to OpenRouter service.');
    }
    
    throw new Error(errorString || 'OpenRouter API failed to generate a response.');
  }
};

export const generateAutoTitle = async (firstPrompt) => {
  try {
    const promptMessage = {
      role: 'user',
      content: `Create an extremely short, concise, and clean 2-to-4 word title for a conversation that begins with the following prompt. Do NOT use quotation marks, punctuation, markdown formatting, or prefix words. Only return the title itself.\n\nPrompt: "${firstPrompt}"`
    };
    const title = await generateAIResponse([promptMessage]);
    return title.trim().replace(/^["']|["']$/g, '').replace(/[.!?]$/, '');
  } catch (err) {
    console.error('Failed to generate auto-title via AI:', err);
    return firstPrompt.trim().substring(0, 30) + (firstPrompt.trim().length > 30 ? '...' : '');
  }
};
