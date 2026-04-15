import fs from "fs";

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export function retrieveRelevantDocs(queryEmbedding, topK = 3) {
  const db = JSON.parse(fs.readFileSync("src/data/vectorStore.json"));
  const scored = db.map(doc => ({
    ...doc,
    score: cosineSimilarity(doc.embedding, queryEmbedding),
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}