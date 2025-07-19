// app/store/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <p className="text-center text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      <ul className="mb-6">
        {cartItems.map((item, index) => (
          <li key={index} className="mb-2">
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>

      <Link
        href="/store/checkout"
        className="inline-block bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-blue-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
