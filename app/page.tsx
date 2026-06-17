import { LinkIcon, MousePointerClick, QrCode, Sparkles, UserRound } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { QuickShortenForm } from "@/components/quick-shorten-form";
import { SiteHeader } from "@/components/site-header";

const features = [
  {
    title: "Custom Slugs",
    description: "Choose your own memorable short URL",
    icon: LinkIcon,
  },
  {
    title: "QR Codes",
    description: "Instantly generated for every link",
    icon: QrCode,
  },
  {
    title: "Click Tracking",
    description: "Know your link performance",
    icon: MousePointerClick,
  },
  {
    title: "Dashboard",
    description: "Manage all your links in one place",
    icon: UserRound,
  },
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="dot-grid min-h-screen bg-[#fdfdfd] text-[#202124]">
      <SiteHeader isSignedIn={Boolean(session)} />

      <section className="mx-auto flex min-h-[calc(100vh-57px)] max-w-4xl flex-col items-center px-5 pt-20 text-center sm:px-6 sm:pt-24 md:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#777777] shadow-sm">
          <Sparkles className="text-[#e9b949]" size={15} />
          Simple & Sharp URL Shortener
        </div>

        <h1 className="mt-7 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-normal text-[#202124] sm:text-4xl md:text-5xl">
          Shorten Your Links Instantly
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-[#6f6f6f] sm:text-base sm:leading-7">
          Create custom short URLs, generate QR codes, and track clicks — all in one beautiful place.
        </p>

        <div className="mx-auto mt-6 w-full max-w-md sm:px-0">
          <QuickShortenForm baseUrl={baseUrl} />
        </div>

        <div id="features" className="mt-16 grid w-full max-w-3xl gap-3 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[#eeeeee] bg-white/95 p-4 text-left shadow-sm"
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#f7f7f7] text-[#5f5f5f]">
                <feature.icon size={17} />
              </div>
              <h2 className="mt-4 text-sm font-bold text-[#2b2b2b]">{feature.title}</h2>
              <p className="mt-2 text-xs leading-5 text-[#9a9a9a]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
