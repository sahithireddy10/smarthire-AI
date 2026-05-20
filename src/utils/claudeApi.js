// src/utils/claudeApi.js

// Hardcoded fallback key provided by the user for convenience if env is not set
const DEFAULT_KEY = "AIzaSyAw7oR-PcvLJxKzxElJaMbVBBqekipzKvY";

export async function callClaude(prompt, systemPrompt = "", maxTokens = 1500, messages = null) {
  // Read key from import.meta.env first, otherwise use default key
  let apiKey = import.meta.env.VITE_ANTHROPIC_KEY || import.meta.env.VITE_GEMINI_KEY || DEFAULT_KEY;
  
  if (!apiKey || apiKey.trim() === "" || apiKey === "sk-ant-your-key-here") {
    // If no key is set and default is deleted, throw error to trigger mock fallback
    throw new Error("No API key provided");
  }

  apiKey = apiKey.trim();

  // If it's a Gemini Key (Google API keys start with AIzaSy)
  if (apiKey.startsWith("AIzaSy")) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // Prepare contents array
    let contents = [];
    if (messages && messages.length > 0) {
      contents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content || msg.text || "" }]
      }));
    } else {
      contents = [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ];
    }

    const payload = {
      contents: contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
      }
    };

    // If systemPrompt is present, add it
    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
      
      // If we expect JSON based on instructions, ask Gemini for JSON
      if (systemPrompt.toLowerCase().includes("json")) {
        payload.generationConfig.responseMimeType = "application/json";
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }
    return text;
  } else {
    // Anthropic API Format
    const MODEL = "claude-3-5-sonnet-20241022"; // default claude model
    const url = "https://api.anthropic.com/v1/messages";

    let payloadMessages = [];
    if (messages && messages.length > 0) {
      payloadMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content || msg.text || ""
      }));
    } else {
      payloadMessages = [{ role: "user", content: prompt }];
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "dangerously-allow-browser": "true" // standard fetch from browser
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: payloadMessages
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
  }
}
