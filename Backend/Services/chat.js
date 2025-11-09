import express from "express";
import { getUserStories } from "./jiraService.js";
import { analyzeStories } from "./nemotronService.js";
import { db } from "./firebaseService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { projectId, prompt } = req.body;

    const stories = await getUserStories(projectId);
    const aiResponse = await analyzeStories({ prompt, stories });

    await db.collection("chatLogs").add({
      projectId,
      userMessage: prompt,
      aiMessage: aiResponse,
      timestamp: new Date()
    });

    // res.json({ reply: aiResponse });
    res.json({ reply: "Hello from backend!", backlog: [] });
    console.log("chat.js check");

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
