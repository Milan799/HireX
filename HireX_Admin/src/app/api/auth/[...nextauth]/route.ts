import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login", {
            email: credentials.email,
            password: credentials.password,
            role: "admin", // Explicitly specifying admin login to backend
          });

          const user = res.data.user;
          const token = res.data.token;

          if (user && token && user.role === "admin") {
            return {
              id: user._id,
              email: user.email,
              role: user.role,
              fullName: user.fullName,
              accessToken: token,
            };
          } else {
             throw new Error("Access Denied: You must be an administrator.");
          }
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Invalid credentials. Ensure you have admin access."
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullName = user.fullName;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
          fullName: token.fullName as string,
          accessToken: token.accessToken as string,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login", // We will build this next
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_admin_secret_hirex_1234",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
