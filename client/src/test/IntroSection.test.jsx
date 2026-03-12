import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetAppStore, useAppStore } from '../stores/useAppStore';

const { lenisMock, refreshMock, timelineKillMock } = vi.hoisted(() => ({
  lenisMock: {
    stop: vi.fn(),
    start: vi.fn(),
    resize: vi.fn()
  },
  refreshMock: vi.fn(),
  timelineKillMock: vi.fn()
}));

vi.mock('../components/effects/DarkVeil', () => ({
  default: () => <div data-testid="dark-veil" />
}));

vi.mock('../sections/intro/intro.constants', () => ({
  INTRO_SEQUENCE: {
    escapeDelayMs: 10,
    videoCardScaleDesktop: 0.52,
    videoCardScaleMobile: 0.36,
    stackShiftXDesktop: 0,
    stackShiftXMobile: 0,
    videoCardShiftXDesktop: 0,
    videoCardShiftXMobile: 0,
    videoCardShiftYDesktop: 0,
    videoCardShiftYMobile: 0,
    centerCardShiftXDesktop: 0,
    centerCardShiftXMobile: 0,
    centerCardShiftYDesktop: 0,
    centerCardShiftYMobile: 0,
    photoShiftXDesktop: 0,
    photoShiftXMobile: 0,
    photoShiftYDesktop: 0,
    photoShiftYMobile: 0,
    sideCardOffsetXDesktop: 330,
    sideCardOffsetXMobile: 85,
    sideCardLiftDesktop: 212,
    sideCardDropDesktop: 268,
    sideCardLiftMobile: 150,
    sideCardDropMobile: 150,
    ringDrawDuration: 1.2,
    romanticContinueLabel: 'Tiep tuc hanh trinh'
  }
}));

vi.mock('../motion/gsap/gsapConfig', () => ({
  ScrollTrigger: {
    refresh: refreshMock
  },
  gsap: {
    set: vi.fn(),
    timeline: ({ onComplete }) => {
      if (typeof onComplete === 'function') {
        window.setTimeout(onComplete, 0);
      }

      const chain = {
        to: () => chain,
        kill: timelineKillMock
      };

      return chain;
    }
  }
}));

import IntroSection from '../sections/intro/IntroSection';

describe('IntroSection', () => {
  beforeEach(() => {
    resetAppStore();
    useAppStore.setState({ lenisInstance: lenisMock });
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
    window.IntersectionObserver = class {
      constructor() {}

      observe() {}

      disconnect() {}
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetAppStore();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  });

  it('shows a delayed romantic escape action and unlocks the story without deadlock', async () => {
    const onSequenceComplete = vi.fn();

    render(<IntroSection isBootReady onSequenceComplete={onSequenceComplete} />);

    expect(screen.queryByRole('button', { name: /tiep tuc hanh trinh/i })).not.toBeInTheDocument();

    const escapeButton = await screen.findByRole('button', { name: /tiep tuc hanh trinh/i });
    fireEvent.click(escapeButton);

    await waitFor(() => {
      expect(onSequenceComplete).toHaveBeenCalledWith('escaped');
    });

    expect(lenisMock.start).toHaveBeenCalled();
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.touchAction).toBe('');
  });

  it('degrades playback failure into a polished still state', async () => {
    render(<IntroSection isBootReady onSequenceComplete={vi.fn()} />);

    const video = document.querySelector('video');
    expect(video).not.toBeNull();

    fireEvent.error(video);

    expect(await screen.findByAltText('Khoanh khac mo dau')).toBeInTheDocument();
  });

  it('resolves successful playback through the shared completion path', async () => {
    const onSequenceComplete = vi.fn();

    render(<IntroSection isBootReady onSequenceComplete={onSequenceComplete} />);

    const video = document.querySelector('video');
    fireEvent.ended(video);

    await waitFor(() => {
      expect(onSequenceComplete).toHaveBeenCalledWith('completed');
    });

    expect(refreshMock).toHaveBeenCalled();
  });
});
