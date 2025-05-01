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
    
    // TEMPORARY: Skip auth checks and redirects to debug login flow
    console.log("Middleware: Auth checks temporarily disabled for debugging");
    return NextResponse.next();
    
    /* COMMENTED OUT FOR DEBUGGING
    const isAuthPage = 
      request.nextUrl.pathname === "/login" || 
      request.nextUrl.pathname === "/signup";

    // Redirect based on authentication status
    if (isAuthPage) {
      if (isAuthenticated) {
        // Check if we've already redirected (using cookies to avoid infinite redirects)
        const redirectCookie = request.cookies.get('dashboard_redirect');
        if (redirectCookie) {
          console.log("Middleware: Skipping redirect to prevent loop");
          return NextResponse.next();
        }
        
        console.log("Middleware: Redirecting to dashboard from auth page");
        const dashboardUrl = new URL("/dashboard", request.url);
        console.log("Middleware: Redirect URL:", dashboardUrl.toString());
        const response = NextResponse.redirect(dashboardUrl);
        
        // Set a cookie to prevent redirect loops
        response.cookies.set('dashboard_redirect', '1', { 
          maxAge: 5, // Short-lived cookie (5 seconds)
          path: '/' 
        });
        
        return response;
      }
      return NextResponse.next();
    }

    // Protected routes
    const isProtectedRoute = 
      request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/onboarding");

    if (isProtectedRoute && !isAuthenticated) {
      console.log("Middleware: Redirecting to login from protected route");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    */

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