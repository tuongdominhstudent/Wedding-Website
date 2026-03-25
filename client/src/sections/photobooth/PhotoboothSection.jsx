import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createWish, getWishes } from '../../services/api/wishesApi';
import { PHOTOBOOTH_SECTION } from './photobooth.constants';
import styles from './PhotoboothSection.module.css';

const PHOTO_FILTERS = Object.freeze([
  Object.freeze({
    id: 'original',
    label: 'Gốc',
    cssFilter: 'none',
    canvasFilter: 'none'
  }),
  Object.freeze({
    id: 'soft',
    label: 'Mịn',
    cssFilter: 'brightness(1.07) contrast(0.94) saturate(1.04) blur(0.35px)',
    canvasFilter: 'brightness(1.07) contrast(0.94) saturate(1.04) blur(0.35px)'
  }),
  Object.freeze({
    id: 'warm',
    label: 'Ấm',
    cssFilter: 'brightness(1.04) contrast(0.95) saturate(1.08) sepia(0.08)',
    canvasFilter: 'brightness(1.04) contrast(0.95) saturate(1.08) sepia(0.08)'
  }),
  Object.freeze({
    id: 'film',
    label: 'Film',
    cssFilter: 'brightness(1.02) contrast(0.96) saturate(0.88) sepia(0.06) hue-rotate(-8deg)',
    canvasFilter: 'brightness(1.02) contrast(0.96) saturate(0.88) sepia(0.06) hue-rotate(-8deg)'
  }),
  Object.freeze({
    id: 'pearl',
    label: 'Pearl',
    cssFilter: 'brightness(1.08) contrast(0.9) saturate(0.92)',
    canvasFilter: 'brightness(1.08) contrast(0.9) saturate(0.92)'
  })
]);

function stopMediaStream(stream) {
  stream?.getTracks?.().forEach((track) => track.stop());
}

function getPhotoFilter(filterId) {
  return PHOTO_FILTERS.find((filter) => filter.id === filterId) ?? PHOTO_FILTERS[0];
}

function applyFilmGrain(context, width, height, intensity = 20) {
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const grain = (Math.random() - 0.5) * intensity;
    pixels[index] = Math.max(0, Math.min(255, pixels[index] + grain));
    pixels[index + 1] = Math.max(0, Math.min(255, pixels[index + 1] + grain));
    pixels[index + 2] = Math.max(0, Math.min(255, pixels[index + 2] + grain));
  }

  context.putImageData(imageData, 0, 0);
}

function renderImageToDataUrl(image, filterId) {
  const { canvasFilter } = getPhotoFilter(filterId);
  const maxWidth = 900;
  const scale = Math.min(1, maxWidth / image.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas context unavailable');
  }

  context.filter = canvasFilter;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  context.filter = 'none';
  if (filterId === 'film') {
    applyFilmGrain(context, canvas.width, canvas.height, 16);
  }
  return canvas.toDataURL('image/jpeg', 0.84);
}

function applyFilterToDataUrl(dataUrl, filterId) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        resolve(renderImageToDataUrl(image, filterId));
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => reject(new Error('Image decode failed'));
    image.src = dataUrl;
  });
}

function resizeImageDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const image = new Image();
      image.onload = () => {
        try {
          resolve(renderImageToDataUrl(image, 'original'));
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = () => reject(new Error('Image decode failed'));
      image.src = typeof fileReader.result === 'string' ? fileReader.result : '';
    };

    fileReader.onerror = () => reject(new Error('File read failed'));
    fileReader.readAsDataURL(file);
  });
}

function PhotoboothSection() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const captureTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [cameraState, setCameraState] = useState('idle');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sourcePhotoData, setSourcePhotoData] = useState('');
  const [photoData, setPhotoData] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedWishes, setSavedWishes] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(PHOTO_FILTERS[0].id);

  const hasPreview = photoData.length > 0;
  const isCountingDown = countdown !== null;
  const canSubmit = name.trim() && message.trim() && hasPreview && !isSubmitting;
  const activeFilter = useMemo(() => getPhotoFilter(selectedFilter), [selectedFilter]);
  const isFilmFilter = selectedFilter === 'film';

  const clearCaptureCountdown = () => {
    if (captureTimeoutRef.current) {
      window.clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    setCountdown(null);
  };

  useEffect(() => {
    let isActive = true;

    getWishes({ limit: 6 })
      .then((response) => {
        if (isActive) {
          setSavedWishes(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
      clearCaptureCountdown();
      stopMediaStream(streamRef.current);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    if (!sourcePhotoData) {
      setPhotoData('');
      return undefined;
    }

    applyFilterToDataUrl(sourcePhotoData, selectedFilter)
      .then((nextPhotoData) => {
        if (isActive) {
          setPhotoData(nextPhotoData);
        }
      })
      .catch(() => {
        if (isActive) {
          setError(PHOTOBOOTH_SECTION.submitError);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedFilter, sourcePhotoData]);

  const recentWishes = useMemo(
    () => savedWishes.filter((wish) => wish.photoData).slice(0, 4),
    [savedWishes]
  );

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      setError(PHOTOBOOTH_SECTION.cameraUnavailable);
      return;
    }

    setError('');
    setFeedback('');

    try {
      stopMediaStream(streamRef.current);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720, max: 960 },
          height: { ideal: 960, max: 1280 },
          frameRate: { ideal: 24, max: 30 }
        },
        audio: false
      });

      streamRef.current = stream;
      setCameraState('live');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch {
      setCameraState('unsupported');
      setError(PHOTOBOOTH_SECTION.permissionError);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      return;
    }

    const canvas = document.createElement('canvas');
    const maxWidth = 900;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.filter = activeFilter.canvasFilter;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    if (selectedFilter === 'film') {
      applyFilmGrain(context, canvas.width, canvas.height, 16);
    }

    const capturedPhoto = canvas.toDataURL('image/jpeg', 0.86);
    setSourcePhotoData(capturedPhoto);
    setPhotoData(capturedPhoto);
    setCameraState('captured');
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    clearCaptureCountdown();
  };

  const startCaptureCountdown = () => {
    if (isCountingDown) {
      return;
    }

    setCountdown(3);

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((current) => {
        if (current === null || current <= 1) {
          if (countdownIntervalRef.current) {
            window.clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return null;
        }

        return current - 1;
      });
    }, 1000);

    captureTimeoutRef.current = window.setTimeout(() => {
      capturePhoto();
    }, 3000);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError('');
    setFeedback('');

    try {
      const nextPhotoData = await resizeImageDataUrl(file);
      setSourcePhotoData(nextPhotoData);
      setCameraState('captured');
      clearCaptureCountdown();
    } catch {
      setError(PHOTOBOOTH_SECTION.submitError);
    }
  };

  const handleRetake = () => {
    setSourcePhotoData('');
    setPhotoData('');
    setFeedback('');
    setError('');
    clearCaptureCountdown();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    openCamera();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setFeedback('');

    try {
      const response = await createWish({
        name: name.trim(),
        message: message.trim(),
        photoData
      });

      const createdWish = response.data;
      setSavedWishes((current) => [createdWish, ...current].slice(0, 8));
      setName('');
      setMessage('');
      setSourcePhotoData('');
      setPhotoData('');
      setCameraState('idle');
      setFeedback(PHOTOBOOTH_SECTION.submitSuccess);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      setError(PHOTOBOOTH_SECTION.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="photobooth-section" className={styles.section} aria-label="Photobooth guestbook section">
      <div className={styles.inner}>
        <div className={styles.copyBlock}>
          <p className={styles.eyebrow}>{PHOTOBOOTH_SECTION.eyebrow}</p>
          <h2 className={styles.title}>{PHOTOBOOTH_SECTION.title}</h2>
          <p className={styles.description}>{PHOTOBOOTH_SECTION.description}</p>
        </div>

        <div className={styles.layout}>
          <form className={styles.studioCard} onSubmit={handleSubmit}>
            <div className={styles.previewFrame}>
              {hasPreview ? (
                <img
                  src={photoData}
                  alt="Captured photobooth preview"
                  className={styles.previewImage}
                  style={{ filter: activeFilter.cssFilter }}
                />
              ) : (
                <video
                  ref={videoRef}
                  className={styles.previewVideo}
                  playsInline
                  muted
                  style={{ filter: activeFilter.cssFilter }}
                />
              )}
              {isFilmFilter ? <div className={styles.filmGrainOverlay} aria-hidden="true" /> : null}
              {isCountingDown ? (
                <div className={styles.countdownOverlay} aria-live="polite">
                  <span className={styles.countdownValue}>{countdown}</span>
                </div>
              ) : null}
              {cameraState === 'live' ? (
                <button
                  type="button"
                  className={styles.shutterButton}
                  onClick={startCaptureCountdown}
                  aria-label={isCountingDown ? `Chụp sau ${countdown} giây` : 'Chụp ảnh'}
                >
                  <span className={styles.shutterCore} />
                </button>
              ) : null}
              <div className={styles.frameCaption}>Live photobooth</div>
            </div>

            <div className={styles.filterRow} aria-label="Chọn filter ảnh">
              {PHOTO_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`${styles.filterChip} ${
                    selectedFilter === filter.id ? styles.filterChipActive : ''
                  }`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className={styles.actionRow}>
              {cameraState !== 'live' && !hasPreview ? (
                <button type="button" className={styles.primaryButton} onClick={openCamera}>
                  Mở camera
                </button>
              ) : null}
              {hasPreview ? (
                <button type="button" className={styles.secondaryButton} onClick={handleRetake}>
                  Chụp lại
                </button>
              ) : null}
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => fileInputRef.current?.click()}
              >
                Chọn ảnh có sẵn
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleUpload}
              />
            </div>

            <label className={styles.field}>
              <span>Tên của bạn</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={styles.input}
                placeholder="Viết tên ở đây"
                maxLength={80}
              />
            </label>

            <label className={styles.field}>
              <span>Lời chúc</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={styles.textarea}
                placeholder="Viết đôi lời cho tụi mình"
                rows={4}
                maxLength={1200}
              />
            </label>

            {error ? <p className={styles.errorText}>{error}</p> : null}
            {feedback ? <p className={styles.successText}>{feedback}</p> : null}

            <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu ảnh và lời chúc'}
            </button>
          </form>

          <div className={styles.galleryCard}>
            <p className={styles.galleryLabel}>Những tấm ảnh vừa được lưu</p>
            <div className={styles.polaroidGrid}>
              {recentWishes.length > 0 ? (
                recentWishes.map((wish) => (
                  <article key={wish.id} className={styles.polaroid}>
                    <img src={wish.photoData} alt="" className={styles.polaroidImage} />
                    <div className={styles.polaroidBody}>
                      <p className={styles.polaroidName}>{wish.name}</p>
                      <p className={styles.polaroidMessage}>{wish.message}</p>
                    </div>
                  </article>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Chưa có ảnh nào được lưu. Gửi tấm đầu tiên để section này bắt đầu sống.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhotoboothSection;
