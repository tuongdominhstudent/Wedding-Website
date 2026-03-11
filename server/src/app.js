import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { API_PREFIX } from './config/constants.js';
import { env } from './config/env.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { wishRoutes } from './routes/wishRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';

const app = express();

const corsOptions = env.clientOrigin
  ? {
      origin: env.clientOrigin
    }
  : undefined;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/wishes`, wishRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
