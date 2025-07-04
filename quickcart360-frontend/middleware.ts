import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  
  // Pass tenant ID to downstream components via headers
  const host = request.headers.get("host") || "";
  const subdomain = host.split('.')[0];
  const tenantId = subdomain === 'localhost' ? 'default' : subdomain;
  
  response.headers.set("x-tenant-id", tenantId);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


