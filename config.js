/* ============================================================
   SACAR MART — GLOBAL CONFIGURATION
   ============================================================
   Single source of truth for information repeated across the
   site (header, footer, business card, QR codes, meta tags).
   Change a value here and every place that reads from this file
   updates automatically — no need to hunt through HTML/JS.

   Note: the <head> meta tags (SEO description, Open Graph, JSON-LD)
   are intentionally left as static HTML rather than sourced from
   here, since search engines read meta tags at initial HTML parse
   time, before any JavaScript (including this file) runs.
   ============================================================ */
const SITE_CONFIG = {
  // Shop identity
  shopNameBn: "সাকার মার্ট",
  shopNameEn: "SACAR Mart",
  ownerName: "Saiful Islam",
  websiteTitle: "SACAR Mart - Premium Online Store",

  // Contact
  phone: "01610622995",
  phoneDisplay: "01610-622995",
  phoneIntl: "+8801610622995",
  email: "saiful.987.yu@gmail.com",
  addressEn: "Haji Idris Miah Bazar, Subarnachar, Noakhali.",
  addressBn: "হাজী ইদ্রিস মিয়া বাজার, সুবর্ণচর, নোয়াখালী।",

  // Branding
  logoPath: "logo.svg",
  favicon: "logo.svg",

  // Footer / legal
  copyrightEn: "© 2026 SACAR Mart. A trusted institution in Subarnachar. All rights reserved.",
  copyrightBn: "© 2026 SACAR Mart. সাকার মার্ট সুবর্ণচরের একটি নির্ভরযোগ্য প্রতিষ্ঠান। সর্বস্বত্ব সংরক্ষিত।",

  // Social & web presence
  websiteUrl: "https://saiful-987-yu.github.io/sacarmart/",
  facebook: "https://www.facebook.com/share/1EWWy9FwmA/",
  youtube: "https://youtube.com/@0pristharbani?si=Cy7Ib1JCKezxtUt6",
  whatsapp: "https://wa.me/8801610622995",
  messenger: "https://www.facebook.com/share/1EWWy9FwmA/", // update to a real m.me link when available
  linkedin: "", // future ready — set the real URL to enable the footer's LinkedIn icon

  // Business card — back side static QR codes
  bizCardFacebookQR: "https://www.facebook.com/share/1YQUz8F9ET/",
  bizCardWebsiteQR: "https://saiful-987-yu.github.io/sacarmart/"
};
