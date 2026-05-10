import os
import sqlite3

# Resolve absolute path to backend directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # src/backend

# Absolute path to the database file
DB_PATH = os.path.join(BASE_DIR, "data", "app.db")     # src/backend/data/app.db

def get_connection():
    return sqlite3.connect(DB_PATH)
