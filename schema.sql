-- Bemdic Social Features Database Schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  friend_code TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 0,
  challenges_won INTEGER DEFAULT 0,
  challenges_lost INTEGER DEFAULT 0,
  challenges_drawn INTEGER DEFAULT 0,
  picture TEXT DEFAULT NULL,
  last_seen TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_device_id ON users(device_id);
CREATE INDEX IF NOT EXISTS idx_users_friend_code ON users(friend_code);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);

CREATE TABLE IF NOT EXISTS friends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER NOT NULL,
  addressee_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (addressee_id) REFERENCES users(id),
  UNIQUE(requester_id, addressee_id)
);
CREATE INDEX IF NOT EXISTS idx_friends_requester ON friends(requester_id);
CREATE INDEX IF NOT EXISTS idx_friends_addressee ON friends(addressee_id);

CREATE TABLE IF NOT EXISTS challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  sender_score INTEGER DEFAULT NULL,
  receiver_score INTEGER DEFAULT NULL,
  questions TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','completed','expired')),
  sender_points_awarded INTEGER DEFAULT 0,
  receiver_points_awarded INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT DEFAULT NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_challenges_receiver ON challenges(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_challenges_sender ON challenges(sender_id);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('challenge_received','challenge_result','friend_request','friend_accepted')),
  data TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at DESC);
