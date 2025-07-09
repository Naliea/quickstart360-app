"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion"; // ✅ Install with `npm i framer-motion`

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export function ProductGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      alert("Product deleted successfully.");
      router.refresh();
    }
  };

  return (
    <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <motion.li
          key={product.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-white border rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col hover:scale-[1.03] duration-200"
        >
          {product.image_url ? (
            <div className="relative w-full h-72"> {/* Larger image */}
              <Image
                src={product.image_url}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}

          <div className="p-4 flex-1 space-y-1">
            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
            <p className="text-green-600 font-bold">KES {product.price.toFixed(2)}</p>
          </div>

          <div className="p-4 pt-0 flex gap-2 mt-auto">
            <button
              onClick={() => router.push(`./products/${product.id}/edit`)}
              className="bg-yellow-900 text-white px-3 py-1 rounded hover:bg-yellow-700 text-sm transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700 text-sm transition"
            >
              Delete
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
