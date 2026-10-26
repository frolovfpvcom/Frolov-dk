import type { MetadataRoute } from "next";
import { indlaeg } from "@/lib/blog";
import { hentMenu, hentSmykker } from "@/lib/lister";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const menu = (await hentMenu()).filter((m) => !m.skjult);
  const sider = [...menu.map((m) => m.href), "/blog", "/privatliv"];
  return [
    { url: site.url, priority: 1 },
    ...sider.map((s) => ({ url: `${site.url}${s}`, priority: 0.8 })),
    ...(await hentSmykker()).map((s) => ({ url: `${site.url}/smykker/${s.slug}`, priority: 0.7 })),
    ...indlaeg.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.dato, priority: 0.4 })),
  ];
}
