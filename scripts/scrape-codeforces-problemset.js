/**
 * Scrape full Codeforces problemset (OFFICIAL API)
 *
 * Usage:
 *   node scripts/scrape-codeforces-problemset.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function scrapeProblemset() {
  console.log('🔍 Fetching full Codeforces problemset...');

  const apiUrl = 'https://codeforces.com/api/problemset.problems';
  const response = await axios.get(apiUrl, { timeout: 20000 });

  const data = response.data;

  if (data.status !== 'OK'){
    throw new Error('Invalid response from Codeforces API');
  }

  const problems = data.result.problems;

  console.log(`Total problems fetched: ${problems.length}`);

  const normalized = problems.map(p => ({
    id: `${p.contestId}${p.index}`,
    contestId: p.contestId,
    index: p.index,
    title: p.name,
    tags: p.tags || [],
    rating: p.rating ?? null,
    url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
    platform: 'codeforces'
  }));

  const outputDir = path.join(__dirname, '../data/raw/codeforces');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'codeforces-problems.json');

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        platform: 'codeforces',
        scrapedAt: new Date().toISOString(),
        totalProblems: normalized.length,
        problems: normalized
      },
      null,
      2
    )
  );

  console.log(`Saved full problemset`);
  console.log(`Output: ${outputPath}`);
}

// ---- ENTRY POINT ----
scrapeProblemset().catch(err => {
  console.error('Scraping failed:', err.message);
  process.exit(1);
});
