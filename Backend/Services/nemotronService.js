import axios from "axios";

export const analyzeStories = async ({ prompt, stories }) => {
  const requestBody = {
    model: "nvidia/nemotron-nano-9b-v2",
    messages: [
      {
        role: "user",
        content: `You are an AI PM assistant.
        Prompt: ${prompt}
        Jira stories: ${JSON.stringify(stories)}
        Provide insights and risks.`
      }
    ]
  };

  const res = await axios.post(
    "https://api.openrouter.ai/v1/chat/completions",
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEMOTRON_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
};
