import { searchProblems } from '../services/search.service.js';

export function searchController(req, res) {
  const { q, limit } = req.query;

  if (!q) {
    return res.status(400).json({
      error: 'Query parameter "q" is required'
    });
  }

  const results = searchProblems(q, Number(limit) || 10);

  res.json({
    query: q,
    count: results.length,
    results
  });
}
