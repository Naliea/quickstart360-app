"use client";
// context/MerchantContext.tsx
import { createContext, useContext } from "react";

type Merchant = {
  tenantId: string;
  merchant: any; // You can type this properly if you define your schema
};

export const MerchantContext = createContext<Merchant>({
  tenantId: "",
  merchant: null,
});

export const MerchantProvider = ({
  tenantId,
  merchant,
  children,
}: {
  tenantId: string;
  merchant: any;
  children: React.ReactNode;
}) => {
  return (
    <MerchantContext.Provider value={{ tenantId, merchant }}>
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => useContext(MerchantContext);
