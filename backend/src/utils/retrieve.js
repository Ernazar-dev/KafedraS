import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vectorStorePath = path.join(__dirname, "../data/vectorStore.json");

let cachedDb = null;
let lastModifiedTime = 0;

function loadDb() {
  try {
    if (!fs.existsSync(vectorStorePath)) {
      return [];
    }
    const stats = fs.statSync(vectorStorePath);
    const mtime = stats.mtimeMs;
    if (!cachedDb || mtime > lastModifiedTime) {
      const content = fs.readFileSync(vectorStorePath, "utf-8");
      cachedDb = JSON.parse(content);
      lastModifiedTime = mtime;
    }
    return cachedDb;
  } catch (error) {
    console.error("❌ VectorDB yuklashda xatolik:", error.message);
    return [];
  }
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export function retrieveRelevantDocs(queryEmbedding, topK = 3) {
  const db = loadDb();
  const scored = db.map(doc => ({
    ...doc,
    score: cosineSimilarity(doc.embedding, queryEmbedding),
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}