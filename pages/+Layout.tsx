import "./DesignSystem.css";
import React, { useEffect } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { TopMarquee } from "../components/TopMarquee";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WhatsAppWidget } from "../components/WhatsAppWidget";
import { AdminLayout } from "../components/AdminLayout";
import { DynamicPixels } from "../components/DynamicPixels";
import { StickyMobileCta } from "../components/StickyMobileCta";
import { ScrollEffects } from "../components/ScrollEffects";
import { analytics } from "../utils/analytics";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const rawPath = pageContext?.urlPathname || "/";
  // Robust normalization (handles trailing slashes and query params)
  const urlPathname = rawPath.split("?")[0].replace(/\/+$/, "") || "/";

  // Track PageViews across client-side SPA navigation
  useEffect(() => {
    if (!urlPathname.startsWith("/admin")) {
      analytics.trackPageView(urlPathname);
    }
  }, [urlPathname]);

  // 1. Admin Login Page (Clean full-screen without sidebar)
  if (urlPathname === "/admin/login") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0B0F19" }}>
        {children}
      </div>
    );
  }

  // 2. Protected Admin Dashboard & Management Routes
  if (urlPathname.startsWith("/admin")) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // 3. VIP LMS Classroom Portal & Student Login (Dedicated pure LMS experience)
  if (urlPathname.startsWith("/lms") || urlPathname === "/login") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0B0F19" }}>
        <DynamicPixels />
        {children}
      </div>
    );
  }

  // 4. Public Educational & E-Commerce Website
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <ScrollEffects />
      <DynamicPixels />
      <TopMarquee />
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <WhatsAppWidget />
      <StickyMobileCta />
    </div>
  );
}
