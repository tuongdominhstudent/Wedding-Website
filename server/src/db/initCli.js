import { db } from './index.js';

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name ASC")
  .all()
  .map((row) => row.name);

console.info('Database initialized.');
console.info('Tables:', tables.join(', '));
