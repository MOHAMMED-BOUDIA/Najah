const rawApiUrl = import.meta.env.VITE_API_URL || '';

const stripTrailingSlashes = (value) => value.trim().replace(/\/+$/, '');

const stripApiSuffix = (value) => value.replace(/\/api$/, '');

export const getApiOrigin = () => {
  const normalized = stripApiSuffix(stripTrailingSlashes(rawApiUrl));
  return normalized;
};

export const getPublicFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('data:')) {
    return filePath;
  }

  const origin = getApiOrigin();
  const cleanedPath = filePath.replace(/^\/+/, '').replace(/\\/g, '/');

  return origin ? `${origin}/${cleanedPath}` : `/${cleanedPath}`;
};