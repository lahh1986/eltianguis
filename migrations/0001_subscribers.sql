CREATE TABLE IF NOT EXISTS subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL UNIQUE,
  source     TEXT    NOT NULL DEFAULT 'home',
  ua_hash    TEXT,
  ip_hash    TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  confirmed  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers(created_at);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);
