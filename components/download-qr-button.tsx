"use client";

import { Download } from "lucide-react";

export function DownloadQrButton({
  dataUrl,
  filename,
  source,
  variant = "button",
}: {
  dataUrl?: string;
  filename: string;
  source?: string;
  variant?: "button" | "icon";
}) {
  const qrSource = source ?? dataUrl ?? "";

  async function downloadImage(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!qrSource || qrSource.startsWith("data:")) {
      return;
    }

    event.preventDefault();

    const response = await fetch(qrSource);

    if (!response.ok) {
      return;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }

  return (
    <a
      className={
        variant === "icon"
          ? "grid h-9 w-9 place-items-center rounded-lg text-[#8f8f8f] transition hover:bg-[#f6f6f6] hover:text-[#171717]"
          : "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#2a2a2a]"
      }
      download={filename}
      href={qrSource}
      onClick={downloadImage}
      title="Download QR"
      aria-label="Download QR code"
    >
      <Download size={variant === "icon" ? 18 : 16} />
      {variant === "button" ? "Download QR" : null}
    </a>
  );
}
