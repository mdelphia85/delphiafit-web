from fastapi import APIRouter
from pydantic import BaseModel
import sqlite3

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

@router.post("/contact")
async def submit_contact(data: ContactRequest):
    conn = sqlite3.connect("data/app.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT
        )
    """)

    cursor.execute(
        "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
        (data.name, data.email, data.message)
    )

    conn.commit()
    conn.close()

    return {"success": True, "message": "Message received"}
