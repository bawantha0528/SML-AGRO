const FALLBACK_SPEC_TEXT = 'Natural, sustainable, biodegradable.';

const normalizeSpecLabel = (label) => String(label || '')
  .replace(/_/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export function formatSpecifications(specifications) {
  if (!specifications) return FALLBACK_SPEC_TEXT;

  if (typeof specifications !== 'string') {
    return FALLBACK_SPEC_TEXT;
  }

  const raw = specifications.trim();
  if (!raw) return FALLBACK_SPEC_TEXT;

  const looksLikeJson = (raw.startsWith('[') && raw.endsWith(']')) ||
    (raw.startsWith('{') && raw.endsWith('}'));

  if (!looksLikeJson) {
    return raw;
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed) && parsed.length > 0) {
      const labels = parsed
        .map((item) => normalizeSpecLabel(item?.label || item?.id || item?.name))
        .filter(Boolean)
        .slice(0, 3);

      if (labels.length > 0) {
        return `Configurable options: ${labels.join(', ')}`;
      }
      return 'Configurable options available.';
    }

    if (parsed && typeof parsed === 'object') {
      const keys = Object.keys(parsed).slice(0, 3).map(normalizeSpecLabel).filter(Boolean);
      if (keys.length > 0) {
        return `Specifications: ${keys.join(', ')}`;
      }
    }
  } catch {
    return FALLBACK_SPEC_TEXT;
  }

  return FALLBACK_SPEC_TEXT;
}
