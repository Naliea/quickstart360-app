import "@/app/globals.css";
import { MerchantProvider } from "@/context/MerchantContext";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation"; // for 404 fallback

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const supabase = await createClient();
  const subdomain =  params.tenant ?? "default";

  // Query merchant data
  const { data: merchant, error } = await supabase
    .from("merchants")
    .select("*")
    .eq("subdomain", subdomain)
    .maybeSingle();

  if (error || !merchant) {
    // Optional: log or handle differently
    console.error("Merchant not found:", error?.message);
    notFound(); // Shows 404 page
  }

  return (
    <MerchantProvider tenantId={subdomain} merchant={merchant}>
      {children}
    </MerchantProvider>
  );
}
