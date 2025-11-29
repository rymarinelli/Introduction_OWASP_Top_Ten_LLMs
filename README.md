# Introduction_OWASP_Top_Ten_LLMs

This repository contains a lightweight Flask backend that demonstrates safer handling for CTF-style flag validation:

- Flags live server-side only and are never embedded in client code.
- The `/validate` endpoint sanitizes input, returns only minimal error details, and applies a rolling attempt counter to slow brute-force abuse.
- CORS is restricted to trusted origins, and the app serves no static directories to avoid directory listing exposure.

## Running the server

```bash
pip install -r requirements.txt
python -m app.server
```

## Tests

```bash
pytest -q
```
