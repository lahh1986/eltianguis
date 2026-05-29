ALTER TABLE subscribers ADD COLUMN unsubscribed_at INTEGER;
ALTER TABLE subscribers ADD COLUMN unsub_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_subscribers_active
  ON subscribers(unsubscribed_at)
  WHERE unsubscribed_at IS NULL;
