// Database setup: opens SQLite and creates every table the app needs.
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const dbFile = process.env.DB_FILE || './data/handcricket.db';
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new Database(dbFile);
db.pragma('journal_mode = WAL'); // better concurrent reads
db.pragma('foreign_keys = ON');  // enforce relationships

db.exec(`
-- Players. Only the bcrypt HASH is stored, never the password.
CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  username       TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash  TEXT NOT NULL,
  avatar         TEXT NOT NULL DEFAULT 'bat',
  total_matches  INTEGER NOT NULL DEFAULT 0,
  wins           INTEGER NOT NULL DEFAULT 0,
  losses         INTEGER NOT NULL DEFAULT 0,
  total_runs     INTEGER NOT NULL DEFAULT 0,
  highest_score  INTEGER NOT NULL DEFAULT 0,
  last_seen      TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Friend requests and friendships (one row per pair).
CREATE TABLE IF NOT EXISTS friendships (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (requester_id != addressee_id)            -- no self-requests
);
-- Blocks duplicates in EITHER direction (A->B and B->A count as the same pair).
CREATE UNIQUE INDEX IF NOT EXISTS ux_friend_pair
  ON friendships (MIN(requester_id, addressee_id), MAX(requester_id, addressee_id));

-- Challenge invitations.
CREATE TABLE IF NOT EXISTS challenges (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  challenger_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opponent_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  format        TEXT NOT NULL DEFAULT '1 innings each, 3 wickets',
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','accepted','rejected','cancelled','expired','completed')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at    TEXT NOT NULL,
  responded_at  TEXT,
  CHECK (challenger_id != opponent_id)
);

-- Completed matches (used for history, leaderboard and stats).
CREATE TABLE IF NOT EXISTS matches (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id    INTEGER REFERENCES challenges(id),
  player1_id      INTEGER NOT NULL REFERENCES users(id),
  player2_id      INTEGER NOT NULL REFERENCES users(id),
  toss_winner_id  INTEGER REFERENCES users(id),
  first_batter_id INTEGER REFERENCES users(id),
  player1_score   INTEGER NOT NULL DEFAULT 0,
  player2_score   INTEGER NOT NULL DEFAULT 0,
  player1_wickets INTEGER NOT NULL DEFAULT 0,
  player2_wickets INTEGER NOT NULL DEFAULT 0,
  winner_id       INTEGER REFERENCES users(id),   -- NULL = tie
  played_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ball-by-ball record (for match statistics).
CREATE TABLE IF NOT EXISTS match_balls (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id       INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  innings        INTEGER NOT NULL CHECK (innings IN (1,2)),
  ball_no        INTEGER NOT NULL,
  batter_id      INTEGER NOT NULL REFERENCES users(id),
  bowler_id      INTEGER NOT NULL REFERENCES users(id),
  batter_number  INTEGER NOT NULL CHECK (batter_number BETWEEN 1 AND 6),
  bowler_number  INTEGER NOT NULL CHECK (bowler_number BETWEEN 1 AND 6),
  runs           INTEGER NOT NULL DEFAULT 0,
  is_out         INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_challenges_opponent ON challenges (opponent_id, status);
CREATE INDEX IF NOT EXISTS ix_matches_players ON matches (player1_id, player2_id);
`);

export default db;
