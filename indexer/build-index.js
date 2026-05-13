/**
 * Offline TF-IDF Index Builder
 *
 * Input : data/corpus/all-problems.json
 * Output: data/index/tfidf.json
 */

import fs from "fs";
import path from "path";
import natural from "natural";
import stopword from "stopword";
import { fileURLToPath } from "url";

// ---------- __dirname FIX (ESM) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

// ---------- PATHS ----------
const BASE_DIR = path.join(__dirname, "..");

const CORPUS_PATH = path.join(
  BASE_DIR,
  "data",
  "corpus",
  "all-problems.json"
);

const OUTPUT_DIR = path.join(
  BASE_DIR,
  "data",
  "index"
);

const OUTPUT_PATH = path.join(
  OUTPUT_DIR,
  "tfidf.json"
);

// ---------- LOAD CORPUS ----------
console.log("Loading corpus...");
const corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf-8"));

const problems = corpus.problems;
console.log(`Total documents: ${problems.length}`);

// ---------- BUILD TF-IDF ----------
console.log("Building TF-IDF index...");
const tfidf = new TfIdf();
const documentsMeta = [];

// Add documents
problems.forEach((p, idx) => {
  const tokens = tokenizer.tokenize(
    [p.title, ...(p.tags || [])]
      .join(" ")
      .toLowerCase()
  );

  const filteredTokens = stopword.removeStopwords(tokens);

  const stemmedTokens = filteredTokens.map(token =>
    natural.PorterStemmer.stem(token)
  );

  const text = stemmedTokens.join(" ");


  tfidf.addDocument(text);

  documentsMeta.push({
    id: p.id,
    platform: p.platform,
    title: p.title,
    url: p.url
  });

  if ((idx + 1) % 1000 === 0) {
    console.log(`  Indexed ${idx + 1} documents`);
  }
});

// ---------- EXTRACT VECTORS ----------
console.log("Extracting TF-IDF vectors...");
const vocabulary = new Set();
const documents = [];

documentsMeta.forEach((meta, docIndex) => {
  const vector = {};

  tfidf.listTerms(docIndex).forEach(term => {
    vector[term.term] = Number(term.tfidf.toFixed(6));
    vocabulary.add(term.term);
  });

  documents.push({
    ...meta,
    vector
  });
});

// ---------- SAVE INDEX ----------
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const output = {
  generatedAt: new Date().toISOString(),
  totalDocuments: documents.length,
  vocabularySize: vocabulary.size,
  documents
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

console.log("TF-IDF index created");
console.log(`Output: ${OUTPUT_PATH}`);
console.log(`Vocabulary size: ${vocabulary.size}`);
