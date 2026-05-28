// scripts/buildVectorDB.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getEmbedding } from "../utils/embeddings.js";
import dotenv from "dotenv";
import { sequelize } from "../config/db.js";
import { Subject } from "../models/subject.js";
import { Teacher } from "../models/teacher.js";
import { News } from "../models/news.js";
import "../models/index.js"; // load associations

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vectorStorePath = path.join(__dirname, "../data/vectorStore.json");

async function buildVectorDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Ulanish muvaffaqiyatli, RAG indekslash boshlandi...");

    let vectorStore = [];

    // 1. Subjects (Fanlar)
    try {
      const subjects = await Subject.findAll();
      for (let item of subjects) {
        const textBlock = `subjects: ${item.name || ""}. ${item.description || ""}`;
        const embedding = await getEmbedding(textBlock);
        if (embedding && embedding.length > 0) {
          vectorStore.push({ id: item.id, type: "subjects", text: textBlock, embedding });
        }
      }
      console.log(`✅ Fanlar indekslandi: ${subjects.length} ta`);
    } catch (err) {
      console.error("⚠️ Fanlarni indekslashda xato:", err.message);
    }

    // 2. Teachers (Ustozlar)
    try {
      const teachers = await Teacher.findAll();
      for (let item of teachers) {
        const textBlock = `teachers: ${item.fullname || ""}. ${item.position || ""}`;
        const embedding = await getEmbedding(textBlock);
        if (embedding && embedding.length > 0) {
          vectorStore.push({ id: item.id, type: "teachers", text: textBlock, embedding });
        }
      }
      console.log(`✅ Ustozlar indekslandi: ${teachers.length} ta`);
    } catch (err) {
      console.error("⚠️ Ustozlarni indekslashda xato:", err.message);
    }

    // 3. News (Yangiliklar)
    try {
      const newsList = await News.findAll();
      for (let item of newsList) {
        const textBlock = `news: ${item.title || ""}. ${item.content || ""}`;
        const embedding = await getEmbedding(textBlock);
        if (embedding && embedding.length > 0) {
          vectorStore.push({ id: item.id, type: "news", text: textBlock, embedding });
        }
      }
      console.log(`✅ Yangiliklar indekslandi: ${newsList.length} ta`);
    } catch (err) {
      console.error("⚠️ Yangiliklarni indekslashda xato:", err.message);
    }

    // Ensure data directory exists
    const dir = path.dirname(vectorStorePath);
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(vectorStorePath, JSON.stringify(vectorStore, null, 2));
    console.log("✅ RAG vector DB tayyor!");
  } catch (err) {
    console.error("❌ Ma'lumotlar bazasiga ulanishda xato:", err.message);
  } finally {
    await sequelize.close();
  }
}

buildVectorDB();