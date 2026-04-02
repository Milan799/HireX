"use client";

import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { Footer } from "@/components/layout/Footer";
import { EmployerFooter } from "@/components/layout/EmployerFooter";

export default function FooterWrapper() {
  const pathname = usePathname();

  // 🔥 Get role from Redux
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse;
  const role = user?.role || "candidate";

  // ❌ Hide footer on some routes
  const shouldHideFooter =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/mnjuser");

  if (shouldHideFooter) return null;

  // ✅ Role-based footer
  return role === "recruiter" ? <EmployerFooter /> : <Footer />;
}