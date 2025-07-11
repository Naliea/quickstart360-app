// app/[tenant]/layout.tsx

import "@/app/globals.css";
import { MerchantProvider } from "@/context/MerchantContext";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Dashboard",
  description: "Protected tenant space",
};

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await  params;
  const supabase = await createClient();

  const { data: merchant, error } = await supabase
    .from("merchants")
    .select("*")
    .eq("subdomain", tenant)
    .maybeSingle();

  if (!merchant || error) {
    console.error("❌ Merchant not found or error:", error?.message);
    notFound(); // triggers the 404 page
  }

  return (
    <MerchantProvider tenantId={tenant} merchant={merchant}>
      {children}
    </MerchantProvider>
  );
}
