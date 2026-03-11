const sectionRegistry = [];

export function registerSection(definition) {
  if (!definition?.id) {
    throw new Error('Section definition requires an id');
  }

  if (!definition.mount || typeof definition.mount !== 'function') {
    throw new Error(`Section "${definition.id}" requires a mount() function`);
  }

  const exists = sectionRegistry.some((item) => item.id === definition.id);
  if (exists) {
    throw new Error(`Section "${definition.id}" is already registered`);
  }

  sectionRegistry.push(definition);
}

export function getRegisteredSections() {
  return [...sectionRegistry].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function clearSectionRegistry() {
  sectionRegistry.length = 0;
}
