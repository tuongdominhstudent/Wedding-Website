import { useFrame } from '@react-three/fiber';
import { Html, Line, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box3, CatmullRomCurve3, Group, MathUtils, TextureLoader, Vector3 } from 'three';
import { LONG_DISTANCE_ASSETS } from './longDistanceJourneyAssets';
import { LONG_DISTANCE_SECTION } from './longDistanceJourney.constants';
import styles from './LongDistanceGlobeScene.module.css';

function latLonToVector3(lat, lon, radius) {
  const phi = MathUtils.degToRad(90 - lat);
  const theta = MathUtils.degToRad(lon + 180);

  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const HANOI_VECTOR = latLonToVector3(
  LONG_DISTANCE_SECTION.locations.hanoi.lat,
  LONG_DISTANCE_SECTION.locations.hanoi.lon,
  LONG_DISTANCE_SECTION.earthSurfaceRadius
);

const MOSCOW_VECTOR = latLonToVector3(
  LONG_DISTANCE_SECTION.locations.moscow.lat,
  LONG_DISTANCE_SECTION.locations.moscow.lon,
  LONG_DISTANCE_SECTION.earthSurfaceRadius
);

function createRouteCurve() {
  const points = [];
  const startDirection = HANOI_VECTOR.clone().normalize();
  const endDirection = MOSCOW_VECTOR.clone().normalize();

  for (let index = 0; index <= 80; index += 1) {
    const t = index / 80;
    const point = startDirection.clone().lerp(endDirection, t).normalize();
    const lift =
      LONG_DISTANCE_SECTION.routeSurfaceOffset +
      Math.sin(Math.PI * t) * LONG_DISTANCE_SECTION.routeArcHeight;
    points.push(point.multiplyScalar(LONG_DISTANCE_SECTION.earthSurfaceRadius + lift));
  }

  return new CatmullRomCurve3(points);
}

function extractEmbeddedImageUrl(arrayBuffer) {
  const dataView = new DataView(arrayBuffer);
  let offset = 12;
  let json = null;
  let binaryChunk = null;

  while (offset < dataView.byteLength) {
    const chunkLength = dataView.getUint32(offset, true);
    const chunkType = dataView.getUint32(offset + 4, true);
    const chunkDataStart = offset + 8;
    const chunkDataEnd = chunkDataStart + chunkLength;

    if (chunkType === 0x4e4f534a) {
      json = JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer, chunkDataStart, chunkLength)));
    } else if (chunkType === 0x004e4942) {
      binaryChunk = arrayBuffer.slice(chunkDataStart, chunkDataEnd);
    }

    offset = chunkDataEnd;
  }

  const materialExtension =
    json?.materials?.[0]?.extensions?.KHR_materials_pbrSpecularGlossiness;
  const textureIndex = materialExtension?.diffuseTexture?.index;
  const imageIndex = json?.textures?.[textureIndex]?.source;
  const image = typeof imageIndex === 'number' ? json?.images?.[imageIndex] : null;
  const bufferView = typeof image?.bufferView === 'number' ? json?.bufferViews?.[image.bufferView] : null;

  if (!bufferView || !binaryChunk) {
    return null;
  }

  const imageBytes = binaryChunk.slice(bufferView.byteOffset || 0, (bufferView.byteOffset || 0) + bufferView.byteLength);
  const blob = new Blob([imageBytes], { type: image.mimeType || 'image/jpeg' });

  return URL.createObjectURL(blob);
}

function useEmbeddedGlbTexture(source) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let isDisposed = false;
    let objectUrl = null;
    let loadedTexture = null;

    fetch(source, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load GLB asset: ${source}`);
        }

        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        objectUrl = extractEmbeddedImageUrl(arrayBuffer);
        if (!objectUrl) {
          return null;
        }

        return new TextureLoader().loadAsync(objectUrl);
      })
      .then((nextTexture) => {
        if (isDisposed || !nextTexture) {
          nextTexture?.dispose?.();
          return;
        }

        nextTexture.flipY = false;
        nextTexture.colorSpace = 'srgb';
        nextTexture.needsUpdate = true;
        loadedTexture = nextTexture;
        setTexture(nextTexture);
      })
      .catch(() => {});

    return () => {
      isDisposed = true;
      loadedTexture?.dispose?.();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [source]);

  return texture;
}

function getPlaneMaterialConfig(name = '') {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('body')) {
    return {
      color: '#f3eee6',
      roughness: 0.5,
      metalness: 0.1
    };
  }

  if (normalizedName.includes('wing_details')) {
    return {
      color: '#7b3048',
      roughness: 0.46,
      metalness: 0.16
    };
  }

  if (normalizedName.includes('tail')) {
    return {
      color: '#6f1d3b',
      roughness: 0.42,
      metalness: 0.18
    };
  }

  if (normalizedName.includes('wing')) {
    return {
      color: '#d7d1cc',
      roughness: 0.56,
      metalness: 0.1
    };
  }

  return null;
}

function NormalizedModel({
  source,
  targetSize,
  rotation = [0, 0, 0],
  mapTexture = null,
  modelType = 'default'
}) {
  const { scene } = useGLTF(source);

  const { object, scale, offset } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      child.frustumCulled = false;
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (mapTexture && child.material && !child.material.map) {
          child.material = child.material.clone();
          child.material.map = mapTexture;
          child.material.color?.set?.('#ffffff');
          child.material.roughness = 1;
          child.material.metalness = 0;
        }

        if (modelType === 'plane' && child.material) {
          const config = getPlaneMaterialConfig(child.material.name || child.name);

          if (config) {
            child.material = child.material.clone();
            child.material.color?.set?.(config.color);
            child.material.roughness = config.roughness;
            child.material.metalness = config.metalness;
          }
        }

        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });

    const wrapper = new Group();
    wrapper.add(cloned);

    const bounds = new Box3().setFromObject(wrapper);
    const size = bounds.getSize(new Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const normalizedScale = targetSize / maxAxis;
    const center = bounds.getCenter(new Vector3());

    return {
      object: cloned,
      scale: normalizedScale,
      offset: center.multiplyScalar(-normalizedScale)
    };
  }, [mapTexture, modelType, scene, targetSize]);

  return (
    <group rotation={rotation} scale={[scale, scale, scale]} position={offset}>
      <primitive object={object} />
    </group>
  );
}

function RouteLabel({ position, children }) {
  return (
    <Html position={position} center distanceFactor={8} sprite>
      <div className={styles.label}>{children}</div>
    </Html>
  );
}

function DestinationGlow({ position, intensity }) {
  return (
    <Html position={position} center distanceFactor={10} sprite>
      <div
        className={styles.destinationGlow}
        style={{ opacity: MathUtils.clamp(intensity, 0, 1) }}
      />
    </Html>
  );
}

function LongDistanceGlobeScene({ progress, isMobile }) {
  const rootRef = useRef(null);
  const planeAnchorRef = useRef(null);
  const routeCurve = useMemo(() => createRouteCurve(), []);
  const routePoints = useMemo(() => routeCurve.getPoints(140), [routeCurve]);
  const earthTexture = useEmbeddedGlbTexture(LONG_DISTANCE_ASSETS.earthModel);

  useFrame((state, delta) => {
    if (!rootRef.current || !planeAnchorRef.current) {
      return;
    }

    const point = routeCurve.getPointAt(progress);
    const baseRotation = MathUtils.lerp(
      LONG_DISTANCE_SECTION.globeRotationStart,
      LONG_DISTANCE_SECTION.globeRotationEnd,
      progress
    );
    const cameraY = isMobile ? LONG_DISTANCE_SECTION.cameraYMobile : LONG_DISTANCE_SECTION.cameraYDesktop;
    const cameraZ = isMobile ? 8.15 : 7.2;

    rootRef.current.rotation.y = MathUtils.damp(rootRef.current.rotation.y, baseRotation, 4.4, delta);
    planeAnchorRef.current.position.copy(point);
    planeAnchorRef.current.rotation.set(0, 0, 0);

    state.camera.position.lerp(new Vector3(isMobile ? 0 : 0.3, cameraY, cameraZ), 1 - Math.exp(-delta * 2.2));
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={rootRef} rotation={[0.8, 0, 0.2]}>
      <ambientLight intensity={1.05} />
      <directionalLight position={[5, 4, 6]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#cfdcff" />
      <pointLight position={[0, 0, 6]} intensity={0.65} color="#ffe6d1" />

      <NormalizedModel
        source={LONG_DISTANCE_ASSETS.earthModel}
        targetSize={LONG_DISTANCE_SECTION.earthTargetSize}
        mapTexture={earthTexture}
      />

      <Line points={routePoints} color="#ffe6d1" lineWidth={1.1} transparent opacity={0.92} />

      <mesh
        position={HANOI_VECTOR.clone().setLength(
          LONG_DISTANCE_SECTION.earthSurfaceRadius + LONG_DISTANCE_SECTION.routeSurfaceOffset
        )}
      >
        <sphereGeometry args={[0.045, 18, 18]} />
        <meshStandardMaterial color="#ffe6d1" emissive="#724032" emissiveIntensity={0.4} />
      </mesh>

      <mesh
        position={MOSCOW_VECTOR.clone().setLength(
          LONG_DISTANCE_SECTION.earthSurfaceRadius + LONG_DISTANCE_SECTION.routeSurfaceOffset
        )}
      >
        <sphereGeometry args={[0.05, 18, 18]} />
        <meshStandardMaterial
          color="#ffe6d1"
          emissive="#ffe6d1"
          emissiveIntensity={MathUtils.lerp(0.2, 1.6, MathUtils.clamp((progress - 0.88) / 0.12, 0, 1))}
        />
      </mesh>

      <RouteLabel
        position={HANOI_VECTOR.clone().setLength(
          LONG_DISTANCE_SECTION.earthSurfaceRadius + LONG_DISTANCE_SECTION.labelSurfaceOffset
        )}
      >
        {LONG_DISTANCE_SECTION.locations.hanoi.label}
      </RouteLabel>
      <RouteLabel
        position={MOSCOW_VECTOR.clone().setLength(
          LONG_DISTANCE_SECTION.earthSurfaceRadius + LONG_DISTANCE_SECTION.labelSurfaceOffset
        )}
      >
        {LONG_DISTANCE_SECTION.locations.moscow.label}
      </RouteLabel>

      <DestinationGlow
        position={MOSCOW_VECTOR.clone().setLength(
          LONG_DISTANCE_SECTION.earthSurfaceRadius + LONG_DISTANCE_SECTION.glowSurfaceOffset
        )}
        intensity={MathUtils.clamp((progress - 0.88) / 0.12, 0, 1)}
      />

      <group ref={planeAnchorRef}>
        <group position={[LONG_DISTANCE_SECTION.planeOffsetX, 0, 0]}>
          <NormalizedModel
            source={LONG_DISTANCE_ASSETS.planeModel}
            targetSize={LONG_DISTANCE_SECTION.planeTargetSize}
            rotation={[-0.4, -Math.PI * 0.29, 0]}
            modelType="plane"
          />
        </group>
      </group>
    </group>
  );
}

export default LongDistanceGlobeScene;

useGLTF.preload(LONG_DISTANCE_ASSETS.earthModel);
useGLTF.preload(LONG_DISTANCE_ASSETS.planeModel);
