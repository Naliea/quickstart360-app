'use client'; // ✅ Convert ProductPage to a client component

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";



export default function ProductPage() {
  const {id} = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // ✅ use CartContext
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {

        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link
          href="/store/explore"
          className="inline-block px-4 py-2 border border-gray-400 text-white bg-gray-800 rounded-full transition-all duration-200 hover:shadow-full hover:bg-[#8B4513] hover:text-white"
        >
          &larr; Back to Explore
        </Link>
      </div>

      <Image
        src={product.image_url}
        alt={product.name}
        width={600}
        height={400}
        className="rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-lg text-gray-700 mb-4">${product.price}</p>
      <p className="text-gray-600 mb-6">{product.description}</p>

      {/* ✅ Add to Cart Button */}
      <button
        onClick={() => {
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          });

          toast.success(`${product.name} added to cart`);

          router.push("/store/cart"); // ✅ Redirect to cart
        }}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-full mb-4"
      >
        Add to Cart
      </button>

      <Link
        href={`/store/merchants/${product.merchant.store_slug}`}
        className="text-blue-600 underline"
      >
        View more from {product.merchant.name}
      </Link>

      <Button
        asChild
        variant="outline"
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 text-white bg-[#25D366] hover:bg-[#128C7E] rounded-full px-4 py-2 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <a
          href={`https://wa.me/254799638683?text=I'm interested in this product: ${product.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="text-white" size={20} />
          Contact via WhatsApp
        </a>
      </Button>
    </div>
  );
}
