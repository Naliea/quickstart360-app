import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Step 1: Handle Supabase session middleware
  const response = await updateSession(request)

  // Step 2: Extract the subdomain
  const hostname = request.headers.get('host') || ''
  const isDev = hostname.includes('localhost')

  let subdomain = ''
  if (isDev) {
    // For localhost: e.g. merchant1.localhost:3000
    subdomain = hostname.split('.')[0]
  } else {
    // For production: e.g. merchant1.quickcart.com
    subdomain = hostname.split('.')[0]
  }

  // Optional fallback
  const tenant_slug = subdomain || 'default'

  // Option 1: Attach to URL (for routing like ?merchant=merchant1)
  const url = request.nextUrl.clone()
  url.searchParams.set('profile', tenant_slug)
  const rewritten = NextResponse.rewrite(url, response)



  return rewritten
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

