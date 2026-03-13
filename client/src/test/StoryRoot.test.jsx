import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import StoryRoot from '../sections/StoryRoot';

vi.mock('../sections/intro/IntroSection', () => ({
  default: ({ onSequenceComplete }) => (
    <button type="button" onClick={() => onSequenceComplete('completed')}>
      unlock story
    </button>
  )
}));

vi.mock('../sections/firsts/FirstsJourneySection', () => ({
  default: () => <div data-testid="firsts-section">Firsts Section</div>
}));

vi.mock('../sections/distance/LongDistanceJourneySection', () => ({
  default: () => <div data-testid="distance-section">Long Distance Section</div>
}));

vi.mock('../sections/prewedding/PreweddingSection', () => ({
  default: () => <div data-testid="prewedding-section">Prewedding Section</div>
}));

vi.mock('../sections/calendar/CalendarSection', () => ({
  default: () => <div data-testid="calendar-section">Calendar Section</div>
}));

vi.mock('../sections/logistics/LogisticsSection', () => ({
  default: () => <div data-testid="logistics-section">Logistics Section</div>
}));

vi.mock('../sections/gift/GiftQrSection', () => ({
  default: () => <div data-testid="gift-section">Gift Section</div>
}));

describe('StoryRoot', () => {
  it('unlocks the currently implemented story sections after intro exit', () => {
    render(<StoryRoot isBootReady />);

    expect(screen.queryByTestId('firsts-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('distance-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prewedding-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('calendar-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logistics-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('gift-section')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /unlock story/i }));

    expect(screen.getByTestId('firsts-section')).toBeInTheDocument();
    expect(screen.getByTestId('distance-section')).toBeInTheDocument();
    expect(screen.getByTestId('prewedding-section')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-section')).toBeInTheDocument();
    expect(screen.getByTestId('logistics-section')).toBeInTheDocument();
    expect(screen.getByTestId('gift-section')).toBeInTheDocument();
  });
});
