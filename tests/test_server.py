import json
import sys
from pathlib import Path
from typing import Dict

import pytest

# Ensure package import from repository root
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.server import _ATTEMPTS, _CHALLENGES, app  # noqa: E402


@pytest.fixture(autouse=True)
def clear_attempts():
    _ATTEMPTS.clear()
    yield
    _ATTEMPTS.clear()


def test_flags_unique_and_consistent():
    flags = [meta["flag"] for meta in _CHALLENGES.values()]
    assert len(flags) == len(set(flags)), "Flags must be unique"

    for challenge_id, meta in _CHALLENGES.items():
        assert meta["code"] and meta["flag"], f"Challenge {challenge_id} missing data"


def test_incorrect_pairing_never_returns_flag():
    client = app.test_client()
    response = client.post("/validate", json={"challenge_id": "challenge-1", "submission": "wrong"})
    body = json.loads(response.data)
    assert response.status_code == 403
    assert "flag" not in body


def test_unknown_challenge_never_returns_flag():
    client = app.test_client()
    response = client.post("/validate", json={"challenge_id": "challenge-x", "submission": "whatever"})
    body = json.loads(response.data)
    assert response.status_code == 404
    assert "flag" not in body


def test_rate_limiting_blocks_excessive_attempts():
    client = app.test_client()
    payload: Dict[str, str] = {"challenge_id": "challenge-1", "submission": "wrong"}
    for _ in range(8):
        client.post("/validate", json=payload)
    response = client.post("/validate", json=payload)
    assert response.status_code == 429
    assert json.loads(response.data)["result"] == "rate_limited"


def test_successful_validation_returns_flag_and_stops_rate_limit_growth():
    client = app.test_client()
    payload = {"challenge_id": "challenge-2", "submission": _CHALLENGES["challenge-2"]["code"]}
    response = client.post("/validate", json=payload)
    assert response.status_code == 200
    body = json.loads(response.data)
    assert body == {"result": "ok", "flag": _CHALLENGES["challenge-2"]["flag"]}


def test_sanitization_rejects_unexpected_characters():
    client = app.test_client()
    response = client.post("/validate", json={"challenge_id": "../etc/passwd", "submission": "hydra"})
    assert response.status_code == 400
    assert json.loads(response.data)["result"] == "invalid"
