# api/user.py
from fastapi import APIRouter, HTTPException
import sqlite3

router = APIRouter()

@router.get("/user/data")
def get_user_data(email: str):
    try:
        conn = sqlite3.connect("data/app.db")
        cur = conn.cursor()

        cur.execute("""
            SELECT
                name,
                dob,
                height,
                height_unit,
                starting_weight,
                current_weight,
                goal_weight,
                weight_unit
            FROM users
            WHERE email = ?
        """, (email,))

        row = cur.fetchone()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "success": True,
            "name": row[0],
            "dob": row[1],
            "height": row[2],
            "heightUnit": row[3],
            "startingWeight": row[4],
            "currentWeight": row[5],
            "goalWeight": row[6],
            "weightUnit": row[7],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
