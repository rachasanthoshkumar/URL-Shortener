"use client";

import { Download } from "lucide-react";

export function DownloadQrButton({
  dataUrl,
  filename,
  variant = "button",
}: {
  dataUrl: string;
  filename: string;
  variant?: "button" | "icon";
}) {
  return (
    <a
      className={
        variant === "icon"
          ? "grid h-9 w-9 place-items-center rounded-lg text-[#8f8f8f] transition hover:bg-[#f6f6f6] hover:text-[#171717]"
          : "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#2a2a2a]"
      }
      download={filename}
      href={dataUrl}
      title="Download QR"
      aria-label="Download QR code"
    >
      <Download size={variant === "icon" ? 18 : 16} />
      {variant === "button" ? "Download QR" : null}
    </a>
  );
}
