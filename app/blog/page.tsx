import type { Metadata } from "next";
import Link from "next/link";
import { formaterDato, indlaeg } from "@/lib/blog";
import { wix } from "@/lib/wix";

export const metadata: Metadata = {
  title: "Blog",
  description: "Nyt fra værkstedet: nye smykker, historier bag bestillinger, workshops og meditation.",
};

export default function Blog() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Blog</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] sm:text-6xl">Fra værkstedet</h1>
      </div>
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-14 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {indlaeg.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
            <div className="aspect-[4/3] overflow-hidden bg-pearl-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={wix(p.billede, 700)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ash">{formaterDato(p.dato)}</p>
            <h2 className="mt-1 font-display text-2xl group-hover:text-tourmaline">{p.titel}</h2>
            <p className="mt-2 line-clamp-3 text-ash">{p.afsnit[0]}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
