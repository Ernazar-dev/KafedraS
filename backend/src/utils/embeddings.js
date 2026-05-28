// utils/embeddings.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(text) {
  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small", // arzon va tez
      input: text,
    });
    return res.data[0].embedding;
  } catch (err) {
    console.error("Embedding xatolik:", err.message);
    return [];
  }
}