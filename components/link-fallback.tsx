import { ArrowLeft, LinkIcon } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

type LinkFallbackProps = {
  title: string;
  message: string;
};

export function LinkFallback({ title, message }: LinkFallbackProps) {
  return (
    <main className="dot-grid min-h-screen bg-[#fdfdfd] text-center text-[#202124]">
      <SiteHeader isSignedIn={false} />
      <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6">
        <section className="w-full max-w-[420px] rounded-xl border border-[#eeeeee] bg-white px-7 py-8 shadow-2xl shadow-black/10">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-[#17181c] text-white shadow-md">
            <LinkIcon size={18} />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold tracking-normal">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-[#8a8a8a]">{message}</p>
        </section>
        <Link
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#9a9a9a] transition hover:text-[#202124]"
          href="/"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </div>
    </main>
  );
}
