import { createWishSchema, listWishesQuerySchema } from '../validation/wishSchemas.js';
import { createWish, listWishes } from '../services/wishService.js';

export function getWishesHandler(req, res, next) {
  try {
    const query = listWishesQuerySchema.parse(req.query);
    const result = listWishes(query);

    res.status(200).json({
      data: result.items,
      meta: {
        total: result.total,
        limit: query.limit,
        offset: query.offset
      }
    });
  } catch (error) {
    next(error);
  }
}

export function createWishHandler(req, res, next) {
  try {
    const payload = createWishSchema.parse(req.body);
    const wish = createWish(payload);

    res.status(201).json({
      data: wish
    });
  } catch (error) {
    next(error);
  }
}
