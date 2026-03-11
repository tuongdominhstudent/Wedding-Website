const DEFAULT_HEADERS = Object.freeze({
  'Content-Type': 'application/json'
});

export async function httpClient(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get('content-type');
  const isJsonResponse = contentType?.includes('application/json');
  const payload = isJsonResponse ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'API request failed');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
