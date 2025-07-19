// app/store/merchants/[store_slug]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function MerchantPage({ params: rawParams }: { params: Promise<{ store_slug: string }> }) {
  const params = await rawParams;
  const supabase = await createClient();

  const { data: merchantData, error } = await supabase
    .from("products")
    .select("id, name, price, image_url, merchant:merchant_id (store_slug, name)")
    .eq("merchant.store_slug", params.store_slug);

  if (error || !merchantData || merchantData.length === 0) return notFound();

  const merchantName = merchantData[0]?.merchant?.name;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link
            href="/store/explore"
            className="inline-block px-4 py-2 border border-gray-400 text-white bg-gray-800 rounded-full transition-all duration-200 hover:shadow-md hover:bg-[#8B4513] hover:text-white"
            >
            &larr; Back to Explore
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">Products by {merchantName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {merchantData.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <Image
              src={product.image_url}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-700">${product.price}</p>
            <Link href={`/store/products/${product.id}`} className="text-blue-600 underline mt-2 block">
              View Product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
