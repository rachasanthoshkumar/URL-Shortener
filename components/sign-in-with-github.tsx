"use client";

import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignInWithGithub({
  label = "Continue with GitHub",
  loadingLabel = "Signing in...",
  size = "md",
  fullWidth = false,
}: {
  fullWidth?: boolean;
  label?: string;
  loadingLabel?: string;
  size?: "md" | "lg";
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] font-semibold text-white shadow-sm transition hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:bg-[#a7a7a7]",
        size === "lg" ? "h-12 px-5 text-sm" : "h-10 px-4 text-sm",
        fullWidth && "w-full",
      )}
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const response = await authClient.signIn.social({
          provider: "github",
          callbackURL: "/dashboard",
        });

        if (response.data?.url) {
          window.location.href = response.data.url;
          return;
        }

        setIsLoading(false);
      }}
      type="button"
    >
      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
      {isLoading ? loadingLabel : label}
    </button>
  );
}
