import { z } from 'zod';
import { DEFAULT_WISH_LIMIT, MAX_WISH_LIMIT } from '../config/constants.js';

export const createWishSchema = z.object({
  name: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(1200)
});

export const listWishesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_WISH_LIMIT).default(DEFAULT_WISH_LIMIT),
  offset: z.coerce.number().int().min(0).default(0)
});
