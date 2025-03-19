export function maskApiKey(key) {
    if (key.length <= 4) return "****";
    return `****${key.slice(-4)}`;
  }