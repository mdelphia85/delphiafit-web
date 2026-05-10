from fastapi import APIRouter
from pydantic import BaseModel
import sqlite3

router = APIRouter()

class NotifyRequest(BaseModel):
    email: str

@router.post("/notify")
async def notify_user(data: NotifyRequest):
    conn = sqlite3.connect("data/app.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notify_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE
        )
    """)

    cursor.execute("INSERT OR IGNORE INTO notify_list (email) VALUES (?)", (data.email,))
    conn.commit()
    conn.close()

    return {"success": True, "message": "Email saved"}
