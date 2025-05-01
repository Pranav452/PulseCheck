import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("Middleware running for path:", request.nextUrl.pathname);
  
  try {
    // Create a Supabase client configured to use cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Middleware: Missing Supabase credentials");
      return NextResponse.next();
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    // Get session from request cookie
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Middleware: Error getting session:", error);
      return NextResponse.next();
    }

    // Check auth condition
    const isAuthenticated = !!session;
    console.log("Middleware: Is authenticated:", isAuthenticated, "User:", session?.user?.email);
    
    const isAuthPage = 
      request.nextUrl.pathname === "/login" || 
      request.nextUrl.pathname === "/signup";

    // Redirect based on authentication status
    if (isAuthPage) {
      if (isAuthenticated) {
        console.log("Middleware: Redirecting to dashboard from auth page");
        const dashboardUrl = new URL("/dashboard", request.url);
        console.log("Middleware: Redirect URL:", dashboardUrl.toString());
        return NextResponse.redirect(dashboardUrl);
      }
      return NextResponse.next();
    }

    // Protected routes - only enforce in production
    // In development, we'll allow the user to view the dashboard pages
    // even without auth for easier debugging
    const isProtectedRoute = 
      request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/onboarding");

    if (isProtectedRoute && !isAuthenticated) {
      console.log("Middleware: Redirecting to login from protected route");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (e) {
    console.error("Middleware: Unexpected error:", e);
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/login",
    "/signup",
  ],
}; 