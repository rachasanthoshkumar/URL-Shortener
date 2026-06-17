"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

type PendingAction = "search" | "clear" | null;

export function DashboardSearchForm({ query }: { query: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  function navigateWithQuery(nextQuery: string, action: Exclude<PendingAction, null>) {
    const trimmedQuery = nextQuery.trim();
    const href = trimmedQuery ? `/dashboard?q=${encodeURIComponent(trimmedQuery)}` : "/dashboard";

    setPendingAction(action);
    startTransition(() => {
      router.push(href);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateWithQuery(inputRef.current?.value ?? "", "search");
  }

  return (
    <form
      action="/dashboard"
      aria-busy={isPending}
      className="flex w-full items-center gap-2 lg:max-w-sm"
      onSubmit={handleSubmit}
    >
      <label className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a3a3a3]"
          size={15}
        />
        <input
          className="h-10 w-full rounded-lg border border-[#e6e6e6] bg-white pl-10 pr-3 text-sm text-[#222222] shadow-sm outline-none transition placeholder:text-[#a3a3a3] focus:border-[#cfcfcf] disabled:cursor-wait disabled:bg-[#fafafa]"
          defaultValue={query}
          disabled={isPending}
          name="q"
          placeholder="Search links..."
          ref={inputRef}
          type="search"
        />
      </label>
      {query ? (
        <button
          aria-label={isPending && pendingAction === "clear" ? "Clearing search" : "Clear search"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#8f8f8f] transition hover:bg-[#f6f6f6] hover:text-[#171717] disabled:cursor-wait disabled:opacity-70"
          disabled={isPending}
          onClick={() => navigateWithQuery("", "clear")}
          title="Clear search"
          type="button"
        >
          {isPending && pendingAction === "clear" ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
        </button>
      ) : null}
      <button
        aria-label={isPending && pendingAction === "search" ? "Searching links" : "Search links"}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#171717] text-white transition hover:bg-[#2a2a2a] disabled:cursor-wait disabled:bg-[#8f8f8f]"
        disabled={isPending}
        title="Search links"
        type="submit"
      >
        {isPending && pendingAction === "search" ? <Loader2 className="animate-spin" size={17} /> : <Search size={17} />}
      </button>
    </form>
  );
}
