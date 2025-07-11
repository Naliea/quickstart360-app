// app/(dashboard)/about/PageViewer.tsx
import { PageData } from '@/app/[tenant]/PageEditor/page';
import { Truck, BadgeCheck, ShieldCheck } from 'lucide-react';


export function PageViewer({ data }: { data?: Partial<PageData> }) {
  const defaultData: PageData = {
  sections: [
    { type: 'heading', content: 'About Us' },
    { type: 'paragraph', content: 'We offer premium jewelry crafted with care.' },
    {
      type: 'iconFeatures',
      features: [
        {
          icon: 'Truck',
          title: 'Free Shipping',
          description: 'On all orders, no minimum required.',
        },
        {
          icon: 'BadgeCheck',
          title: 'Premium Quality',
          description: 'Carefully selected high-grade materials.',
        },
        {
          icon: 'ShieldCheck',
          title: '100% Secure Checkout',
          description: 'Your data is protected with top encryption.',
        },
      ],
    },
    { type: 'divider' },
    { type: 'social', meta: { handle: '@moska.my' } },
  ],
  footer: {
    columns: [
      { title: 'Help', links: ['Terms and Conditions', 'Privacy Policies', 'FAQ'] },
      { title: 'Shop', links: ['New Arrival', 'Bestselling', 'Summer Collection'] },
    ],
    copyright: '© 2025 Moska - All Rights Reserved',
  },
};
 

  const pageData = data || defaultData;
  const iconMap = {
  Truck,
  BadgeCheck,
  ShieldCheck,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Preview</h2>
      <div className="prose max-w-none">
        {pageData.sections?.map((section, index) => {
  switch (section.type) {
    case 'heading':
      return <h1 key={index}>{section.content}</h1>;

    case 'paragraph':
      return <p key={index}>{section.content}</p>;

    case 'divider':
      return <hr key={index} className="my-4" />;

    case 'social':
      return (
        <div key={index} className="my-4">
          <p>Follow us: {section.meta?.handle}</p>
        </div>
      );

    case 'iconFeatures':
      return (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 text-center">
          {section.features.map((feat, i) => {
            const Icon = iconMap[feat.icon];
            return (
              <div key={i}>
                {Icon && <Icon className="mx-auto h-10 w-10 text-[#6e4f3a]" />}
                <h4 className="font-semibold mt-2">{feat.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{feat.description}</p>
              </div>
            );
          })}
        </div>
      );

    default:
      return null;
  }
})}

      </div>
      
      {pageData.footer && (
        <footer className="mt-8 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pageData.footer.columns?.map((column, i) => (
              <div key={i}>
                <h3 className="font-bold">{column.title}</h3>
                <ul className="mt-2 space-y-1">
                  {column.links?.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm hover:underline">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {pageData.footer.copyright}
          </p>
        </footer>
      )}
    </div>
  );
}