// app/store/checkout/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const router = useRouter();

  if (cartItems.length === 0) {
    return <p className="text-center text-gray-500">Your cart is empty.</p>;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerDetails = {
      customer_name: name,
      customer_phone: phone,
      delivery_method: deliveryMethod,
      status: 'pending',
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ cartItems, customerDetails }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      clearCart();
      router.push('/store/cart');
      alert('Order placed!');
    } else {
      alert('Something went wrong.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <form onSubmit={handleCheckout} className="space-y-4 border p-4 rounded">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="block w-full p-2 border text-white rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="block w-full p-2 border text-white rounded"
        />
        <select
          value={deliveryMethod}
          onChange={e => setDeliveryMethod(e.target.value)}
          required
          className="block w-full p-2 border text-white rounded"
        >
          <option value="">Select Delivery Method</option>
          <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
