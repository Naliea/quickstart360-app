// app/[tenant]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function TenantHomepage({
  params,
}: {
  params: { tenant: string };
}) {
  const supabase = await createClient();

  // Fetch merchant based on subdomain (tenant)
  const { data: merchant, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('subdomain', params.tenant)
    .single();

  if (!merchant || error) {
    notFound(); // show 404 if no merchant found
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold">Welcome to {merchant.name}!</h1>
      <p className="mt-4 text-lg text-gray-600">{merchant.description}</p>

      <div className="mt-10">
        <a
          href={`/${params.tenant}/products`}
          className="text-blue-600 underline text-lg"
        >
          View All Products →
        </a>
      </div>
    </main>
  );
}
//Style this page more:display all t