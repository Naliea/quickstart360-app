import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductGrid } from "./ProductGrid";

export default async function ProductsPage({ params }: { params: { tenant: string } }) {
  const supabase = await createClient();

  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("id, name")
    .eq("subdomain", params.tenant)
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
    <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
      Fall Products 🍂
    </h1>
    <p className="text-gray-600 mb-8">
      Browse all your seasonal fall clothings here. Where fall is not just a season but a way of life.
    </p>

    <ProductGrid products={products} />
  </main>

  <footer className="text-center text-gray-500 py-4 border-t text-sm">
    © {new Date().getFullYear()} {merchant.name}
  </footer>
</div>

  );
}
