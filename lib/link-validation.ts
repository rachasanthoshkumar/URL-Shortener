import { customAlphabet } from "nanoid";
import { z } from "zod";

const randomSlug = customAlphabet("23456789abcdefghijkmnopqrstuvwxyz", 7);

const reservedSlugs = new Set([
  "api",
  "auth",
  "dashboard",
  "login",
  "logout",
  "sign-in",
  "sign-up",
  "admin",
  "settings",
  "new",
]);

export const linkInputSchema = z.object({
  destinationUrl: z.string().trim().min(1, "Destination URL is required."),
  customSlug: z.string().trim().optional(),
  title: z.string().trim().min(1, "Title is required.").max(120, "Title must be 120 characters or fewer."),
  description: z.string().trim().max(280, "Description must be 280 characters or fewer.").optional(),
});

export type LinkInput = z.infer<typeof linkInputSchema>;

export function normalizeDestinationUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return { ok: false as const, error: "Enter a valid destination URL." };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return { ok: false as const, error: "Only http and https URLs are allowed." };
  }

  if (url.username || url.password) {
    return { ok: false as const, error: "URLs with embedded credentials are not allowed." };
  }

  const hostname = url.hostname.toLowerCase();

  if (isBlockedHostname(hostname)) {
    return { ok: false as const, error: "Local, private, and internal network URLs are not allowed." };
  }

  return { ok: true as const, url: url.toString() };
}

export function normalizeCustomSlug(value?: string | null) {
  const slug = slugify(value ?? "");

  if (!slug) {
    return { ok: true as const, slug: null };
  }

  if (slug.length < 3 || slug.length > 64) {
    return { ok: false as const, error: "Custom slug must be between 3 and 64 characters." };
  }

  if (reservedSlugs.has(slug)) {
    return { ok: false as const, error: "That slug is reserved. Try a more specific one." };
  }

  return { ok: true as const, slug };
}

export function generatedSlugSeed(title: string, destinationUrl: string) {
  const fromTitle = slugify(title).slice(0, 42);

  if (fromTitle.length >= 3 && !reservedSlugs.has(fromTitle)) {
    return fromTitle;
  }

  try {
    const hostname = new URL(destinationUrl).hostname.replace(/^www\./, "");
    const fromHost = slugify(hostname).slice(0, 42);
    return fromHost.length >= 3 && !reservedSlugs.has(fromHost) ? fromHost : randomSlug();
  } catch {
    return randomSlug();
  }
}

export function randomSlugSuffix() {
  return randomSlug();
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function isBlockedHostname(hostname: string) {
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return true;
  }

  if (hostname === "0.0.0.0" || hostname === "::1" || hostname === "[::1]") {
    return true;
  }

  const normalizedIpv6 = hostname.replace(/^\[|\]$/g, "");

  if (
    normalizedIpv6.startsWith("fc") ||
    normalizedIpv6.startsWith("fd") ||
    normalizedIpv6.startsWith("fe80:")
  ) {
    return true;
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    const [a, b] = hostname.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254)
    );
  }

  return false;
}
