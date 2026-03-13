export const SECTION_PRELOAD_STRATEGY = Object.freeze({
  BLOCKING: 'blocking',
  DEFERRED: 'deferred'
});

const DEFAULT_SECTIONS = Object.freeze([
  Object.freeze({
    id: 'intro',
    order: 0,
    preloadStrategy: SECTION_PRELOAD_STRATEGY.BLOCKING
  }),
  Object.freeze({
    id: 'firsts',
    order: 10,
    preloadStrategy: SECTION_PRELOAD_STRATEGY.DEFERRED
  }),
  Object.freeze({
    id: 'long-distance',
    order: 20,
    preloadStrategy: SECTION_PRELOAD_STRATEGY.DEFERRED
  }),
  Object.freeze({
    id: 'prewedding',
    order: 30,
    preloadStrategy: SECTION_PRELOAD_STRATEGY.DEFERRED
  }),
  Object.freeze({
    id: 'calendar',
    order: 40,
    preloadStrategy: SECTION_PRELOAD_STRATEGY.DEFERRED
  }),
  Object.freeze({
    id: 'logistics',
    order: 50,
    preloadStrategy: SECTION_PRELOAD_STRATEGY.DEFERRED
  }),
  Object.freeze({
    id: 'gift',
    order: 60,
    preloadStrategy: SECTION_PRELOAD_STRATEGY.DEFERRED
  })
]);

const sectionRegistry = new Map();

function validateSectionDefinition(definition) {
  if (!definition?.id) {
    throw new Error('Section definition requires an id');
  }

  if (!Number.isFinite(definition.order)) {
    throw new Error(`Section "${definition.id}" requires a numeric order`);
  }

  if (!Object.values(SECTION_PRELOAD_STRATEGY).includes(definition.preloadStrategy)) {
    throw new Error(
      `Section "${definition.id}" requires a valid preloadStrategy (${Object.values(
        SECTION_PRELOAD_STRATEGY
      ).join(', ')})`
    );
  }
}

function seedDefaultSections() {
  sectionRegistry.clear();

  DEFAULT_SECTIONS.forEach((definition) => {
    sectionRegistry.set(definition.id, definition);
  });
}

seedDefaultSections();

export function registerSection(definition) {
  validateSectionDefinition(definition);

  if (sectionRegistry.has(definition.id)) {
    throw new Error(`Section "${definition.id}" is already registered`);
  }

  sectionRegistry.set(definition.id, Object.freeze({ ...definition }));
}

export function getRegisteredSections() {
  return Array.from(sectionRegistry.values()).sort((a, b) => a.order - b.order);
}

export function getSectionDefinition(sectionId) {
  return sectionRegistry.get(sectionId) ?? null;
}

export function getSectionPreloadStrategy(sectionId) {
  const section = getSectionDefinition(sectionId);

  if (!section) {
    throw new Error(`Unknown section "${sectionId}"`);
  }

  return section.preloadStrategy;
}

export function clearSectionRegistry() {
  seedDefaultSections();
}
