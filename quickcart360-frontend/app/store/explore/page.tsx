import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import sharp from "sharp";
import axios from "axios";
import Image from "next/image";

// Helper to get average color from image URL
async function getAverageColorFromImage(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const image = sharp(response.data).resize(1, 1);
    const { data } = await image.raw().toBuffer({ resolveWithObject: true });
    const [r, g, b] = data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch (err) {
    console.error("Error getting color:", err);
    return null;
  }
}

export default async function ExplorePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, image_url, merchant:merchant_id (store_slug, profiles:profiles!profiles_merchant_id_fkey (tenant_slug), name)");


  if (error) throw error;

  // Get colors for all product images in parallel
  const productsWithColor = await Promise.all(
    products.map(async (product) => {
      const color = await getAverageColorFromImage(product.image_url);
      return { ...product, color };
    })
  );

  return (
  <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {productsWithColor.map((product) => {
      // 🧪 Log each product to inspect structure

      return (
        <div key={product.id} className="border p-4 rounded shadow">
          {product.image_url && (
            <Image
              width={600}
              height={400}
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
          )}
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-sm text-gray-600">
            By:{" "}
            <Link
                href={`/store/merchants/${product.merchant.store_slug}`}
                className="text-gray-600  hover:text-blue-600 hover:underline"
                 >
                {product.merchant.name}
            </Link>
          </p>
          <p
            className="font-bold mb-2"
            style={{ color: product.color || "#000" }}
          >
            ${product.price}
          </p>
          <Link
            className="inline-block px-4 py-2 rounded text-white"
            style={{ backgroundColor: product.color || "#000" }}
             href={`/store/products/${product.id}`}>
             View Product
          </Link>
        </div>
      );
    })}
  </main>
);

}