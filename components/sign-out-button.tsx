"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      className="inline-flex h-9 items-center justify-center bg-black px-4 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      type="button"
    >
      Sign Out
    </button>
  );
}
