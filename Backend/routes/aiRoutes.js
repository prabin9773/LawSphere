import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional legal assistant. Answer clearly in simple language, use bullet points where needed, and give structured responses.",
            },
            ...history,
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("AI RESPONSE:", JSON.stringify(data, null, 2));

    const text =
      data?.choices?.[0]?.message?.content || "No response from AI";

    res.json({
      success: true,
      data: {
        response: text,
      },
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Sorry, AI is currently unavailable. Try again later.",
    });
  }
});

export default router;