import { env } from '../../config/env';
import { httpClient } from './httpClient';

const WISHES_PATH = '/wishes';

export function getWishes(params = {}) {
  const query = new URLSearchParams();

  if (params.limit) {
    query.set('limit', String(params.limit));
  }

  if (params.offset) {
    query.set('offset', String(params.offset));
  }

  const queryString = query.toString();
  const url = `${env.apiBaseUrl}${WISHES_PATH}${queryString ? `?${queryString}` : ''}`;
  return httpClient(url);
}

export function createWish(payload) {
  const url = `${env.apiBaseUrl}${WISHES_PATH}`;
  return httpClient(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
