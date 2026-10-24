import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findIndlaeg, formaterDato, indlaeg } from "@/lib/blog";
import { wix } from "@/lib/wix";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return indlaeg.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findIndlaeg((await params).slug);
  if (!p) return {};
  return { title: p.titel, description: p.afsnit[0].slice(0, 155) };
}

export default async function Indlaeg({ params }: Props) {
  const p = findIndlaeg((await params).slug);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 pt-16 sm:px-8 sm:pt-24">
      <Link href="/blog" className="text-sm text-ash hover:text-ink">
        ← Alle indlæg
      </Link>
      <p className="mt-8 text-xs uppercase tracking-[0.3em] text-gold">
        <time dateTime={p.dato}>{formaterDato(p.dato)}</time>
      </p>
      <h1 className="mt-3 font-display text-5xl leading-tight">{p.titel}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={wix(p.billede, 1400)} alt="" className="mt-10 w-full bg-pearl-deep" />
      <div className="mt-10 space-y-5 text-lg leading-relaxed text-ash">
        {p.afsnit.map((a, i) => (
          <p key={i}>{a}</p>
        ))}
      </div>
      {p.billeder ? (
        <div className="mt-10 grid grid-cols-2 gap-3">
          {p.billeder.map((id) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={id}
              src={wix(id, 800)}
              alt=""
              loading="lazy"
              className="aspect-square w-full bg-pearl-deep object-cover"
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
