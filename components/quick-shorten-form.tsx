"use client";

import { useActionState } from "react";
import { ArrowRight, LinkIcon, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { createQuickLinkAction, type LinkActionState } from "@/app/dashboard/actions";

const initialState: LinkActionState = {
  status: "idle",
  message: "",
};

export function QuickShortenForm({
  baseUrl,
  showDashboardLink = true,
}: {
  baseUrl: string;
  showDashboardLink?: boolean;
}) {
  const [state, formAction, isPending] = useActionState<LinkActionState, FormData>(
    createQuickLinkAction,
    initialState,
  );

  return (
    <form action={formAction} className="w-full">
      <label className="relative block">
        <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a3a3a3]" size={15} />
        <input
          className="h-10 w-full rounded-lg border border-[#e6e6e6] bg-white pl-10 pr-4 text-xs text-[#222222] shadow-sm outline-none transition placeholder:text-[#a3a3a3] focus:border-[#cfcfcf]"
          name="destinationUrl"
          placeholder="Paste your long URL here..."
          required
          type="url"
        />
      </label>

      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <span className="shrink-0 text-left text-xs text-[#8a8a8a]">{baseUrl}/</span>
        <input
          className="h-9 min-w-0 flex-1 rounded-lg border border-[#e6e6e6] bg-white px-3.5 text-xs text-[#222222] shadow-sm outline-none transition placeholder:text-[#a3a3a3] focus:border-[#cfcfcf]"
          name="customSlug"
          placeholder="custom-slug (optional)"
        />
      </div>

      <button
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-lg bg-[#171717] text-xs font-bold text-white shadow-sm transition hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:bg-[#999999]"
        disabled={isPending}
        type="submit"
      >
        {isPending ? <Loader2 className="animate-spin" size={15} /> : <Sparkles size={15} />}
        Shorten URL
      </button>

      {state.message ? (
        <p className={state.status === "error" ? "mt-3 text-center text-sm text-red-600" : "mt-3 text-center text-sm text-emerald-700"}>
          {state.message}
        </p>
      ) : null}

      {showDashboardLink ? (
        <Link
          className="mx-auto mt-5 inline-flex items-center justify-center gap-2.5 text-sm font-semibold text-[#939393] transition hover:text-[#171717]"
          href="/dashboard"
        >
          Go to Dashboard <ArrowRight size={15} />
        </Link>
      ) : null}
    </form>
  );
}
