// app/api/products/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context:{ params :Promise<{ id: string }>} 
   // Extract id from params
) {
  const {id} = await context.params;
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, merchant_id,merchant:merchant_id(name,store_slug)")
    .eq("id", id)
    .single();
  // Check if the product was found
  console.log("Product data:", data);

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
