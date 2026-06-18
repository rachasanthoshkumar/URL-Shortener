import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAppBaseUrl } from "@/lib/app-url";
import { DashboardSearchForm } from "@/components/dashboard-search-form";
import { LinkList, type DashboardLink } from "@/components/link-list";
import { prisma } from "@/lib/prisma";
import { QuickShortenForm } from "@/components/quick-shorten-form";
import { RefreshOnFocus } from "@/components/refresh-on-focus";
import { SiteHeader } from "@/components/site-header";
import { Prisma } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DashboardPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const baseUrl = getAppBaseUrl();
  const resolvedSearchParams = await searchParams;
  const searchQuery = normalizeSearchQuery(resolvedSearchParams.q);
  const baseWhere: Prisma.LinkWhereInput = {
    userId,
    deletedAt: null,
  };
  const linkWhere: Prisma.LinkWhereInput = searchQuery
    ? {
        ...baseWhere,
        OR: [
          { slug: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
          { destinationUrl: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
          { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : baseWhere;

  const [links, totalLinks] = await Promise.all([
    prisma.link.findMany({
      where: linkWhere,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    }),
    prisma.link.count({
      where: baseWhere,
    }),
  ]);

  const dashboardLinks: DashboardLink[] = links.map((link) => {
    const shortUrl = `${baseUrl}/${link.slug}`;

    return {
      id: link.id,
      shortUrl,
      slug: link.slug,
      destinationUrl: link.destinationUrl,
      title: link.title,
      description: link.description ?? "",
      clickCount: link._count.clicks,
      createdAt: formatTimestamp(link.createdAt),
      qrCodeUrl: getQrCodeUrl(shortUrl, 128),
    };
  });

  return (
    <main className="dot-grid min-h-screen bg-[#fdfdfd] text-[#202124]">
      <RefreshOnFocus />
      <SiteHeader isSignedIn />

      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-6 md:px-10 md:py-10">
        <div>
          <Link
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8a8a8a] transition hover:text-[#202124]"
            href="/"
          >
            <ArrowLeft size={15} />
            Go back
          </Link>
          <h1 className="text-2xl font-extrabold tracking-normal sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-[#777777] sm:text-base">Create and manage your short links</p>
        </div>

        <div className="mt-8 grid gap-7 xl:grid-cols-[400px_1fr]">
          <section>
            <div className="mb-5 flex h-9 items-center gap-3">
              <Sparkles className="text-[#e9b949]" size={21} />
              <h2 className="text-lg font-extrabold tracking-normal sm:text-xl">Create New Link</h2>
            </div>
            <div className="h-fit rounded-xl border border-[#eeeeee] bg-white p-5 shadow-xl shadow-black/10 sm:p-6">
              <QuickShortenForm baseUrl={baseUrl} showDashboardLink={false} />
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold tracking-normal sm:text-xl">Your Links</h2>
                <span className="shrink-0 rounded-full bg-[#f7f7f7] px-4 py-1.5 text-sm font-medium text-[#9a9a9a]">
                  {searchQuery
                    ? `${links.length} of ${totalLinks} ${totalLinks === 1 ? "link" : "links"}`
                    : `${totalLinks} ${totalLinks === 1 ? "link" : "links"}`}
                </span>
              </div>

              <DashboardSearchForm query={searchQuery} />
            </div>
            <LinkList links={dashboardLinks} isSearching={Boolean(searchQuery)} />
          </section>
        </div>
      </section>
    </main>
  );
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeSearchQuery(value: string | string[] | undefined) {
  const query = Array.isArray(value) ? value[0] : value;

  return query?.trim().slice(0, 120) ?? "";
}

function getQrCodeUrl(shortUrl: string, size: number) {
  const params = new URLSearchParams({
    size: String(size),
    url: shortUrl,
  });

  return `/api/qr?${params.toString()}`;
}
