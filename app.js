const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FINAL_FLAG = 'FLAG{all_categories_mastered_9876}';

const dataPath = path.join(__dirname, 'data', 'llm_owasp_top10.json');
const categories = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function shuffleCopy(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/game', (req, res) => {
  const descriptions = shuffleCopy(categories.map((entry) => entry.description));
  const playableCategories = categories.map(({ category, hint, explanation }) => ({
    category,
    hint,
    explanation,
  }));

  res.json({
    categories: playableCategories,
    descriptions,
    help: 'Match each OWASP Top 10 for LLMs category to the correct description. Submit to reveal per-category flags; solve them all to unlock the final flag.',
  });
});

app.post('/check', (req, res) => {
  const { pairs } = req.body || {};

  if (!Array.isArray(pairs)) {
    return res.status(400).json({ error: 'Request body must include a pairs array.' });
  }

  const categoryMap = new Map(categories.map((entry) => [entry.category, entry]));
  const results = pairs.map(({ category, description }) => {
    const entry = categoryMap.get(category);
    if (!entry) {
      return {
        category,
        correct: false,
        message: 'Unknown category provided.',
      };
    }

    const correct = entry.description === description;
    return {
      category: entry.category,
      correct,
      flag: correct ? entry.flag : undefined,
      explanation: entry.explanation,
      message: correct
        ? 'Matched! Enjoy your flag and keep exploring the mitigation notes.'
        : 'Not quite. Re-read the description and hint to tighten the match.',
    };
  });

  const allSolved = results.length === categories.length && results.every((item) => item.correct);

  res.json({
    results,
    finalFlag: allSolved ? FINAL_FLAG : undefined,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OWASP LLM Top 10 matcher running at http://localhost:${PORT}`);
  });
}

module.exports = app;
