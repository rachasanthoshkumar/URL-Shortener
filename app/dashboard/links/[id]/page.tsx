import QRCode from "qrcode";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MousePointerClick } from "lucide-react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAppBaseUrl } from "@/lib/app-url";
import { CopyLinkButton } from "@/components/copy-link-button";
import { DownloadQrButton } from "@/components/download-qr-button";
import { prisma } from "@/lib/prisma";
import { RefreshOnFocus } from "@/components/refresh-on-focus";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LinkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LinkDetailPage({ params }: LinkDetailPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const link = await prisma.link.findFirst({
    where: {
      id,
      userId: session.user.id,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          clicks: true,
        },
      },
    },
  });

  if (!link) {
    notFound();
  }

  const baseUrl = getAppBaseUrl();
  const shortUrl = `${baseUrl}/${link.slug}`;
  const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    scale: 8,
    width: 360,
  });

  return (
    <main className="dot-grid min-h-screen bg-[#fdfdfd] text-[#202124]">
      <RefreshOnFocus />
      <SiteHeader isSignedIn />

      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-6 md:px-10 md:py-10">
        <div>
          <Link
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8a8a8a] transition hover:text-[#202124]"
            href="/dashboard"
          >
            <ArrowLeft size={15} />
            Go back
          </Link>
          <h1 className="text-2xl font-extrabold tracking-normal sm:text-3xl">Link Details</h1>
          <p className="mt-1 text-sm text-[#777777] sm:text-base">View QR code, copy the short URL, and check link activity.</p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-xl border border-[#eeeeee] bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold text-[#9a9a9a]">Link Details</p>
            <h2 className="mt-2 break-words text-xl font-extrabold tracking-normal sm:text-2xl">{link.title}</h2>
            {link.description ? (
              <p className="mt-3 text-sm leading-6 text-[#777777]">{link.description}</p>
            ) : null}

            <div className="mt-7 space-y-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">Short URL</p>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2.5">
                  <a
                    aria-label={`Open short link ${shortUrl}`}
                    className="min-w-0 flex-1 rounded-lg border border-[#ededed] bg-[#fdfdfd] px-3 py-2.5 font-mono text-sm text-[#3a3a3a] shadow-inner transition hover:border-[#d8d8d8] hover:text-[#171717]"
                    href={shortUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <p className="truncate">{shortUrl}</p>
                  </a>
                  <CopyLinkButton url={shortUrl} />
                  <a
                    aria-label="Open short link"
                    className="grid h-9 w-9 place-items-center rounded-lg text-[#8f8f8f] transition hover:bg-[#f6f6f6] hover:text-[#171717]"
                    href={shortUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">Destination</p>
                <a
                  className="block truncate rounded-lg border border-[#ededed] bg-[#fdfdfd] px-3 py-2.5 text-sm text-[#777777] shadow-inner transition hover:text-[#202124]"
                  href={link.destinationUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.destinationUrl}
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Info label="Total Clicks" value={`${link._count.clicks}`} icon={<MousePointerClick size={15} />} />
                <Info label="Created" value={formatTimestamp(link.createdAt)} />
                <Info label="Slug" value={link.slug} />
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-[#eeeeee] bg-white p-5 text-center shadow-xl shadow-black/10 sm:p-6">
            <h2 className="text-lg font-bold">QR Code</h2>
            <p className="mt-2 text-sm leading-6 text-[#888888]">
              This QR points to your short URL, so it stays stable for sharing and printing.
            </p>
            <Image
              alt={`QR code for ${shortUrl}`}
              className="mx-auto mt-6 h-auto w-full max-w-[260px] rounded-xl"
              height={260}
              src={qrCodeDataUrl}
              width={260}
            />
            <div className="mt-6">
              <DownloadQrButton dataUrl={qrCodeDataUrl} filename={`short-in-${link.slug}-qr.png`} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#eeeeee] bg-[#fdfdfd] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#9a9a9a]">{label}</p>
      <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#3a3a3a]">
        {icon}
        {value}
      </p>
    </div>
  );
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
