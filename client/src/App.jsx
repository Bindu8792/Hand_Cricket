// Stage 1 placeholder screen: proves React -> Express -> SQLite works end to end.
import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setError('Cannot reach the server. Is it running on port 4000?'));
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pitch-800 to-pitch-950 p-6">
      <div className="max-w-md w-full text-center rounded-2xl bg-pitch-900/70 border border-pitch-600 p-8 shadow-xl">
        <div className="text-6xl mb-2">🏏</div>
        <h1 className="text-3xl font-extrabold tracking-wide text-gold">HAND CRICKET CLUB</h1>
        <p className="mt-2 text-pitch-50/80">Multiplayer hand cricket. Coming together stage by stage.</p>
        <div className="mt-6 rounded-lg bg-pitch-950/60 p-4 text-sm">
          {error && <span className="text-red-400">{error}</span>}
          {!error && !health && <span>Checking server…</span>}
          {health && (
            <span className="text-pitch-400">
              Server and database OK · {health.users} registered players
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
