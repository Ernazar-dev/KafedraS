// controller/aiController.js
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
import { getEmbedding } from "../utils/embeddings.js";
import { retrieveRelevantDocs } from "../utils/retrieve.js";
import { createLog } from "../middleware/logMiddleware.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function truncateContext(context, maxChars = 2500) {
  try {
    const str = JSON.stringify(context);
    return str.length <= maxChars ? str : str.slice(0, maxChars - 3) + "...";
  } catch {
    return "";
  }
}

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Xabar kiritilmadi" });

    // API ma’lumotlarini olish
    const baseUrl = process.env.BASE_API_URL;
    const apiEndpoints = [
      { regex: /student|o'quvchi/i, key: "students", url: `${baseUrl}/students` },
      { regex: /teacher|ustoz/i, key: "teachers", url: `${baseUrl}/teachers` },
      { regex: /fan|subject/i, key: "subjects", url: `${baseUrl}/subjects` },
      { regex: /yangilik|news/i, key: "news", url: `${baseUrl}/news` },
    ];

    let contextData = {};
    for (let api of apiEndpoints) {
      if (api.regex.test(message)) {
        try {
          const resp = await axios.get(api.url);
          contextData[api.key] = resp.data;
        } catch {
          contextData[api.key] = [];
        }
      }
    }

    const ctxStr = truncateContext(contextData, 4000);

    // RAG embedding
    const queryEmbedding = await getEmbedding(message);

    // Vector DB’dan relevant docs
    const relevantDocs = retrieveRelevantDocs(queryEmbedding, 3);
    const ragContext = relevantDocs.map(d => d.text).join("\n");

    const systemPrompt = 
`Siz kafedrasayd.uz sayti uchun aqlli yordamchisiz.
Qoidalar:
- Foydalanuvchi so‘roviga mos API/RAG ma’lumotlarini ishlating.
- Fikr yuritish qisqa va faktga asoslangan bo‘lsin.
- Javob Qoraqolpoq tilida bo‘lsin.
API ma’lumotlari:
${ctxStr}

RAG konteksti:
${ragContext}`
;

    // OpenAI bilan muloqot
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.3,
      max_tokens: 700,
    });

    const reply = completion.choices?.[0]?.message?.content || "AI javobi topilmadi";

    // Log yaratish
    if (req.user) {
      createLog({
        userId: req.user.id, 
        action: "ai_chat",
        entity: "AI",
        entityId: null,
        description: `Foydalanuvchi xabar yubordi: "${message}". Javob: "${reply.slice(0, 200)}..."`,
      }).catch(e => console.error("Log xatosi:", e.message));
    }

    res.json({
      reply,
      rag_used: relevantDocs.length > 0,
      context_preview: relevantDocs.map(d => ({ id: d.id, type: d.type })),
    });

  } catch (err) {
    console.error("❌ AI xatolik:", err);
    res.status(500).json({ error: "AI bilan bog‘liq xatolik", details: err.message });
  }
};