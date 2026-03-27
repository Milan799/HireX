"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { EmployerFooter } from "@/components/layout/EmployerFooter";

export default function FooterWrapper({ appType }: { appType?: string }) {
  const pathname = usePathname();

  // Hide footer on all employer portal pages EXCEPT the landing page, and certain auth/util pages
  const shouldHideFooter =
    pathname.startsWith("/employer") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/mnjuser") ||
    ["/privacy", "/terms", "/fraud-alert"].includes(pathname);

  if (shouldHideFooter) return null;

  if (appType === "employer") {
    return <EmployerFooter />;
  }

  return <Footer />;
}
