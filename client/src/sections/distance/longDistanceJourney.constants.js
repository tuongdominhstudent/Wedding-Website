export const LONG_DISTANCE_SECTION = Object.freeze({
  pinDistanceDesktop: 6.5,
  pinDistanceMobile: 5.2,
  earthTargetSize: 3.45,
  planeTargetSize: 0.56,
  planeOffsetX: -0.1,
  earthSurfaceRadius: 1.725,
  routeSurfaceOffset: 0.04,
  routeArcHeight: 0.3,
  labelSurfaceOffset: 0.12,
  glowSurfaceOffset: 0.14,
  globeRotationStart: 2.92,
  globeRotationEnd: 3.26,
  cameraYDesktop: 0.12,
  cameraYMobile: 0.42,
  revealThresholds: Object.freeze({
    distance: 0.08,
    trips: 0.28,
    days: 0.5,
    home: 0.82
  }),
  counters: Object.freeze({
    trips: 10,
    days: 1000
  }),
  locations: Object.freeze({
    hanoi: Object.freeze({
      label: 'Ha Noi',
      lat: 21.0278,
      lon: 105.8342
    }),
    moscow: Object.freeze({
      label: 'Moscow',
      lat: 55,
      lon: 40
    })
  })
});
