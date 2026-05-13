import fs from 'fs';
import path from 'path';
import natural from 'natural';
import stopword from 'stopword';
import { getDirname } from '../utils/path.js';
import { LRUCache } from 'lru-cache';

const __dirname = getDirname(import.meta.url);
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// ---------- PATHS ----------
const INDEX_PATH = path.join(__dirname, '..', '..', 'data', 'index', 'tfidf.json');
const CORPUS_PATH = path.join(__dirname, '..', '..', 'data', 'corpus', 'all-problems.json');

// ---------- LOAD DATA ----------
console.log('🔍 Loading TF-IDF index...');
const tfidfIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));

console.log('📖 Loading corpus...');
const corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf-8')).problems;

// ---------- JOIN INDEX + METADATA ----------
const corpusMap = new Map(corpus.map(p => [p.id, p]));

const documents = tfidfIndex.documents.map(doc => ({
  ...doc,
  difficulty: corpusMap.get(doc.id)?.difficulty ?? null,
}));

console.log(`Loaded ${documents.length} documents`);


// ---------- CACHE ----------
const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5,
});


// ---------- HELPERS ----------
function isNumericDifficultyQuery(query) {
  return /^\d{3,4}$/.test(query);
}


// ---------- COSINE SIMILARITY ----------
function cosineSimilarity(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0;

  for (const term in vecA) {
    const a = vecA[term];
    magA += a * a;
    if (vecB[term]) dot += a * vecB[term];
  }

  for (const term in vecB) {
    const b = vecB[term];
    magB += b * b;
  }

  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}


// ---------- QUERY VECTOR ----------
function buildQueryVector(query) {
  const tokens = tokenizer.tokenize(query.toLowerCase());
  const filtered = stopword.removeStopwords(tokens);
  const stemmed = filtered.map(t => stemmer.stem(t));

  const freq = {};
  for (const term of stemmed) {
    freq[term] = (freq[term] || 0) + 1;
  }

  return freq;
}


// ---------- SEARCH ----------
export function searchProblems(query) {
  const key = query.trim().toLowerCase();

  if (cache.has(key)) {
    console.log('⚡ cache hit:', key);
    return cache.get(key);
  }

  // 🔥 DIFFICULTY SEARCH (Codeforces)
  if (isNumericDifficultyQuery(key)) {
    const target = Number(key);

    const results = documents
      .filter(
        d =>
          d.platform === 'codeforces' &&
          typeof d.difficulty === 'number' &&
          Math.abs(d.difficulty - target) <= 100
      )
      .sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target))
      .map(d => ({
        id: d.id,
        title: d.title,
        platform: d.platform,
        url: d.url,
        difficulty: d.difficulty,
        score: 1,
      }));

    cache.set(key, results);
    return results;
  }


  // 🔵 TEXT SEARCH
  const queryVector = buildQueryVector(key);
  const results = [];

  for (const doc of documents) {
    const score = cosineSimilarity(queryVector, doc.vector);
    if (score > 0) {
      results.push({
        id: doc.id,
        title: doc.title,
        platform: doc.platform,
        url: doc.url,
        difficulty: doc.difficulty,
        score,
      });
    }
  }

  
  const sorted = results.sort((a, b) => b.score - a.score);
  cache.set(key, sorted);
  return sorted;
}
