const DEFAULT_APP_URL = "http://localhost:3000";

export function getAppBaseUrl() {
  return normalizeAppBaseUrl(
    process.env.NEXT_PUBLIC_APP_URL ??
      process.env.BETTER_AUTH_URL ??
      DEFAULT_APP_URL,
  );
}

export function normalizeAppBaseUrl(value: string) {
  let normalized = value.trim();

  if (normalized.startsWith("ttps://")) {
    normalized = `h${normalized}`;
  } else if (normalized.startsWith("ttp://")) {
    normalized = `h${normalized}`;
  } else if (normalized.startsWith("//")) {
    normalized = `https:${normalized}`;
  } else if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  try {
    const url = new URL(normalized);

    if (!["http:", "https:"].includes(url.protocol)) {
      return DEFAULT_APP_URL;
    }

    return url.origin;
  } catch {
    return DEFAULT_APP_URL;
  }
}
