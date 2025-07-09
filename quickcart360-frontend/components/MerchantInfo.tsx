// components/MerchantInfo.tsx
"use client";

import { useMerchant } from "@/context/MerchantContext";

export default function MerchantInfo() {
  const { tenantId } = useMerchant();

  return (
    <div className="bg-green-50 border p-4 rounded">
      <p className="text-lg font-semibold">Welcome to {tenantId}'s shop 🛍️</p>
    </div>
  );
}
