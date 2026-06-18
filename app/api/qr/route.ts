import QRCode from "qrcode";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEFAULT_SIZE = 128;
const MAX_SIZE = 512;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  const size = clampSize(request.nextUrl.searchParams.get("size"));
  const filename = sanitizeFilename(request.nextUrl.searchParams.get("filename"));
  const isDownload = request.nextUrl.searchParams.get("download") === "1";
  const buffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    margin: size >= 256 ? 2 : 1,
    scale: 6,
    width: size,
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": isDownload
        ? `attachment; filename="${filename}"`
        : `inline; filename="${filename}"`,
      "Content-Type": "image/png",
    },
  });
}

function clampSize(value: string | null) {
  const size = Number(value);

  if (!Number.isFinite(size)) {
    return DEFAULT_SIZE;
  }

  return Math.min(Math.max(Math.round(size), 96), MAX_SIZE);
}

function sanitizeFilename(value: string | null) {
  const filename = value?.trim().replace(/[^a-z0-9._-]/gi, "-") || "short-in-qr.png";

  return filename.endsWith(".png") ? filename : `${filename}.png`;
}
