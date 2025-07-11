// app/(dashboard)/about/PageEditor.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type Section =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'divider' }
  | { type: 'social'; meta?: { handle: string } }
  | {
      type: 'iconFeatures';
      features: Array<{
        icon: 'Truck' | 'BadgeCheck' | 'ShieldCheck';
        title: string;
        description: string;
      }>;
    };

export type PageData = {
  sections: Section[];
  footer: {
    columns: { title: string; links: string[] }[];
    copyright: string;
  };
};



export function PageEditor({
  initialData,
  merchantId
}: {
  initialData?: Partial<PageData>;
  merchantId?: string;
}) {
  const supabase = createClient();
  const [data, setData] = useState<PageData>({
    sections: initialData?.sections || [
      { type: 'heading', content: 'About Us' },
      { type: 'paragraph', content: 'Lorem ipsum dolor sit amet...' },
      { type: 'divider', content: '' },
    ],
    footer: initialData?.footer || {
      columns: [
        { title: 'About Us', links: ['Our Story', 'Team'] },
        { title: 'Help', links: ['FAQ', 'Contact'] },
      ],
      copyright: '© 2024 My Store - All Rights Reserved'
    }
  });

  const savePage = async () => {
    if (!merchantId) return;
    
    const { error } = await supabase
      .from('merchant_pages')
      .upsert({
        merchant_id: merchantId,
        sections: data.sections,
        footer: data.footer,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'merchant_id'
      });
    
    if (error) {
      alert('Error saving page: ' + error.message);
    } else {
      alert('Page saved successfully!');
    }
  };

  // Add methods to modify sections and footer here
  // For example: addSection, removeSection, updateSectionContent, etc.

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Page Editor</h2>
      
      <div className="space-y-4">
        {/* Section editing controls would go here */}
        <textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => setData(JSON.parse(e.target.value))}
          className="w-full h-64 font-mono text-sm"
        />
      </div>
      
      <button
        onClick={savePage}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}