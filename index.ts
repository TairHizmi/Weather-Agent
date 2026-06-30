import "dotenv/config";
import path from "path";
import express from "express";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import getWeather from "./tools/getWeather.js";

const app = express();
app.use(express.json());

// מגיש את קבצי ה-frontend (index.html וכו') מתוך תיקיית public
app.use(express.static(path.join(process.cwd(), "public")));

const model = new ChatOpenAI({
  model: process.env.LLM_MODEL ?? "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.LLM_API_KEY ?? "",
  configuration: { baseURL: process.env.LLM_BASE_URL }
});


// --- הסוכן ------------------------------------------------------------------
const agent = createReactAgent({
  llm: model,
  tools: [getWeather],
});


app.post("/ask", async (req, res) => {
  const question = req.body?.question;
  const controller = new AbortController();
  try {
    const result = await agent.invoke(
      {
        messages: [
          { role: "system", content: "You are a helpful assistant that can answer questions about the weather and show posts. You always use Emojis!" },
          { role: "user", content: question }],
      },
      { signal: controller.signal }
    );

    const final = result.messages.at(-1)?.content;

    let answer: string;
    if (typeof final === "string") {
      answer = final;
    } else if (Array.isArray(final)) {
      // אם content הוא מערך של בלוקים (לדוגמה [{ type: "text", text: "..." }])
      answer = final
        .map((block: any) => (typeof block === "string" ? block : block?.text ?? ""))
        .join("");
    } else {
      answer = String(final ?? "");
    }

    res.json({ answer });
  } catch (err) {
      res.status(504).json({ error: `Agent failed.` });
  }
});

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`🚀 Agent HTTP server listening on http://localhost:${PORT}`);
});