CREATE TABLE IF NOT EXISTS broadcasts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  subject      TEXT    NOT NULL,
  body_md      TEXT    NOT NULL,
  sent_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  recipients   INTEGER NOT NULL DEFAULT 0,
  succeeded    INTEGER NOT NULL DEFAULT 0,
  failed       INTEGER NOT NULL DEFAULT 0,
  duration_ms  INTEGER NOT NULL DEFAULT 0,
  test_only    INTEGER NOT NULL DEFAULT 0,
  notes        TEXT
);

CREATE INDEX IF NOT EXISTS idx_broadcasts_sent ON broadcasts(sent_at);
