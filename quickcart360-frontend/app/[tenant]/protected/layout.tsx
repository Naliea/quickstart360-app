import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-white text-[#3d2b1f] font-sans">
      {/* Navbar */}
      <nav className="w-full shadow-sm border-b border-[#e4d4c4] bg-white h-16 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl flex justify-between items-center text-sm">
          <div className="flex items-center gap-4 font-bold text-[#6e4f3a]">
            <Link href="/">QuickCart360</Link>
            <DeployButton />
          </div>
          <div className="flex items-center gap-4">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 w-full flex flex-col items-center px-5 py-10">
        <div className="w-full max-w-6xl">{children}</div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#e4d4c4] bg-white text-center text-xs py-6 text-[#7b5d47]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <p>
            © {new Date().getFullYear()} QuickCart360. All rights reserved.
          </p>
          <ThemeSwitcher />
        </div>
      </footer>
    </main>
  );
}
