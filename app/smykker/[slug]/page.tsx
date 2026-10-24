import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Aftale, knapLys, knapMoerk, SmykkeKort, tekstLink } from "@/components/Dele";
import { Billede, billede, T, tekst } from "@/components/Tekst";
import { fakta } from "@/lib/fakta";
import { kontaktLink, site } from "@/lib/site";
import { andreSmykker, erSolgt, findSmykke, prisTal, smykker, typer } from "@/lib/smykker";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return smykker.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = findSmykke((await params).slug);
  if (!s) return {};
  const titel = await tekst(`smykke.${s.slug}.titel`, s.titel);
  const beskrivelse = await tekst(`smykke.${s.slug}.beskrivelse`, s.beskrivelse);
  const img = await billede(`smykke.${s.slug}.billede.1`, s.billeder[0].id, 1200);
  return {
    title: titel,
    description: `${beskrivelse} Unikt smykke fra Ossip Frolovs værksted.`,
    openGraph: { title: titel, description: beskrivelse, images: [img] },
    twitter: { card: "summary_large_image", title: titel, description: beskrivelse, images: [img] },
  };
}

export default async function SmykkeSide({ params }: Props) {
  const s = findSmykke((await params).slug);
  if (!s) notFound();
  const k = `smykke.${s.slug}`;
  const titel = await tekst(`${k}.titel`, s.titel);
  const pris = await tekst(`${k}.pris`, s.pris);
  const solgt = erSolgt(pris);
  const type = typer.find((t) => t.slug === s.type)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: titel,
    description: await tekst(`${k}.beskrivelse`, s.beskrivelse),
    image: await billede(`${k}.billede.1`, s.billeder[0].id, 1200),
    brand: { "@type": "Brand", name: site.navn },
    material: await tekst(`${k}.materiale`, s.materiale),
    offers: {
      "@type": "Offer",
      priceCurrency: "DKK",
      price: solgt ? undefined : prisTal(pris),
      availability: solgt ? "https://schema.org/SoldOut" : "https://schema.org/InStoreOnly",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Brødkrummer" className="mx-auto max-w-6xl px-5 pt-8 text-sm text-ash sm:px-8">
        <Link href="/smykker" className="hover:text-ink">
          Til salg
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/smykker?type=${type.slug}`} className="hover:text-ink">
          {type.label}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{titel}</span>
      </nav>

      <article className="mx-auto mt-8 grid max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
        <div className="grid grid-cols-2 gap-3">
          {s.billeder.map((b, i) => (
            <Billede
              key={b.id}
              id={`${k}.billede.${i + 1}`}
              wixId={b.id}
              str={i === 0 ? 1400 : 800}
              alt={b.alt}
              lazy={i > 0}
              className={`${i === 0 ? "col-span-2 " : ""}aspect-square w-full bg-pearl-deep object-cover${
                i > 0 && i === s.billeder.length - 1 && i % 2 ? " col-span-2" : ""
              }`}
            />
          ))}
        </div>
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{solgt ? "Solgt" : "Unikt smykke"}</p>
          <T id={`${k}.titel`} as="h1" className="mt-3 block font-display text-5xl leading-[1.05]">
            {s.titel}
          </T>
          <T
            id={`${k}.pris`}
            as="p"
            className={`mt-5 block font-display text-3xl tabular-nums ${solgt ? "text-ash" : "text-gold"}`}
          >
            {s.pris}
          </T>
          <T
            id={`${k}.materiale`}
            as="p"
            className="mt-3 block text-xs uppercase tracking-[0.25em] text-ash"
            placeholder="Tilføj materiale"
          >
            {s.materiale}
          </T>
          <T id={`${k}.beskrivelse`} as="p" className="mt-5 block text-lg leading-relaxed text-ash">
            {s.beskrivelse}
          </T>
          <T
            id={`${k}.detaljer`}
            as="p"
            className="mt-3 block leading-relaxed text-ash"
            placeholder="Tilføj flere detaljer om smykket"
          >
            {s.detaljer}
          </T>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={kontaktLink(titel)} className={knapMoerk}>
              {solgt ? "Bestil noget lignende" : "Spørg om smykket"}
            </Link>
            <a href={site.telefonLink} className={knapLys}>
              Ring {site.telefon}
            </a>
          </div>
          <Aftale />
          <ul className="mt-10 space-y-3 border-t border-ink/15 pt-6 text-sm text-ash">
            {fakta.map((f) => (
              <li key={f.id} className="flex gap-3">
                <span aria-hidden="true" className="text-gold">
                  ◆
                </span>
                <T id={f.id}>{f.tekst}</T>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ash">
            <Link href="/smykker#saadan-koeber-du" className={tekstLink}>
              Sådan køber du et smykke
            </Link>
            . Vil du have noget lignende, men i en anden størrelse, sten eller farve?{" "}
            <Link href="/kontakt" className={tekstLink}>
              Bestil dit eget smykke
            </Link>
            .
          </p>
        </div>
      </article>

      <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Andre smykker</h2>
          <Link href="/smykker" className="text-sm underline underline-offset-4 hover:text-tourmaline">
            Se alle {smykker.length}
          </Link>
        </div>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {andreSmykker(s.slug).map((a) => (
            <SmykkeKort key={a.slug} smykke={a} />
          ))}
        </div>
      </section>
    </>
  );
}
