import { nanoid } from 'nanoid';
import { db } from '../db/index.js';

const listWishesStmt = db.prepare(`
  SELECT id, name, message, created_at AS createdAt
  FROM wishes
  ORDER BY datetime(created_at) DESC
  LIMIT @limit OFFSET @offset
`);

const countWishesStmt = db.prepare('SELECT COUNT(*) AS total FROM wishes');

const insertWishStmt = db.prepare(`
  INSERT INTO wishes (id, name, message, created_at)
  VALUES (@id, @name, @message, @created_at)
`);

const getWishByIdStmt = db.prepare(`
  SELECT id, name, message, created_at AS createdAt
  FROM wishes
  WHERE id = ?
`);

export function listWishes({ limit, offset }) {
  const items = listWishesStmt.all({ limit, offset });
  const total = countWishesStmt.get().total;

  return {
    items,
    total
  };
}

export function createWish(input) {
  const record = {
    id: nanoid(12),
    name: input.name,
    message: input.message,
    created_at: new Date().toISOString()
  };

  insertWishStmt.run(record);
  return getWishByIdStmt.get(record.id);
}
