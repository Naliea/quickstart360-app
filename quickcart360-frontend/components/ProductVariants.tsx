"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProductVariantsProps {
  productId: string;
}

export default function ProductVariants({ productId }: ProductVariantsProps) {
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  useEffect(() => {
    const fetchVariants = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("order_items")
        .select("variant")
        .eq("product_id", productId);

      if (!error && data) {
        const uniqueVariants = Array.from(
          new Set(data.map((item) => item.variant).filter(Boolean))
        );
        setVariants(uniqueVariants);
        setSelectedVariant(uniqueVariants[0] || "");
      } else {
        console.error("Error fetching variants:", error);
      }
    };

    fetchVariants();
  }, [productId]);

  return (
    <div className="my-4">
      <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-1">
        Choose a Variant
      </label>
      <select
        id="variant"
        value={selectedVariant}
        onChange={(e) => setSelectedVariant(e.target.value)}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      >
        {variants.map((variant) => (
          <option key={variant} value={variant}>
            {variant}
          </option>
        ))}
      </select>

      {selectedVariant && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: <strong>{selectedVariant}</strong>
        </p>
      )}
    </div>
  );
}
