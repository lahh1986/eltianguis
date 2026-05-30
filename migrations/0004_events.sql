CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  type        TEXT    NOT NULL,
  path        TEXT,
  skill_slug  TEXT,
  ref         TEXT,
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  ua_hash     TEXT,
  ip_hash     TEXT,
  session_id  TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_type    ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_skill   ON events(skill_slug);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
