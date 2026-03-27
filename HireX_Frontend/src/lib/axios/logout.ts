"use client";

import { signOut } from "next-auth/react";

export const handleLogout = () => {
  // Clear local storage / cookies if needed
  localStorage.clear();

  // NextAuth logout (optional)
  signOut({ callbackUrl: "/auth/login" });
};
