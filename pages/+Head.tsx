import React from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Head() {
  const pageContext = usePageContext();
  const rawPath = pageContext?.urlPathname || "/";
  const pathname = rawPath.split("?")[0].replace(/\/+$/, "") || "/";
  const canonicalUrl = `https://ecomwithsami.com${pathname === "/" ? "" : pathname}`;

  // Dynamic Page Metadata Mapping
  let title = "Ecom With Sami | Master UAE & KSA Dropshipping (From Scratch to Scaling)";
  let description = "Learn step-by-step UAE & KSA Shopify dropshipping from Sami Ur Rehman. 9,700+ students trained, Facebook & TikTok Ads mastery, verified Gulf suppliers, and lifetime WhatsApp mentorship.";
  let isNoIndex = false;

  if (pathname.startsWith("/admin")) {
    title = "Admin Dashboard | Ecom With Sami";
    description = "Administrative control panel for Ecom With Sami Academy.";
    isNoIndex = true;
  } else if (pathname.startsWith("/lms")) {
    title = "Student LMS Classroom | Ecom With Sami";
    description = "VIP Student video portal and practical curriculum access.";
    isNoIndex = true;
  } else if (pathname === "/enrollment" || pathname === "/checkout") {
    title = "Enroll Now - UAE & KSA Dropshipping Mastery | Ecom With Sami";
    description = "Secure your seat in Pakistan's #1 Gulf dropshipping course for 3,900 PKR. Instant access to 36 HD video lessons, verified suppliers, and lifetime WhatsApp support.";
  } else if (pathname === "/about") {
    title = "About Sami Ur Rehman | Ecom With Sami Academy";
    description = "Learn about Sami Ur Rehman's journey and mission to empower Pakistani youth to build profitable UAE & KSA e-commerce businesses.";
  } else if (pathname === "/blogs") {
    title = "E-Commerce & Dropshipping Guides & Case Studies | Ecom With Sami";
    description = "Read expert articles on Shopify dropshipping, Gulf COD logistics, TikTok ads optimization, and product research in UAE & Saudi Arabia.";
  } else if (pathname === "/support") {
    title = "Contact & Student Support | Ecom With Sami";
    description = "Get in touch with the official Ecom With Sami support team via WhatsApp, email, or live ticketing.";
  } else if (pathname === "/apps") {
    title = "Download LMS Desktop & Mobile Apps | Ecom With Sami";
    description = "Download the official Ecom With Sami Windows desktop player and Android APK for smooth offline and HD streaming.";
  } else if (pathname === "/success") {
    title = "Enrollment Submitted | Ecom With Sami";
    description = "Your enrollment verification request has been received. Our team will verify and activate your student portal.";
  } else if (pathname === "/login") {
    title = "Student Portal Login | Ecom With Sami";
    description = "Log in to your Ecom With Sami student classroom.";
  }

  // Schema Markup JSON-LD Structured Data
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "UAE & KSA Shopify Dropshipping Mastery",
    "description": "Comprehensive practical training teaching Gulf e-commerce, product hunting, COD suppliers, and TikTok ads from Pakistan.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Ecom With Sami Academy",
      "sameAs": "https://ecomwithsami.com"
    },
    "instructor": {
      "@type": "Person",
      "name": "Sami Ur Rehman",
      "jobTitle": "Digital E-Commerce & Ads Expert"
    },
    "offers": {
      "@type": "Offer",
      "price": "3900",
      "priceCurrency": "PKR",
      "category": "Paid",
      "availability": "https://schema.org/InStock",
      "url": "https://ecomwithsami.com/enrollment"
    },
    "educationalCredentialAwarded": "Certificate of Completion in Gulf Dropshipping"
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Ecom With Sami",
    "url": "https://ecomwithsami.com",
    "logo": "https://ecomwithsami.com/images/logo.png",
    "description": "Pakistan's leading digital academy for UAE and Saudi Arabia e-commerce dropshipping training.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "telephone": "+92-333-0093269",
      "email": "support@ecomwithsami.com"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I need a lot of money or inventory to start?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. With dropshipping, you never buy products in advance. Your verified supplier in UAE or Saudi Arabia only ships after a customer places an order on your store."
        }
      },
      {
        "@type": "Question",
        "name": "Can beginners with zero experience join?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The entire course is in simple Urdu/Hindi from complete scratch, covering Shopify store creation, product sourcing, and TikTok ads step-by-step."
        }
      },
      {
        "@type": "Question",
        "name": "How do I receive payments from UAE and Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In the Gulf market, customers pay via Cash on Delivery (COD). Local couriers collect cash and deposit profits directly into your Pakistani bank account or Payoneer."
        }
      }
    ]
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#030712" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Directives */}
      {isNoIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Ecom With Sami" />
      <meta property="og:image" content="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80" />
      
      {/* DNS Prefetch & Preconnect for High-Speed Mobile Rendering */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Structured Data JSON-LD Schemas */}
      {!isNoIndex && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          />
          {pathname === "/" && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
          )}
        </>
      )}
    </>
  );
}
