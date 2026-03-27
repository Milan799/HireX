import NextAuth from "next-auth";

// Extending the built-in session types to include our custom token fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      fullName: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    fullName: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    fullName: string;
    accessToken: string;
  }
}
