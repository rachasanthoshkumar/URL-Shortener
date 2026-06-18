"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { SignOutButton } from "@/components/sign-out-button";

export function SiteHeaderAuthAction() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div aria-hidden className="h-9 w-[72px]" />;
  }

  if (session) {
    return <SignOutButton />;
  }

  return (
    <Link
      className="inline-flex h-9 items-center justify-center bg-black px-4 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
      href="/sign-in"
    >
      Sign In
    </Link>
  );
}
