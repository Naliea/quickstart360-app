"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProductFormProps {
  mode: "edit" | "create";
  initialData?: {
    name: string;
    description: string;
    price: number;
    image_url?: string;
    [key: string]: any;
  };
  tenant: string;
  productId?: string;
}

export default function ProductForm({
  mode,
  initialData,
  tenant,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    image_url: initialData?.image_url || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "edit" && productId) {
      const { error } = await supabase
        .from("products")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", productId);

      if (!error) {
        router.push(`/${tenant}/products`);
      } else {
        alert("Error updating product: " + error.message);
      }
    }

    // Optional: Add logic for mode === "create"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full border p-2 rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 rounded"
      />
      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full border p-2 rounded"
      />
      <input
        name="image_url"
        value={formData.image_url}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        {mode === "edit" ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
