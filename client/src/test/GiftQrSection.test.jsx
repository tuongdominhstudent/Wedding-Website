import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import GiftQrSection from '../sections/gift/GiftQrSection';

describe('GiftQrSection', () => {
  it('renders a dedicated gifting destination', () => {
    render(<GiftQrSection />);

    expect(screen.getByRole('heading', { name: /a little blessing for our new chapter/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/gift qr placeholder/i)).toBeInTheDocument();
    expect(screen.getByText(/sample account/i)).toBeInTheDocument();
    expect(screen.getByText(/0000 1234 5678 90/i)).toBeInTheDocument();
  });
});
