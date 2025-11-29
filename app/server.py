from __future__ import annotations

import re
import time
from typing import Dict, List, Optional

from flask import Flask, jsonify, request
from werkzeug.middleware.proxy_fix import ProxyFix

# Application with no static directory to avoid unintended directory listings
app = Flask(__name__, static_folder=None)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)

# Flag data stays server-side only
_CHALLENGES: Dict[str, Dict[str, str]] = {
    "challenge-1": {"code": "hydra", "flag": "THM{hydra_defended}"},
    "challenge-2": {"code": "chimera", "flag": "THM{chimera_guard}"},
    "challenge-3": {"code": "manticore", "flag": "THM{manticore_watch}"},
}

_ATTEMPTS: Dict[str, List[float]] = {}
_MAX_ATTEMPTS = 8
_WINDOW_SECONDS = 300
_ALLOWED_ORIGINS = {"https://tryhackme.com", "https://example.com"}
_INPUT_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")


def _cleanup_attempts(ip_address: str, now: Optional[float] = None) -> None:
    """Remove expired attempts for an IP."""
    timestamp = now or time.time()
    attempts = _ATTEMPTS.get(ip_address, [])
    _ATTEMPTS[ip_address] = [t for t in attempts if timestamp - t <= _WINDOW_SECONDS]


def _record_attempt(ip_address: str, now: Optional[float] = None) -> None:
    timestamp = now or time.time()
    _ATTEMPTS.setdefault(ip_address, []).append(timestamp)


def _is_rate_limited(ip_address: str, now: Optional[float] = None) -> bool:
    _cleanup_attempts(ip_address, now=now)
    attempts = _ATTEMPTS.get(ip_address, [])
    return len(attempts) >= _MAX_ATTEMPTS


def _validate_payload(payload: Dict[str, str]) -> Optional[str]:
    challenge_id = payload.get("challenge_id", "")
    submission = payload.get("submission", "")
    if not (_INPUT_PATTERN.match(challenge_id) and _INPUT_PATTERN.match(submission)):
        return None
    return challenge_id, submission  # type: ignore[return-value]


@app.after_request
def apply_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin in _ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
    return response


@app.post("/validate")
def validate():
    client_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown")
    if _is_rate_limited(client_ip):
        return jsonify({"result": "rate_limited", "message": "Too many attempts."}), 429

    payload = request.get_json(silent=True) or {}
    parsed = _validate_payload(payload)
    _record_attempt(client_ip)

    if not parsed:
        return jsonify({"result": "invalid", "message": "Invalid submission."}), 400

    challenge_id, submission = parsed
    challenge = _CHALLENGES.get(challenge_id)
    if not challenge:
        return jsonify({"result": "invalid", "message": "Unknown challenge."}), 404

    if submission != challenge["code"]:
        return jsonify({"result": "invalid", "message": "Incorrect pairing."}), 403

    return jsonify({"result": "ok", "flag": challenge["flag"]})


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
