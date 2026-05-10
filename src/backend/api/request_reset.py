from fastapi import APIRouter
from pydantic import BaseModel
import sqlite3
import secrets
import time

router = APIRouter()

class ResetRequest(BaseModel):
    email: str

@router.post("/request-reset")
async def request_password_reset(data: ResetRequest):
    conn = sqlite3.connect("data/app.db")
    cursor = conn.cursor()

    # Ensure users table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)

    # Ensure password reset table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            token TEXT,
            expires_at INTEGER
        )
    """)

    # Check if user exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (data.email,))
    user = cursor.fetchone()

    # Always return success to avoid email enumeration
    if not user:
        conn.close()
        return {"success": True, "message": "If the email exists, a reset link was sent."}

    # Generate secure token
    token = secrets.token_hex(32)
    expires_at = int(time.time()) + 3600  # 1 hour expiration

    # Store token
    cursor.execute(
        "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
        (data.email, token, expires_at)
    )

    conn.commit()
    conn.close()

    # In a real app, you'd email the token. For now, return it for testing.
    return {"success": True, "token": token}
