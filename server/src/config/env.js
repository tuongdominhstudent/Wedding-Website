import dotenv from 'dotenv';

dotenv.config();

function normalizePort(rawPort) {
  const parsed = Number.parseInt(rawPort, 10);
  if (!Number.isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  return 4000;
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: normalizePort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN || '',
  dbPath: process.env.DB_PATH || './data/wedding.sqlite'
});
