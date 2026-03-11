import { LIGHT_PRESETS } from '../config/lightPresets';

function BaseScene() {
  const preset = LIGHT_PRESETS.softStudio;

  return (
    <>
      <ambientLight intensity={preset.ambient.intensity} />
      <directionalLight
        position={preset.key.position}
        intensity={preset.key.intensity}
        castShadow={false}
      />
      <directionalLight position={preset.rim.position} intensity={preset.rim.intensity} />
      <group name="future-scene-root" />
    </>
  );
}

export default BaseScene;
