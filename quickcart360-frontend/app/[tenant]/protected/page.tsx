// app/[tenant]/protected/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MerchantInfo from "@/components/MerchantInfo";
import { ShoppingBag, CirclePlus } from "lucide-react"; // ✅ Lucide icons

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-[#4e342e] overflow-hidden px-4 py-16">
      <MerchantInfo className="absolute top-6 centre bg-white/90 text-[#4e342e] rounded-xl px-4 py-2 shadow-lg backdrop-blur-md z-20" />
      
      {/* Background Circles */}
      <div className="absolute w-[500px] h-[500px] bg-white rounded-full top-[-100px] left-[-100px] opacity-20 blur-3xl"></div>
      <div className="absolute w-[300px] h-[300px] bg-black rounded-full bottom-[-80px] right-[-80px] opacity-30 blur-2xl"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* View Products Card */}
        <Link href="./products">
          <div className="bg-gradient-to-br from-[#7b5e57] to-[#a1887f] text-white rounded-2xl p-8 text-center shadow-xl transition-transform transform hover:scale-105">
            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md mb-4 flex items-center justify-center">
              <ShoppingBag className="text-[#4e342e] w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-wider">VIEW PRODUCTS</h3>
            <p className="mt-2 text-sm text-gray-200">
              Browse and manage all the items in your store.
            </p>
          </div>
        </Link>

        {/* Add Product Card */}
        <Link href="./products/new">
          <div className="bg-gradient-to-br from-[#7b5e57] to-[#a1887f] text-white rounded-2xl p-8 text-center shadow-xl transition-transform transform hover:scale-105">
            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md mb-4 flex items-center justify-center">
              <CirclePlus className="text-[#4e342e] w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-wider">ADD PRODUCT</h3>
            <p className="mt-2 text-sm text-gray-200">
              Upload and list a new item for your customers.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
