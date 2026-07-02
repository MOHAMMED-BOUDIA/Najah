const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const ORIGIN_ENV_VARS = ['CLIENT_URL', 'CLIENT_URLS', 'FRONTEND_URL', 'FRONTEND_URLS'];

const splitOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const normalizeOrigin = (origin) => {
  if (!origin) return origin;

  try {
    return new URL(origin).origin;
  } catch {
    return origin.trim();
  }
};

const getAllowedOrigins = () => {
  const origins = new Set(DEFAULT_ORIGINS);

  for (const envName of ORIGIN_ENV_VARS) {
    for (const origin of splitOrigins(process.env[envName] || '')) {
      origins.add(normalizeOrigin(origin));
    }
  }

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  return [...origins];
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)) {
    return true;
  }

  return false;
};

module.exports = {
  getAllowedOrigins,
  isAllowedOrigin,
  normalizeOrigin,
};