// Guardrails for safe value handling

export const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? fallback : num;
};

export const safeAngle = (angle) => {
  const num = safeNumber(angle, 0);
  return ((num % 360) + 360) % 360;
};

export const safeClamp = (value, min, max) => {
  const num = safeNumber(value, min);
  return Math.max(min, Math.min(max, num));
};

export const safeStyle = (styleObj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(styleObj)) {
    if (value !== undefined && value !== null && !Number.isNaN(value)) {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

export const safeClassName = (...classes) => {
  return classes
    .filter(c => c && typeof c === 'string')
    .join(' ')
    .trim();
};