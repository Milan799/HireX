import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = process.env.APP_TYPE === "employer" ? "__employer" :
  process.env.APP_TYPE === "seeker" ? "__seeker" :
    "";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch(`${process.env.API_URL || 'http://localhost:5000/api'}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              role: credentials.role
            })
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Invalid credentials");
          }

          const { user, token } = data;

          return {
            id: user._id.toString(),
            name: user.fullName || user.name,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            accessToken: token,
            hasCompany: !!user.companyId
          };
        } catch (error: any) {
          throw new Error(error.message || "Invalid credentials. Please check your email and password.");
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account && account.provider !== "credentials") {
        try {
          const res = await fetch(`${process.env.API_URL || 'http://localhost:5000/api'}/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: account.provider,
              providerId: account.providerAccountId,
              email: user?.email,
              fullName: user?.name,
              profilePicture: user?.image
            })
          });
          const data = await res.json();
          if (res.ok) {
            token.accessToken = data.token;
            token.role = data.user.role;
            token.id = data.user._id;
            token.fullName = data.user.fullName;
            token.hasCompany = !!data.user.companyId;
            token.isNewUser = data.isNewUser;
          }
        } catch (error) {
          console.error("OAuth backend sync error:", error);
        }
      } else if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role || "candidate";
        token.id = (user as any).id || user.id;
        token.fullName = (user as any).fullName || user.name;
        token.hasCompany = (user as any).hasCompany;
      }

      if (trigger === "update" && session) {
        if (session.hasCompany !== undefined) {
          token.hasCompany = session.hasCompany;
        }
        if (session.isNewUser !== undefined) {
          token.isNewUser = session.isNewUser;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).fullName = token.fullName || session.user.name;
        (session.user as any).hasCompany = token.hasCompany;
        (session.user as any).isNewUser = token.isNewUser;
      }
      return session;
    }
  }
});