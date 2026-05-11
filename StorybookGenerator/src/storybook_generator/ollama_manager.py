"""Manages the lifecycle of a locally-spawned ollama serve process."""

import subprocess
import time

import httpx

OLLAMA_URL = "http://localhost:11434"
_process: subprocess.Popen | None = None


def is_running() -> bool:
    try:
        r = httpx.get(OLLAMA_URL, timeout=2.0)
        return r.status_code == 200
    except Exception:
        return False


def start() -> dict:
    global _process

    if is_running():
        return {"status": "already_running"}

    try:
        _process = subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except FileNotFoundError:
        return {
            "status": "error",
            "message": "Ollama is not installed. Download it from https://ollama.com",
        }

    for _ in range(30):
        if is_running():
            return {"status": "started"}
        time.sleep(1)

    _process = None
    return {"status": "error", "message": "Ollama started but is not responding."}


def stop() -> dict:
    global _process

    if _process is None:
        return {"status": "not_managed"}

    _process.terminate()
    try:
        _process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        _process.kill()
        _process.wait()

    _process = None
    return {"status": "stopped"}
