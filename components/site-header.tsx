import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SiteHeaderAuthAction } from "@/components/site-header-auth-action";
import { SignOutButton } from "@/components/sign-out-button";

export function SiteHeader({ isSignedIn }: { isSignedIn?: boolean }) {
  return (
    <header className="border-b border-[#eeeeee] bg-white/90 backdrop-blur">
      <div className="mx-auto h-14 max-w-[1500px] items-center gap-4 px-6 flex justify-between">
        <BrandLogo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#858585] md:flex">
          <Link className="transition hover:text-[#202124]" href="/#features">
            Features
          </Link>
          <Link className="transition hover:text-[#202124]" href="/dashboard">
            Dashboard
          </Link>
        </nav>
        <div className="flex justify-start md:justify-end">
          {typeof isSignedIn === "undefined" ? (
            <SiteHeaderAuthAction />
          ) : isSignedIn ? (
            <SignOutButton />
          ) : (
            <Link
              className="inline-flex h-9 items-center justify-center bg-black px-4 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
              href="/sign-in"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
