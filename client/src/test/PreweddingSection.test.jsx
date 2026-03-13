import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PreweddingSection from '../sections/prewedding/PreweddingSection';

const { playMock, pauseMock, observeMock, disconnectMock } = vi.hoisted(() => ({
  playMock: vi.fn(() => Promise.resolve()),
  pauseMock: vi.fn(),
  observeMock: vi.fn(),
  disconnectMock: vi.fn()
}));

describe('PreweddingSection', () => {
  let observerCallback;

  beforeEach(() => {
    observerCallback = null;
    window.IntersectionObserver = class {
      constructor(callback) {
        observerCallback = callback;
      }

      observe = observeMock;

      disconnect = disconnectMock;
    };

    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dedicated prewedding video section', () => {
    render(<PreweddingSection />);

    expect(screen.getByText(/prewedding film/i)).toBeInTheDocument();
    expect(screen.getByText(/lời hẹn ước/i)).toBeInTheDocument();
    expect(screen.getByText(/dành hết cho em/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Prewedding video')).toBeInTheDocument();
    expect(observeMock).toHaveBeenCalled();
  });

  it('plays in view and pauses out of view', () => {
    render(<PreweddingSection />);

    observerCallback?.([{ isIntersecting: true }]);
    observerCallback?.([{ isIntersecting: false }]);

    expect(playMock).toHaveBeenCalled();
    expect(pauseMock).toHaveBeenCalled();
  });
});
