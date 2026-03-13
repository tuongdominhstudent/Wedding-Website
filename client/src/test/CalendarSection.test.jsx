import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CalendarSection from '../sections/calendar/CalendarSection';

describe('CalendarSection', () => {
  it('renders the wedding date bridge content', () => {
    render(<CalendarSection />);

    expect(screen.getByRole('heading', { name: /10 july 2027/i })).toBeInTheDocument();
    expect(screen.getByText(/wedding weekend/i)).toBeInTheDocument();
    expect(screen.getByAltText(/calendar artwork highlighting the wedding date/i)).toBeInTheDocument();
    expect(screen.getByText(/một khoảng lặng thật đẹp/i)).toBeInTheDocument();
  });
});
