'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function withAuth(Component: any) {
  return function AuthWrapper(props: any) {
    const router = useRouter();

    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) router.push('/auth/login');
      });
    }, []);

    return <Component {...props} />;
  };
}