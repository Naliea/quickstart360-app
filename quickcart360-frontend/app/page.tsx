"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // ✅ use this
import { Session } from "@supabase/supabase-js";

import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient(); // ✅ create instance inside the component

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
  <div className="w-full flex flex-col gap-10 items-center">
    {/* Navigation */}
    <nav className="w-full border-b border-foreground/10 h-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center h-full text-sm">
        <div className="flex flex-wrap items-center gap-4 font-semibold">
          <Link href="/" className="text-base sm:text-lg">
            Supabase Starter
          </Link>
          <DeployButton />
        </div>

        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : session ? (
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="truncate max-w-[150px] sm:max-w-full">
              {session.user.email}
            </span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setSession(null);
              }}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <AuthButton />
        )}
      </div>
    </nav>

    {/* Hero + Steps */}
    <div className="w-full flex-1 flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <Hero />
      <section className="flex flex-col gap-6">
        <h2 className="font-semibold text-lg sm:text-xl">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </section>
    </div>

    {/* Footer */}
    <footer className="w-full border-t text-center text-xs py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto gap-4">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <ThemeSwitcher />
      </div>
    </footer>
  </div>
</main>

  );
} 