from datetime import datetime, timezone

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

MAX_NAME_LENGTH = 40

app = FastAPI(title="Hello API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_name(raw: str | None) -> str | None:
    if not raw:
        return None
    cleaned = "".join(ch for ch in raw if ch.isprintable()).strip()[:MAX_NAME_LENGTH]
    return cleaned or None


@app.get("/api/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/api/hello")
def hello(name: str | None = Query(default=None)) -> dict[str, str | None]:
    cleaned = clean_name(name)
    message = (
        f"Hello, {cleaned}. The backend is up."
        if cleaned
        else "Hello from the backend."
    )
    return {
        "message": message,
        "service": "backend",
        "runtime": "python",
        "time": datetime.now(timezone.utc).isoformat(),
        "name": cleaned,
    }
