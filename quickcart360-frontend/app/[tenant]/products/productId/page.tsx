import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { tenant: string; productId: string };
}) {
  const { tenant, productId } = params;

  if (!tenant || !productId) {
    notFound();
  }

  const supabase = await createClient();

  const { data: merchant, error: merchantError } = await supabase
    .from('merchants')
    .select('id, name')
    .eq('subdomain', tenant)
    .single();

  console.log('Tenant:', tenant);

  if (merchantError || !merchant) {
    return <div className="p-10 text-red-500">Merchant not found.</div>;
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('merchant_id', merchant.id)
    .single();

  console.log('Product:', product);

  if (productError || !product) {
    return <div className="p-10 text-red-500">Product not found or inaccessible.</div>;
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      {product.image_url && (
        <img src={product.image_url} alt={product.name} className="mb-4 rounded shadow" />
      )}
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-green-600 font-semibold mb-4">KES {product.price}</p>
    </div>
  );
}
