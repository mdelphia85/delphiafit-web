from fastapi import APIRouter
from pydantic import BaseModel
import sqlite3
import hashlib
import time

router = APIRouter()

class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    conn = sqlite3.connect("data/app.db")
    cursor = conn.cursor()

    # Ensure tables exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            token TEXT,
            expires_at INTEGER
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)

    # Check token
    cursor.execute(
        "SELECT token, expires_at FROM password_resets WHERE email = ? ORDER BY id DESC LIMIT 1",
        (data.email,)
    )
    row = cursor.fetchone()

    if not row:
        conn.close()
        return {"success": False, "message": "Invalid or expired token"}

    stored_token, expires_at = row

    # Validate token + expiration
    if stored_token != data.token or time.time() > expires_at:
        conn.close()
        return {"success": False, "message": "Invalid or expired token"}

    # Hash new password
    hashed_pw = hash_password(data.new_password)

    # Update user password
    cursor.execute(
        "UPDATE users SET password = ? WHERE email = ?",
        (hashed_pw, data.email)
    )

    # Delete used token
    cursor.execute(
        "DELETE FROM password_resets WHERE email = ?",
        (data.email,)
    )

    conn.commit()
    conn.close()

    return {"success": True, "message": "Password updated successfully"}
