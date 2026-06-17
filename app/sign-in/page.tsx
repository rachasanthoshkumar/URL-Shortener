import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SignInWithGithub } from "@/components/sign-in-with-github";
import { SiteHeader } from "@/components/site-header";

export default function SignInPage() {
  return (
    <main className="dot-grid min-h-screen bg-[#fdfdfd] text-[#202124]">
      <SiteHeader isSignedIn={false} />

      <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6">
        <section className="w-full max-w-[420px] rounded-xl border border-[#eeeeee] bg-white px-7 py-8 text-center shadow-2xl shadow-black/10">
          <h1 className="text-2xl font-extrabold tracking-normal">Welcome back</h1>
          <p className="mt-3 text-sm text-[#8a8a8a]">Sign in to manage your links</p>

          <div className="mt-7">
            <SignInWithGithub fullWidth label="Continue with GitHub" loadingLabel="Signing in..." />
          </div>

          <p className="mt-7 text-sm text-[#9a9a9a]">
            By signing in, you agree to our Terms of Service
          </p>
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
