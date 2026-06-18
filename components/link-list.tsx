import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Info, MousePointerClick, Trash2 } from "lucide-react";
import { deleteLinkAction } from "@/app/dashboard/actions";
import { CopyLinkButton } from "@/components/copy-link-button";
import { DownloadQrButton } from "@/components/download-qr-button";

export type DashboardLink = {
  id: string;
  shortUrl: string;
  slug: string;
  destinationUrl: string;
  title: string;
  description: string;
  clickCount: number;
  createdAt: string;
  qrCodeUrl: string;
};

type LinkListProps = {
  isSearching?: boolean;
  links: DashboardLink[];
};

export function LinkList({ isSearching = false, links }: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-[#eeeeee] bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-base font-bold">{isSearching ? "No matching links" : "No links yet"}</p>
        <p className="mt-2 text-sm text-[#9a9a9a]">
          {isSearching
            ? "Try another search term or clear the search to view all links."
            : "Create your first short link from the card on the left."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <article
          key={link.id}
          className="rounded-xl border border-[#eeeeee] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_96px_auto] xl:items-center">
            <div className="min-w-0">
              <a
                aria-label={`Open short link ${link.shortUrl}`}
                className="block min-w-0 rounded-lg border border-[#ededed] bg-[#fdfdfd] px-3 py-2.5 font-mono text-sm text-[#3a3a3a] shadow-inner transition hover:border-[#d8d8d8] hover:text-[#171717]"
                href={link.shortUrl}
                rel="noreferrer"
                target="_blank"
              >
                <p className="truncate">{link.shortUrl}</p>
              </a>

              <p className="mt-2.5 truncate text-sm text-[#9a9a9a]">{link.destinationUrl}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-sm text-[#a0a0a0]">
                <span className="inline-flex items-center gap-1.5">
                  <MousePointerClick size={14} />
                  {link.clickCount} clicks
                </span>
                <span>{link.createdAt}</span>
              </div>
            </div>

            <div className="flex justify-start xl:justify-center">
              <Image
                alt={`QR code for ${link.shortUrl}`}
                className="h-24 w-24 rounded-lg border border-[#eeeeee]"
                height={96}
                src={link.qrCodeUrl}
                unoptimized
                width={96}
              />
            </div>

            <div className="flex flex-wrap items-center justify-start gap-1.5 xl:justify-end">
              <CopyLinkButton url={link.shortUrl} />
              <a
                aria-label="Open short link"
                className="grid h-9 w-9 place-items-center rounded-lg text-[#8f8f8f] transition hover:bg-[#f6f6f6] hover:text-[#171717]"
                href={link.shortUrl}
                rel="noreferrer"
                target="_blank"
                title="Open short link"
              >
                <ExternalLink size={18} />
              </a>
              <Link
                aria-label="Open link details"
                className="grid h-9 w-9 place-items-center rounded-lg text-[#8f8f8f] transition hover:bg-[#f6f6f6] hover:text-[#171717]"
                href={`/dashboard/links/${link.id}`}
                title="Link details"
              >
                <Info size={18} />
              </Link>
              <DownloadQrButton
                filename={`short-in-${link.slug}-qr.png`}
                source={link.qrCodeUrl}
                variant="icon"
              />
              <form action={deleteLinkAction}>
                <input name="linkId" type="hidden" value={link.id} />
                <button
                  aria-label="Delete short link"
                  className="grid h-9 w-9 place-items-center rounded-lg text-[#b9b9b9] transition hover:bg-red-50 hover:text-red-600"
                  title="Delete short link"
                  type="submit"
                >
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
