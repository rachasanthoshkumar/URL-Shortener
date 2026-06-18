export type QrImagePreset = "preview" | "detail";

export function getQrImagePath(slug: string, preset: QrImagePreset = "preview") {
  const query = preset === "detail" ? "?preset=detail" : "";

  return `/api/qr/${encodeURIComponent(slug)}${query}`;
}
