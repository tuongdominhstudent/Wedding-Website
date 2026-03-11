import { useEffect, useRef } from 'react';
import styles from './DarkVeil.module.css';

function hexToRgbArray(hex) {
  const value = hex.replace('#', '');
  const normalized =
    value.length === 3 ? value.split('').map((char) => `${char}${char}`).join('') : value;
  const intVal = Number.parseInt(normalized, 16);
  const r = ((intVal >> 16) & 255) / 255;
  const g = ((intVal >> 8) & 255) / 255;
  const b = (intVal & 255) / 255;
  return [r, g, b];
}

function DarkVeil({
  speed = 0.52,
  noiseIntensity = 0.045,
  scanlineIntensity = 0.045,
  scanlineFrequency = 1.35,
  warpAmount = 0.18,
  colorA = '#320010',
  colorB = '#490018',
  colorC = '#724032',
  resolutionScale = 1
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement || null;
    const ctx = canvas?.getContext('2d', { alpha: true });

    if (!canvas || !parent || !ctx) {
      return undefined;
    }

    const rgbA = hexToRgbArray(colorA);
    const rgbB = hexToRgbArray(colorB);
    const rgbC = hexToRgbArray(colorC);

    let width = 0;
    let height = 0;
    let scanlinePhase = 0;
    let noiseData = null;

    const resize = () => {
      width = Math.max(1, Math.floor(parent.clientWidth));
      height = Math.max(1, Math.floor(parent.clientHeight));

      const dpr = Math.min(window.devicePixelRatio || 1, 2) * resolutionScale;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = width;
      noiseCanvas.height = height;
      const noiseCtx = noiseCanvas.getContext('2d');
      if (noiseCtx) {
        const img = noiseCtx.createImageData(width, height);
        for (let i = 0; i < img.data.length; i += 4) {
          const v = Math.random() * 255;
          img.data[i] = v;
          img.data[i + 1] = v;
          img.data[i + 2] = v;
          img.data[i + 3] = 255;
        }
        noiseCtx.putImageData(img, 0, 0);
        noiseData = noiseCanvas;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    let rafId = 0;

    const render = () => {
      const t = performance.now() * 0.001 * speed;
      scanlinePhase += 0.6 + speed;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const wobble = Math.sin(t * 0.9) * warpAmount;
      gradient.addColorStop(
        0,
        `rgb(${Math.round((rgbA[0] + wobble * 0.08) * 255)} ${Math.round(rgbA[1] * 255)} ${Math.round(
          rgbA[2] * 255
        )})`
      );
      gradient.addColorStop(
        0.56,
        `rgb(${Math.round(rgbB[0] * 255)} ${Math.round((rgbB[1] + wobble * 0.05) * 255)} ${Math.round(
          rgbB[2] * 255
        )})`
      );
      gradient.addColorStop(
        1,
        `rgb(${Math.round(rgbC[0] * 255)} ${Math.round(rgbC[1] * 255)} ${Math.round(rgbC[2] * 255)})`
      );

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        width * 0.1,
        width * 0.5,
        height * 0.5,
        width * 0.9
      );
      vignette.addColorStop(0, 'rgba(255, 230, 209, 0.08)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (scanlineIntensity > 0) {
        ctx.save();
        ctx.globalAlpha = scanlineIntensity;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        const gap = Math.max(2, Math.floor(14 / Math.max(0.3, scanlineFrequency)));
        for (let y = (scanlinePhase % gap) - gap; y < height + gap; y += gap) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      if (noiseData && noiseIntensity > 0) {
        ctx.save();
        ctx.globalAlpha = noiseIntensity;
        ctx.drawImage(noiseData, 0, 0);
        ctx.restore();
      }

      rafId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [
    speed,
    noiseIntensity,
    scanlineIntensity,
    scanlineFrequency,
    warpAmount,
    colorA,
    colorB,
    colorC,
    resolutionScale
  ]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

export default DarkVeil;
