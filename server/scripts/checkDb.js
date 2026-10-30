// Run with: npm run db:check  -> lists tables to prove the schema was created.
import db from '../src/db.js';
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all();
console.log('Tables:', tables.map((t) => t.name).join(', '));
