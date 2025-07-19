// app/api/orders/route.ts
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
   

    const{data:{user}}=await supabase.auth.getUser();
    

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    } 
    
    const { cartItems, customerDetails } = await req.json();

    const merchantId = cartItems[0]?.merchant_id;
    if (!merchantId) {
     return Response.json({ error: "Merchant ID is required" }, { status: 400 });
    }
    
    const { data: order, error } = await supabase
      .from("orders")
      .insert([{ ...customerDetails, status: 'pending',
        merchant_id: merchantId,
        user_id: user?.id
       }])
      .select()
      .single();

      console.log(cartItems);

    if (error) {
      console.error("Order insert error:", error);
      return Response.json({ error }, { status: 500 });
    }

    const items = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      variant: item.variant,
    }));

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(items);

    if (itemError) {
      console.error("Item insert error:", itemError);
      return Response.json({ itemError }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
