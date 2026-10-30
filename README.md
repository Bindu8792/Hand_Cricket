# Hand Cricket Club

Real-time multiplayer hand cricket.

| Folder | What it is |
|---|---|
| `server/` | Node.js + Express REST API, Socket.IO, SQLite (better-sqlite3) |
| `client/` | React + Vite + Tailwind CSS front end |
| `python-game/` | Separate Python/Jupyter version for MBIS4003 A1 Part A |

## Run locally
```bash
# Terminal 1
cd server && cp .env.example .env && npm install && npm run db:check && npm run dev
# Terminal 2
cd client && npm install && npm run dev      # open http://localhost:5173
```
