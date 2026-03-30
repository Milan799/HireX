import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function middleware(req: any) {
    const session = await auth();
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!session;
    const userRole = (session?.user as any)?.role || "candidate";

    const isAuthRoute = pathname.startsWith("/auth/login");

    // Protect all internal routes
    const protectedRoutes = ["/mnjuser", "/employer", "/profile", "/settings", "/jobs", "/companies", "/services", "/applications", "/pro_profile"];
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // 1. Unauthenticated users trying to access protected routes
    if (!isLoggedIn && isProtectedRoute) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    // 2. Authenticated users
    if (isLoggedIn) {
        // If authenticated user visits login, send them to their dashboard
        if (isAuthRoute) {
            const url = req.nextUrl.clone();
            url.pathname = userRole === "recruiter" ? "/employer/dashboard" : "/mnjuser/homepage";
            return NextResponse.redirect(url);
        }

        // Candidate Route Protection
        const isCandidateRoute = pathname.startsWith("/mnjuser") || pathname.startsWith("/jobs") || pathname.startsWith("/companies") || pathname.startsWith("/services") || pathname === "/";

        // Recruiter checking logic
        if (userRole === "recruiter") {
            const hasCompany = (session.user as any).hasCompany;
            const isKycRoute = pathname.startsWith("/employer/kyc");

            // Complete KYC Onboarding Guard - MUST DO IT FIRST
            if (!hasCompany && !isKycRoute) {
                const url = req.nextUrl.clone();
                url.pathname = "/employer/kyc";
                return NextResponse.redirect(url);
            }

            // Prevent recruiters from hitting candidate domains
            if (isCandidateRoute) {
                const url = req.nextUrl.clone();
                url.pathname = !hasCompany ? "/employer/kyc" : "/employer/dashboard";
                return NextResponse.redirect(url);
            }
        }


        // Candidate trying to access Recruiter paths
        if (userRole === "candidate" || userRole === "user") {
            const isEmployerRoute = pathname.startsWith("/employer");
            if (isEmployerRoute) {
                const url = req.nextUrl.clone();
                url.pathname = "/mnjuser/homepage";
                return NextResponse.redirect(url);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|images|svg|.*\\.png$).*)",
    ],
};
