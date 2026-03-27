import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
export async function proxy(request: any) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/mnjuser/homepage",
    "/profile",
    "/admin",
    "/settings",
    "/employer",
  ];

  const session = await auth();

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = pathname.startsWith("/auth/login");

  // ❌ If trying to access protected route without token → go to login
  if (isProtectedRoute && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Handle role-based access for logged-in users
  if (session) {
    const userRole = (session?.user as any)?.role || "candidate"; // Default to candidate

    // If user tries to visit login page → send to their exact dashboard
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      if (userRole === "recruiter") {
        url.pathname = "/employer/dashboard";
      } else {
        url.pathname = "/mnjuser/homepage";
      }
      return NextResponse.redirect(url);
    }

    // Role-based route guards
    // Prevent candidates from accessing employer pages
    if (pathname.startsWith("/employer") && userRole !== "recruiter") {
      const url = request.nextUrl.clone();
      url.pathname = "/mnjuser/homepage";
      return NextResponse.redirect(url);
    }

    // Prevent recruiters from accessing candidate pages
    if (pathname.startsWith("/mnjuser") && userRole === "recruiter") {
      const url = request.nextUrl.clone();
      url.pathname = "/employer/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/mnjuser/homepage/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/employer/:path*",
    "/auth/login",
  ],
};
