import type { NextConfig } from "next";

// Gamle adresser fra Wix-siden, så links og Google-resultater stadig virker.
const wix: [string, string][] = [
  ["/projects-8", "/smykker"],
  ["/atelier", "/smykker"],
  ["/about-5", "/kunstneren"],
  ["/contact", "/kontakt"],
  ["/faq", "/det-praktiske"],
  ["/post/instgram-inspirationen", "/blog/instagram-inspirationen"],
  ["/post/kærlig-vind-i-sejlene", "/blog/kaerlig-vind-i-sejlene"],
  ["/post/k%C3%A6rlig-vind-i-sejlene", "/blog/kaerlig-vind-i-sejlene"],
  ["/post/design-en-fantastisk-blog", "/blog/meditation-og-te-soendag-formiddag"],
  ["/post/opbyg-dit-community", "/blog/droemmen-til-virkelighed"],
  ["/post/:slug", "/blog/:slug"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return wix.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  experimental: {
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
