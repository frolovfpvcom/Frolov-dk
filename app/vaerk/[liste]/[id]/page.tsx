import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Billedvaelger } from "@/components/Billedvaelger";
import { Aftale, knapLys, knapMoerk } from "@/components/Dele";
import { ElementKnapper, TilfoejBilleder } from "@/components/Redigering";
import { T, tekst } from "@/components/Tekst";
import { billedSrc, flytbar, hentListe, skiftbart, slipBilleder } from "@/lib/lister";
import { kontaktLink, site } from "@/lib/site";

// Siden for et enkelt smykke fra en billedstribe. Det første billede er det fra striben;
// Ossip kan tilføje flere og skrive titel, materialer og en beskrivelse.
type Props = { params: Promise<{ liste: string; id: string }> };

const STRIBELISTE = /^(fri\.[a-z0-9-]+|side\.[a-z0-9-]+\.blokke)$/;

export function generateStaticParams() {
  return [];
}

async function find(params: Props["params"]) {
  const { liste: raa, id } = await params;
  const liste = decodeURIComponent(raa);
  if (!STRIBELISTE.test(liste) || !/^[a-z0-9]+$/.test(id)) return null;
  const element = (await hentListe(liste)).find((e) => e.id === id && e.slags === "billede");
  return element ? { liste, id, element } : null;
}

// Hvor striben står, så man kan gå tilbage dertil.
function tilbage(liste: string) {
  const egen = liste.match(/^side\.([a-z0-9-]+)\.blokke$/);
  if (egen) return `/${egen[1]}`;
  const sted = liste.replace(/^fri\./, "").replace(/-(top|bund)$/, "");
  return sted === "forside" ? "/" : `/${sted}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fundet = await find(params);
  if (!fundet) return {};
  const titel = await tekst(`vaerk.${fundet.id}.titel`, "");
  const beskrivelse = await tekst(`vaerk.${fundet.id}.tekst`, "");
  return {
    title: titel || "Smykke",
    description: beskrivelse.slice(0, 160) || undefined,
    openGraph: { images: [billedSrc(fundet.element, 1200)] },
  };
}

export default async function Vaerk({ params }: Props) {
  const fundet = await find(params);
  if (!fundet) notFound();
  const { liste, id, element } = fundet;
  const k = `vaerk.${id}`;
  const ekstra = await hentListe(`${k}.billeder`);
  const titel = await tekst(`${k}.titel`, "");

  const billeder = [element, ...ekstra].map((b) => ({
    src: billedSrc(b, 1400),
    lille: billedSrc(b, 300),
    alt: titel || "Smykke af Ossip Frolov",
  }));

  return (
    <>
      <nav aria-label="Brødkrummer" className="mx-auto max-w-6xl px-5 pt-8 text-sm text-ash sm:px-8">
        <Link href={tilbage(liste)} className="hover:text-ink">
          ← Tilbage
        </Link>
      </nav>

      <article className="mx-auto mt-8 grid max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div {...slipBilleder(`${k}.billeder`)}>
          <Billedvaelger billeder={billeder} foersteAttr={skiftbart(liste, element)} />

          <div data-only-editing="" className="mt-8 border-t border-dashed border-gold/50 pt-6">
            <p className="text-sm text-ash">
              Det store billede er det fra striben (dobbeltklik for at skifte det). Her kan du tilføje flere billeder af
              smykket, eller trække dem hertil.
            </p>
            {ekstra.length ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {ekstra.map((b, i) => (
                  <div key={b.id} className="relative" {...flytbar(`${k}.billeder`, b.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...skiftbart(`${k}.billeder`, b)}
                      src={billedSrc(b, 400)}
                      alt=""
                      className="aspect-square w-full bg-pearl-deep object-cover"
                    />
                    <ElementKnapper
                      liste={`${k}.billeder`}
                      id={b.id}
                      foerste={i === 0}
                      sidste={i === ekstra.length - 1}
                      hvad="billedet"
                      className="absolute top-1 right-1 z-10 scale-90"
                    />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-4">
              <TilfoejBilleder liste={`${k}.billeder`} />
            </div>
          </div>
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Unikt smykke</p>
          <T
            id={`${k}.titel`}
            as="h1"
            className="mt-3 block font-display text-5xl leading-[1.05]"
            placeholder="Giv smykket et navn"
          />
          <T
            id={`${k}.materiale`}
            as="p"
            className="mt-4 block text-xs uppercase tracking-[0.25em] text-ash"
            placeholder="Materialer, fx 18K guld og safir"
          />
          <T
            id={`${k}.pris`}
            as="p"
            className="mt-4 block font-display text-3xl tabular-nums text-gold"
            placeholder="Pris (eller lad den stå tom)"
          />
          <div aria-hidden="true" className="mt-8 flex items-center gap-3 text-gold">
            <span className="h-px w-12 bg-gold/60" />
            <span className="text-xs">◆</span>
            <span className="h-px w-12 bg-gold/60" />
          </div>
          <T
            id={`${k}.tekst`}
            as="p"
            className="mt-8 block font-display text-2xl leading-snug first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-gold"
            placeholder="Skriv et par linjer om smykket: idéen bag, stenene, hvem det blev lavet til"
          />
          <T
            id={`${k}.detaljer`}
            as="p"
            className="mt-6 block leading-relaxed whitespace-pre-line text-ash"
            placeholder="Flere detaljer (valgfrit)"
          />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={kontaktLink(titel || "Et smykke fra siden")} className={knapMoerk}>
              Spørg om smykket
            </Link>
            <a href={site.telefonLink} className={knapLys}>
              Ring {site.telefon}
            </a>
          </div>
          <Aftale />
        </div>
      </article>
    </>
  );
}
