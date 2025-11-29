# Introduction_OWASP_Top_Ten_LLMs

This repository ships a lightweight matching challenge to practice the OWASP Top 10 for LLMs. Players pair each category with its correct description to capture individual flags and a final master flag.

## What is included?
- A small Express server (`app.js`) that serves the challenge UI and exposes a `/check` validation route.
- Static frontend under `public/` with hints and explanations for every category.
- Source data in `data/llm_owasp_top10.json` containing category/description pairs plus per-category flags and hints.

## Running inside the TryHackMe VM
1. From the repository root, install dependencies:
   ```bash
   npm install
   ```
2. Start the server on port 3000 (set `PORT` to override):
   ```bash
   npm start
   ```
3. Browse to `http://<THM_VM_IP>:3000` (or `http://localhost:3000` inside the VM) to play.
4. Match every category to its description and submit to reveal per-category flags. When all pairs are correct, the final flag appears.

### Quick API check
You can validate pairs via the `/check` endpoint without the UI:
```bash
curl -X POST http://localhost:3000/check \
  -H 'Content-Type: application/json' \
  -d '{"pairs":[{"category":"LLM01: Prompt Injection","description":"Manipulating prompts to force the model to ignore instructions or reveal hidden data."}]}'
```

## Gameplay tips
- Read the hints under each category title and the short explanation to differentiate similar threats.
- Descriptions are shuffled each page load to prevent guessing—carefully map each one.
- The final flag only appears when all categories are matched correctly in a single submission.

## File reference
- `app.js` — Express server, `/api/game` data loader, and `/check` validator.
- `public/` — UI assets (HTML, CSS, JS) to play the challenge in a browser.
- `data/llm_owasp_top10.json` — Category metadata, hints, explanations, and non-guessable flags.
