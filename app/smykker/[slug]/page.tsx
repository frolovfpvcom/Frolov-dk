import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Aftale, knapLys, knapMoerk, SmykkeKort, tekstLink } from "@/components/Dele";
import { ElementKnapper, TilfoejBilleder } from "@/components/Redigering";
import { Billede, billede, T, tekst } from "@/components/Tekst";
import { fakta } from "@/lib/fakta";
import { andreSmykker, billedSrc, findSmykke, hentSmykker } from "@/lib/lister";
import { kontaktLink, site } from "@/lib/site";
import { erSolgt, prisTal, smykker, typer } from "@/lib/smykker";

type Props = { params: Promise<{ slug: string }> };

// Smykker Ossip selv tilføjer, bygges første gang nogen besøger dem.
export function generateStaticParams() {
  return smykker.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await findSmykke((await params).slug);
  if (!s) return {};
  const titel = await tekst(`smykke.${s.slug}.titel`, s.titel);
  const beskrivelse = await tekst(`smykke.${s.slug}.beskrivelse`, s.beskrivelse);
  const forrest = s.billeder[0];
  const img = forrest ? await billede(`smykke.${s.slug}.billede.${forrest.id}`, billedSrc(forrest, 1200)) : undefined;
  return {
    title: titel,
    description: `${beskrivelse} Unikt smykke fra Ossip Frolovs værksted.`,
    openGraph: { title: titel, description: beskrivelse, images: img ? [img] : undefined },
    twitter: { card: "summary_large_image", title: titel, description: beskrivelse, images: img ? [img] : undefined },
  };
}

export default async function SmykkeSide({ params }: Props) {
  const { slug } = await params;
  const alle = await hentSmykker();
  const s = alle.find((a) => a.slug === slug);
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
    image: s.billeder[0] ? await billede(`${k}.billede.${s.billeder[0].id}`, billedSrc(s.billeder[0], 1200)) : undefined,
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
        <div>
          <div className="grid grid-cols-2 gap-3">
            {s.billeder.map((b, i) => (
              <div
                key={b.id}
                className={`relative${i === 0 ? " col-span-2" : ""}${
                  i > 0 && i === s.billeder.length - 1 && i % 2 ? " col-span-2" : ""
                }`}
              >
                <Billede
                  id={`${k}.billede.${b.id}`}
                  src={billedSrc(b, i === 0 ? 1400 : 800)}
                  str={i === 0 ? 1400 : 800}
                  alt={b.titel ?? titel}
                  lazy={i > 0}
                  className="aspect-square w-full bg-pearl-deep object-cover"
                />
                <ElementKnapper
                  liste={`${k}.billeder`}
                  id={b.id}
                  foerste={i === 0}
                  sidste={i === s.billeder.length - 1}
                  hvad="billedet"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <TilfoejBilleder liste={`${k}.billeder`} />
          </div>
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
            placeholder="Tilføj pris (eller skriv Solgt)"
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
          <T
            id={`${k}.beskrivelse`}
            as="p"
            className="mt-5 block text-lg leading-relaxed text-ash"
            placeholder="Tilføj en kort beskrivelse"
          >
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
            Se alle {alle.length}
          </Link>
        </div>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {andreSmykker(alle, s.slug).map((a) => (
            <SmykkeKort key={a.slug} smykke={a} />
          ))}
        </div>
      </section>
    </>
  );
}
