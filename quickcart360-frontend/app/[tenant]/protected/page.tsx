// app/[tenant]/protected/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MerchantInfo from "@/components/MerchantInfo"; // ✅ import client component

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <MerchantInfo /> {/* ✅ Now you can use your hook here */}
    </div>
  );
}
