import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PhotoboothSection from '../sections/photobooth/PhotoboothSection';
import { createWish } from '../services/api/wishesApi';

vi.mock('../services/api/wishesApi', () => ({
  getWishes: vi.fn(() => Promise.resolve({ data: [] })),
  createWish: vi.fn(() =>
    Promise.resolve({
      data: {
        id: 'wish-1',
        name: 'Minh',
        message: 'Chuc mung',
        photoData: 'data:image/jpeg;base64,abc',
        createdAt: '2026-03-14T00:00:00.000Z'
      }
    })
  )
}));

describe('PhotoboothSection', () => {
  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn()
    }));
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/jpeg;base64,abc');
    navigator.mediaDevices = {
      getUserMedia: vi.fn(() =>
        Promise.resolve({
          getTracks: () => [{ stop: vi.fn() }]
        })
      )
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the photobooth form and recent gallery shell', async () => {
    render(<PhotoboothSection />);

    expect(screen.getByRole('heading', { name: /lưu lại một bức ảnh/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mở camera/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mịn/i })).toBeInTheDocument();
    expect(await screen.findByText(/chưa có ảnh nào được lưu/i)).toBeInTheDocument();
  });

  it('captures and submits a wish with photo data', async () => {
    render(<PhotoboothSection />);

    fireEvent.click(screen.getByRole('button', { name: /mở camera/i }));
    await waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled());

    const video = screen.getByLabelText('Photobooth guestbook section').querySelector('video');
    Object.defineProperty(video, 'videoWidth', { value: 720, configurable: true });
    Object.defineProperty(video, 'videoHeight', { value: 960, configurable: true });

    fireEvent.click(screen.getByRole('button', { name: /chụp ảnh/i }));
    expect(screen.getByText('3')).toBeInTheDocument();
    await new Promise((resolve) => {
      window.setTimeout(resolve, 3100);
    });
    fireEvent.change(screen.getByPlaceholderText(/viết tên ở đây/i), { target: { value: 'Minh' } });
    fireEvent.change(screen.getByPlaceholderText(/viết đôi lời/i), {
      target: { value: 'Tram nam hanh phuc' }
    });

    fireEvent.click(screen.getByRole('button', { name: /lưu ảnh và lời chúc/i }));

    expect(await screen.findByText(/đã lưu ảnh và lời chúc/i)).toBeInTheDocument();
    expect(createWish).toHaveBeenCalledWith({
      name: 'Minh',
      message: 'Tram nam hanh phuc',
      photoData: 'data:image/jpeg;base64,abc'
    });
    expect(screen.getByText(/chuc mung/i)).toBeInTheDocument();
  }, 10000);
});
