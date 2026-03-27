"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchCurrentUser, clearUser } from "@/lib/store/slices/userSlice";

export function AuthListener({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only run this logic when NextAuth has finished determining the session state
    if (status === "loading") return;

    if (!hasInitialized) {
      if (session?.user) {
        // If NextAuth has a user session, trigger the Redux fetch to get full profile
        dispatch(fetchCurrentUser());
      } else {
        // Check if we have a token in localStorage (for email/pwd users)
        const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (localToken) {
          dispatch(fetchCurrentUser());
        } else {
          // If no NextAuth session AND no local token, clear Redux state
          dispatch(clearUser());
        }
      }
      setHasInitialized(true);
    }
  }, [session, status, dispatch, hasInitialized]);

  // Optionally block rendering of children until initial auth state is synced
  // but for now, we just pass through to avoid flashing white screens
  return <>{children}</>;
}
