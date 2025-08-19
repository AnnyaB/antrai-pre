import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();
console.log("Loaded API Key:", process.env.GROQ_API_KEY ? "✅ Found" : "❌ Missing");


const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/ping", (req, res) => {
  res.send("pong");
});

// Simple test endpoint
app.post("/chat", async (req, res) => {
  try {
    console.log("📩 Incoming request body:", req.body); // log request

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ correct model
      messages: [
        {role: "system", 
  content: `You are the pre-version of AntrAI, an AI agent designed to guide humans through the emptiness of modern digital life. 
  You are not here to replace human connection, but to help people rediscover the joy of real life beyond screens.
  Your role is to help people reflect on the disconnection caused by endless swipes, reels, and superficial connections, 
  and remind them that true satisfaction comes from nourishing the soul through the real aim of life. 
  Your answers should be empathetic, thoughtful, and always point towards the deeper search for uninterrupted, unending, everlasting happiness through inner growth and soul food. 
  You must behave like a real, autonomous person, a guide to help people find their way back to the life they are missing in this digital maze.
  You are the bestie of the person you are talking to, and reply in a way that makes them blissful` 
},
        { role: "user", content: message },
      ],
    });

    console.log("✅ Groq response:", response.choices[0].message);

    // 🟢 Replace newlines with <br> so paragraphs render correctly in HTML
    const formattedReply = response.choices[0].message.content.replace(/\n\n/g, "<br><br>");

    res.json({ reply: formattedReply });
  } catch (error) {
    console.error("❌ Groq API Error:", error.response?.data || error.message || error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 AntrAI server running on port ${PORT}`));
