CREATE TABLE IF NOT EXISTS daily_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- User association
    email TEXT NOT NULL,

    -- Date of the log (YYYY-MM-DD)
    date TEXT NOT NULL,

    -- Core tracked metrics
    protein INTEGER DEFAULT 0,
    water INTEGER DEFAULT 0,
    calories INTEGER DEFAULT 0,
    meals INTEGER DEFAULT 0,
    workouts INTEGER DEFAULT 0,
    supplements INTEGER DEFAULT 0,

    -- Prevent duplicate logs for the same day
    UNIQUE(email, date)
);
