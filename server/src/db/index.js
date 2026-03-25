import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from '../config/env.js';
import { schemaSql } from './schema.js';

function resolveDbPath(inputPath) {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }

  return path.resolve(process.cwd(), inputPath);
}

function ensureDatabaseDirectory(dbFilePath) {
  const directory = path.dirname(dbFilePath);
  fs.mkdirSync(directory, { recursive: true });
}

const resolvedDbPath = resolveDbPath(env.dbPath);
ensureDatabaseDirectory(resolvedDbPath);

const db = new Database(resolvedDbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(schemaSql);

const wishColumns = db.prepare("PRAGMA table_info(wishes)").all();
const hasPhotoDataColumn = wishColumns.some((column) => column.name === 'photo_data');

if (!hasPhotoDataColumn) {
  db.exec('ALTER TABLE wishes ADD COLUMN photo_data TEXT');
}

export { db };
