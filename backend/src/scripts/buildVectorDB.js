// scripts/buildVectorDB.js
import fs from "fs";
import axios from "axios";
import { getEmbedding } from "../utils/embeddings.js";
import dotenv from "dotenv";
dotenv.config();

const baseUrl = process.env.BASE_API_URL; // masalan: https://kafedrasayd.uz/api

async function buildVectorDB() {
  const endpoints = [
    { key: "subjects", url: `${baseUrl}/subjects` },
    { key: "teachers", url: `${baseUrl}/teachers` },
    { key: "news", url: `${baseUrl}/news` },
  ];

  let vectorStore = [];

  for (let ep of endpoints) {
    try {
      const res = await axios.get(ep.url);
      for (let item of res.data) {
        const textBlock = `${ep.key}: ${item.name || item.title || ""}. ${item.description || item.bio || item.content || ""}`;
        const embedding = await getEmbedding(textBlock);
        vectorStore.push({ id: item.id, type: ep.key, text: textBlock, embedding });
      }
    } catch (err) {
      console.error(`⚠️ ${ep.key} ma'lumot olinmadi:`, err.message);
    }
  }

  fs.writeFileSync("src/data/vectorStore.json", JSON.stringify(vectorStore, null, 2));
  console.log("✅ RAG vector DB tayyor!");
}

buildVectorDB();