"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      aria-label="Copy short link"
      className="grid h-9 w-9 place-items-center rounded-lg text-[#8f8f8f] transition hover:bg-[#f6f6f6] hover:text-[#171717]"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      type="button"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  );
}
