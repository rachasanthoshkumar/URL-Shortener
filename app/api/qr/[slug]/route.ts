import QRCode, { type QRCodeToBufferOptions } from "qrcode";
import { getAppBaseUrl } from "@/lib/app-url";

const QR_PRESETS = {
  preview: {
    margin: 1,
    scale: 5,
    width: 128,
  },
  detail: {
    errorCorrectionLevel: "H",
    margin: 2,
    scale: 8,
    width: 360,
  },
} satisfies Record<string, QRCodeToBufferOptions>;

type QrRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, { params }: QrRouteContext) {
  const { slug } = await params;
  const preset = getPreset(request);
  const shortUrl = `${getAppBaseUrl()}/${slug}`;
  const image = await QRCode.toBuffer(shortUrl, QR_PRESETS[preset]);

  return new Response(new Uint8Array(image), {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
      "Content-Type": "image/png",
    },
  });
}

function getPreset(request: Request) {
  const preset = new URL(request.url).searchParams.get("preset");

  return preset === "detail" ? "detail" : "preview";
}
