import axios from "axios";
import https from "https";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "nvidia/nemotron-nano-9b-v2";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_PRESET_ID = "@preset/hackutd25";

if (!OPENROUTER_API_KEY) {
  console.warn("⚠️ OPENROUTER_API_KEY is not defined. Nemotron calls will fail.");
}

/**
 * analyzeStories
 * @param {string} prompt - The prompt from the user.
 * @param {array} stories - The Jira stories passed as an array of objects.
 * @returns {Promise<string>} - The AI-generated response.
 */
export async function analyzeStories({ prompt, stories }) {
  if (!OPENROUTER_API_KEY) {
    return `Nemotron not configured. Received prompt: "${prompt}". Stories count: ${stories?.length ?? 0}`;
  }

  try {
    // Limit and sanitize stories to prevent payload issues
    const limitedStories = stories.slice(0, 10).map(story => ({
      key: story.key || 'N/A',
      summary: story.summary || 'No summary',
      description: (story.description || 'No description').substring(0, 500),
      status: story.status || 'Unknown'
    }));

    const shortStories = JSON.stringify(limitedStories, null, 2);

    const messages = [
      {
        role: "system",
        content: "You are an AI Product Manager assistant. Use the Jira story data to produce accurate, non-hallucinated insights. Provide complete, well-formatted responses."
      },
      {
        role: "user",
        content: `User prompt: ${prompt}\n\nJira stories: ${shortStories}\n\nTask: Provide (1) a short summary, (2) list at-risk stories with reasons, (3) suggested next actions (bulleted). Keep the answer concise but complete. DO NOT truncate your response.`
      }
    ];

    const body = {
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 2000, // INCREASED from 700 to allow full responses
      temperature: 0.2
    };

    console.log("=== OpenRouter Request ===");
    console.log("URL:", OPENROUTER_URL);
    console.log("Model:", body.model);
    console.log("Stories count:", limitedStories.length);
    console.log("Payload size:", JSON.stringify(body).length, "characters");

    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: true,
        keepAlive: true
      }),
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HackUTD25-Jira-Assistant'
      }
    });

    console.log("Sending request to OpenRouter...");
    
    const response = await axiosInstance.post(OPENROUTER_URL, body);

    console.log("=== OpenRouter Response ===");
    console.log("Status:", response.status);
    console.log("Model used:", response.data.model);
    console.log("Tokens:", response.data.usage);

    // Extract response - Nemotron uses 'reasoning' field for chain-of-thought
    const messageObj = response.data?.choices?.[0]?.message;
    
    // Try multiple possible content fields (different models use different fields)
    const reply = messageObj?.content || messageObj?.reasoning || messageObj?.text || messageObj?.message;
    
    if (!reply) {
      console.error("Message object:", JSON.stringify(messageObj, null, 2));
      console.error("Full response data:", JSON.stringify(response.data, null, 2));
      throw new Error("Nemotron returned no content.");
    }
    
    // Check if response was truncated due to max_tokens
    const finishReason = response.data?.choices?.[0]?.finish_reason;
    if (finishReason === 'length') {
      console.warn("⚠️ Response was truncated due to max_tokens limit!");
      console.warn("Consider increasing max_tokens or simplifying the prompt.");
    }
    
    console.log("✅ Successfully extracted reply");
    console.log("Reply length:", reply.length, "characters");
    console.log("Finish reason:", finishReason);
    console.log("Full reply:", reply); // Log the ENTIRE reply for debugging
    
    return reply;

  } catch (err) {
    console.error("\n=== Nemotron API Error ===");
    
    // Network/DNS errors
    if (err.code === 'ENOTFOUND') {
      console.error("DNS Resolution failed for:", err.hostname);
      console.error("This indicates a network connectivity issue.");
      console.error("\nTroubleshooting steps:");
      console.error("1. Check your internet connection");
      console.error("2. Try: ping openrouter.ai");
      console.error("3. Check if you're behind a proxy/firewall");
      console.error("4. Try setting DNS servers (8.8.8.8, 1.1.1.1)");
      throw new Error("Network error: Cannot reach OpenRouter API. Check your internet connection.");
    }
    
    // Connection timeout
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      console.error("Request timeout - OpenRouter took too long to respond");
      throw new Error("Request timeout: OpenRouter API did not respond in time.");
    }

    // HTTP errors
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Status Text:", err.response.statusText);
      console.error("Error Data:", JSON.stringify(err.response.data, null, 2));
      console.error("Headers:", err.response.headers);
      
      const errorMsg = err.response.data?.error?.message || err.response.statusText;
      throw new Error(`OpenRouter API error (${err.response.status}): ${errorMsg}`);
    }
    
    // Request errors (no response)
    if (err.request) {
      console.error("No response received from OpenRouter");
      console.error("Request config:", {
        url: err.config?.url,
        method: err.config?.method,
        timeout: err.config?.timeout
      });
      throw new Error("No response from OpenRouter API. Check network connectivity.");
    }
    
    // Other errors
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    throw new Error(`Nemotron request failed: ${err.message}`);
  }
}

/**
 * Test function to verify OpenRouter connectivity
 */
export async function testConnection() {
  console.log("\n=== Testing OpenRouter Connection ===");
  
  try {
    const testBody = {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Say 'connection successful' if you can read this." }
      ],
      max_tokens: 20
    };

    const response = await axios.post(OPENROUTER_URL, testBody, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Connection-Test'
      },
      timeout: 10000
    });

    console.log("✅ Connection successful!");
    console.log("Response:", response.data.choices[0].message.content);
    return true;
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error("Error:", err.code || err.message);
    return false;
  }
}