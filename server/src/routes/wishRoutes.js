import { Router } from 'express';
import { createWishHandler, getWishesHandler } from '../controllers/wishController.js';

const wishRoutes = Router();

wishRoutes.get('/', getWishesHandler);
wishRoutes.post('/', createWishHandler);

export { wishRoutes };
