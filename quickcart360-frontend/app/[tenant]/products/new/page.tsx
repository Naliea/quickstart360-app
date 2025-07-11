"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, Loader2 } from "lucide-react";

export default function AddProductPage() {
  const { tenant } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    image_url: string | File;
  }>({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    price?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors: { name?: string; price?: string } = {};

    if (!formData.name.trim()) errors.name = "Product name is required.";

    const priceNumber = parseFloat(formData.price);
    if (!formData.price.trim()) {
      errors.price = "Price is required.";
    } else if (isNaN(priceNumber) || priceNumber <= 0) {
      errors.price = "Enter a valid price greater than 0.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validate()) return;
    setLoading(true);

    const { name, description, price, image_url } = formData;

    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("id")
      .eq("subdomain", tenant)
      .single();

    if (merchantError || !merchant) {
      setError("Merchant not found.");
      setLoading(false);
      return;
    }

    let uploadedImageUrl = "";
    if (image_url instanceof File) {
      const fileExt = image_url.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image_url);

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(fileName);

      uploadedImageUrl = publicUrl;
    }

    const { error: insertError } = await supabase.from("products").insert([
      {
        name,
        description,
        price: parseFloat(price),
        image_url: uploadedImageUrl,
        merchant_id: merchant.id,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
    });

    setTimeout(() => router.push(`/${tenant}/products`), 2000);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Add New Product
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Product added successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="e.g. Brown scarf"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            value={formData.name}
            onChange={handleChange}
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500 mt-1">
              {validationErrors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Product Description"
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (KES)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="e.g. 650"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            value={formData.price}
            onChange={handleChange}
          />
          {validationErrors.price && (
            <p className="text-sm text-red-500 mt-1">
              {validationErrors.price}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            name="image_url"
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData((prev) => ({ ...prev, image_url: file }));
              }
            }}
          />
        </div>

        {formData.image_url instanceof File && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <img
              src={URL.createObjectURL(formData.image_url)}
              alt="Preview"
              className="h-32 rounded border object-contain"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition disabled:opacity-50 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
}
