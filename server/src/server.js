import { app } from './app.js';
import { env } from './config/env.js';
import './db/index.js';

app.listen(env.port, () => {
  console.info(`Wedding server listening on http://localhost:${env.port}`);
});
