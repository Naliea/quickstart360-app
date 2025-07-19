// components/MerchantInfo.tsx
"use client";

import { useMerchant } from "@/context/MerchantContext";
import type { HTMLAttributes } from "react";

export default function MerchantInfo({ className = "" }: HTMLAttributes<HTMLDivElement>) {
  const { tenantId } = useMerchant();

  return (
    <div className={`bg-green-50 border p-4 rounded ${className}`}>
      <p className="text-lg font-semibold">Welcome to {tenantId}'s shop 🛍️</p>
    </div>
  );
}
