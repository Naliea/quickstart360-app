import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductGrid } from "./ProductGrid";
import Link from "next/link";

export default async function ProductsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  const supabase = await createClient();

  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("id, name")
    .eq("subdomain", tenant)
    .single();

  if (merchantError || !merchant) {
    notFound();
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, description, price, image_url")
    .eq("merchant_id", merchant.id);

  if (productsError) {
    return <div className="p-10 text-red-500">Error loading products.</div>;
  }

  return (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Fall Products 🍂</h1>
          <p className="text-gray-600">Browse all your seasonal fall clothings here.</p>
        </div>

        {/* ✅ Back to Dashboard Button */}
        <Link href={`/${tenant}/protected`} className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <ProductGrid products={products} />
    </main>

    <footer className="text-center text-gray-500 py-4 border-t text-sm">
      © {new Date().getFullYear()} {merchant.name}
    </footer>
  </div>
);
}