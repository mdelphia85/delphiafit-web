from fastapi import APIRouter, HTTPException, Query
from db import get_connection
from datetime import datetime

router = APIRouter()

# ---------------------------------------------------------
# SAFE INTEGER CONVERSION
# ---------------------------------------------------------
def safe_int(value):
    try:
        return int(str(value).strip() or 0)
    except:
        return 0


# ---------------------------------------------------------
# WRITE DAILY LOG — FINAL PRODUCTION VERSION
# ---------------------------------------------------------
@router.post("/progress/log")
def write_log(
    email: str = Query(...),
    date: str = Query(...),
    protein: str = Query("0"),
    water: str = Query("0"),
    calories: str = Query("0"),
    meals: str = Query("0"),
    workouts: str = Query("0"),
    supplements: str = Query("0")
):
    try:
        # Convert all values safely
        protein = safe_int(protein)
        water = safe_int(water)
        calories = safe_int(calories)
        meals = safe_int(meals)
        workouts = safe_int(workouts)
        supplements = safe_int(supplements)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO daily_logs (
                email, date, protein, water, calories, meals, workouts, supplements
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(email, date) DO UPDATE SET
                protein = excluded.protein,
                water = excluded.water,
                calories = excluded.calories,
                meals = excluded.meals,
                workouts = excluded.workouts,
                supplements = excluded.supplements
        """, (email, date, protein, water, calories, meals, workouts, supplements))

        conn.commit()
        conn.close()

        return {"success": True}

    except Exception as e:
        print("🔥 BACKEND ERROR (write_log):", e)
        raise


# ---------------------------------------------------------
# GET TODAY'S LOG
# ---------------------------------------------------------
@router.get("/progress/today")
def get_today(email: str):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT protein, water, calories, meals, workouts, supplements
            FROM daily_logs
            WHERE email = ? AND date = date('now')
        """, (email,))

        row = cur.fetchone()
        conn.close()

        today = datetime.now().strftime("%Y-%m-%d")

        if row:
            return {
                "success": True,
                "date": today,
                "protein": row[0],
                "water": row[1],
                "calories": row[2],
                "meals": row[3],
                "workouts": row[4],
                "supplements": row[5]
            }

        # No entry for today — return zeros
        return {
            "success": True,
            "date": today,
            "protein": 0,
            "water": 0,
            "calories": 0,
            "meals": 0,
            "workouts": 0,
            "supplements": 0
        }

    except Exception as e:
        print("🔥 BACKEND ERROR (get_today):", e)
        raise

