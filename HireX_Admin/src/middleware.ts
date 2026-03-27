import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Must have a token, and the role must be "admin" to access anything other than /login
      return !!token && token.role === "admin";
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protect all `/admin/...` paths.
  matcher: ["/dashboard/:path*", "/users/:path*", "/employers/:path*", "/jobs/:path*", "/messages/:path*", "/"],
};
