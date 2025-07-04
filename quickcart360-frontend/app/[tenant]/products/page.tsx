import { createClient } from '@/lib/supabase/server';
import { notFound} from 'next/navigation';

export const dynamic= 'force-dynamic';


export default async function ProductsPage(props:{
  params:Promise<{ tenant: string }>;
}) {
  const {tenant} = await props.params;
  const supabase = await createClient();
  
  console.log('TENANT:', tenant);

  if (!tenant) {
    notFound();
  } 

  const { data: merchant, error: merchantError } = await supabase
    .from('merchants')
    .select('id, name')
    .eq('subdomain', tenant)
    .single();

  console.log("MERCHANT ID:", merchant.id, typeof merchant.id);


  console.log('MERCHANT:', merchant);
  if (merchantError) console.error('Merchant error:', merchantError); 

  if (merchantError || !merchant) {
    return <div className="p-10 text-red-500">Merchant not found.</div>;
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('merchant_id', merchant.id);

  console.log("HARD-CODED QUERY PRODUCTS:", products);

  console.log('PRODUCTS:', products);
  if (productsError) console.error('Products error:', productsError);

  if (productsError) {
    return <div className="p-10 text-red-500">Error loading products.</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{merchant.name} – Products</h1>
      {products?.length === 0 ? (
        <>
        <p>No products found.</p>
      <pre>{JSON.stringify(products, null, 2)}</pre></>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <li key={product.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{product.name}</h2>
              <p>{product.description}</p>
              <p className="mt-1 font-bold text-green-600">KES {product.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
