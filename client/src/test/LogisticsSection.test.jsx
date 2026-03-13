import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LogisticsSection from '../sections/logistics/LogisticsSection';

describe('LogisticsSection', () => {
  it('renders readable event details and actionable map link', () => {
    render(<LogisticsSection />);

    expect(screen.getByRole('heading', { name: /join us in hanoi/i })).toBeInTheDocument();
    expect(screen.getByText(/saturday, july 10, 2027/i)).toBeInTheDocument();
    expect(screen.getByText(/riverside garden hall/i)).toBeInTheDocument();
    expect(screen.getByTitle(/venue map preview/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open in google maps/i })).toHaveAttribute(
      'href',
      expect.stringContaining('google.com/maps')
    );
  });
});
