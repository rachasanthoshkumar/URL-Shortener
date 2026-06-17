import { LinkIcon } from "lucide-react";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 text-base font-bold text-[#202124]">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#17181c] text-xs font-bold text-white shadow-md">
        <LinkIcon size={15} />
      </span>
      Short-in
    </Link>
  );
}
