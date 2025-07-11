import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { tenant: string; id: string };
}) {
  const { tenant, id } = await params;

  const supabase = await createClient();

  // Auth check
  const { data: userSession } = await supabase.auth.getUser();
  if (!userSession?.user) redirect("/auth/login");

  // Get merchant
  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("id")
    .eq("subdomain", tenant)
    .single();

  if (merchantError || !merchant) return notFound();

  // Get product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("merchant_id", merchant.id)
    .single();

  if (productError || !product) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <ProductForm
        mode="edit"
        initialData={product}
        tenant={tenant}
        productId={id}
      />
    </div>
  );
}
