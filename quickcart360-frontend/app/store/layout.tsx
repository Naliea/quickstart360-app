// app/store/layout.tsx
import { CartProvider } from "@/context/CartContext";
import React from "react";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
// This layout wraps the store pages with the CartProvider to manage cart state
// It allows all store pages to access the cart context and functionality