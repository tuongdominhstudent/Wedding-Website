import '@testing-library/jest-dom/vitest';

Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  writable: true,
  value: () => Promise.resolve()
});

Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  writable: true,
  value: () => {}
});
