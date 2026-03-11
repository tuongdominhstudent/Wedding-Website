import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CAMERA_PRESETS } from './config/cameraPresets';
import { getQualityProfile } from './config/quality';
import BaseScene from './scene/BaseScene';

function CanvasStage() {
  const quality = getQualityProfile();

  return (
    <Canvas
      dpr={quality.dpr}
      camera={CAMERA_PRESETS.default}
      gl={{
        alpha: true,
        antialias: quality.antialias,
        powerPreference: 'high-performance'
      }}
      frameloop="always"
      eventSource={document.getElementById('story-layout') || undefined}
      eventPrefix="client"
    >
      <Suspense fallback={null}>
        <BaseScene />
      </Suspense>
    </Canvas>
  );
}

export default CanvasStage;
