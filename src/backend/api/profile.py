from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3

router = APIRouter()

class ProfileData(BaseModel):
    name: str
    dob: str
    weightUnit: str
    heightUnit: str
    startingWeight: float
    currentWeight: float
    goalWeight: float
    height: float
    email: str


# ⭐ UPDATE PROFILE
@router.post("/profile/update")
def update_profile(data: ProfileData):
    try:
        conn = sqlite3.connect("data/app.db")
        cur = conn.cursor()

        cur.execute("""
            UPDATE users SET
                name = ?,
                dob = ?,
                weight_unit = ?,
                height_unit = ?,
                starting_weight = ?,
                current_weight = ?,
                goal_weight = ?,
                height = ?,
                profile_complete = 1
            WHERE email = ?
        """, (
            data.name,
            data.dob,
            data.weightUnit,
            data.heightUnit,
            data.startingWeight,
            data.currentWeight,
            data.goalWeight,
            data.height,
            data.email
        ))

        conn.commit()
        conn.close()

        return {"success": True, "message": "Profile updated and marked complete"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ⭐ GET PROFILE (THE MISSING ROUTE)
@router.post("/profile/get")
def get_profile(data: dict):
    try:
        conn = sqlite3.connect("data/app.db")
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                name,
                dob,
                weight_unit,
                height_unit,
                starting_weight,
                current_weight,
                goal_weight,
                height
            FROM users
            WHERE email = ?
        """, (data["email"],))

        row = cur.fetchone()
        conn.close()

        if row:
            return {
                "success": True,
                "name": row[0],
                "dob": row[1],
                "weight_unit": row[2],
                "height_unit": row[3],
                "starting_weight": row[4],
                "current_weight": row[5],
                "goal_weight": row[6],
                "height": row[7]
            }

        return {"success": False, "message": "User not found"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
