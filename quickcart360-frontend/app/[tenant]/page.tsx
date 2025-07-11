// app/(dashboard)/about/page.tsx
import { createClient } from '@/lib/supabase/server';
import { PageEditor } from "@/app/[tenant]/PageEditor/page";
import { PageViewer } from "@/app/[tenant]/PageViewer/page";

export default async function AboutPage() {
  const supabase =await  createClient();
  
  // Get merchant ID
  const { data: { user } } = await supabase.auth.getUser();
  const { data: merchant } = await supabase
    .from('merchants')
    .select('id')
    .eq('created_by', user?.id)
    .single();
    
  // Get page data
  const { data: page } = await supabase
    .from('merchant_pages')
    .select('*')
    .eq('merchant_id', merchant?.id)
    .single();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">About Us Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PageEditor initialData={page} merchantId={merchant?.id} />
        <PageViewer data={page} />
      </div>
    </div>
  );
}