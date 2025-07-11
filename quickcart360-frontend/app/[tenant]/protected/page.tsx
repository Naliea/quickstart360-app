// app/[tenant]/protected/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MerchantInfo from "@/components/MerchantInfo";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-10 gap-10">
      <MerchantInfo />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* View Products */}
        <Link
          href={`./products`}
          className="rounded-2xl border p-6 hover:bg-gray-50 transition duration-200 shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-2">🛒 View All Products</h3>
          <p className="text-gray-500">Browse and manage all the items in your store.</p>
        </Link>

        {/* Add Product */}
        <Link
          href={`./products/new`}
          className="rounded-2xl border p-6 hover:bg-gray-50 transition duration-200 shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-2">➕ Add New Product</h3>
          <p className="text-gray-500">Upload and list a new item for your customers.</p>
        </Link>
      </div>
    </div>
  );
}
