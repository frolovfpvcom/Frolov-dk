import type { MetadataRoute } from "next";
import { indlaeg } from "@/lib/blog";
import { menu, site } from "@/lib/site";
import { smykker } from "@/lib/smykker";

export default function sitemap(): MetadataRoute.Sitemap {
  const sider = [...menu.map((m) => m.href), "/blog", "/privatliv"];
  return [
    { url: site.url, priority: 1 },
    ...sider.map((s) => ({ url: `${site.url}${s}`, priority: 0.8 })),
    ...smykker.map((s) => ({ url: `${site.url}/smykker/${s.slug}`, priority: 0.7 })),
    ...indlaeg.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.dato, priority: 0.4 })),
  ];
}
