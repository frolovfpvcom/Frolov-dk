import Link from "next/link";
import type { ReactNode } from "react";
import { Billede, T } from "./Tekst";
import { aftale } from "@/lib/fakta";
import { hentIndhold } from "@/lib/indhold";
import { erSolgt, type Smykke } from "@/lib/smykker";
import { wix } from "@/lib/wix";

export const knapMoerk = "bg-ink px-6 py-3 text-[0.95rem] tracking-wide text-pearl hover:bg-tourmaline";
export const knapLys = "border border-ink/25 px-6 py-3 text-[0.95rem] tracking-wide hover:border-ink";
export const tekstLink = "text-ink underline underline-offset-4 hover:text-tourmaline";

export function SideTop({ lille, titel, children }: { lille: string; titel: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{lille}</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] sm:text-6xl">{titel}</h1>
      {children ? <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">{children}</div> : null}
    </div>
  );
}

export function Aftale({ className = "mt-4" }: { className?: string }) {
  return (
    <T id="aftale" as="p" className={`${className} block text-sm text-ash`}>
      {aftale}
    </T>
  );
}

export const trin = [
  {
    titel: "Første møde",
    tekst: "Vi mødes på værkstedet eller online og taler om, hvad smykket skal betyde for dig.",
  },
  {
    titel: "Dine materialer",
    tekst: "Gammelt guld, arvede ringe og sten kan smeltes om og genbruges. Det gør smykket personligt og billigere.",
  },
  {
    titel: "Det færdige smykke",
    tekst: "Farver, former og proportioner der passer til dit liv, skabt i hånden på værkstedet.",
  },
];

const priser = [
  { id: "bestilling.leveringstid", navn: "Leveringstid", placeholder: "Tilføj leveringstid" },
  { id: "bestilling.vielsesringe-fra", navn: "Vielsesringe fra", placeholder: "Tilføj pris" },
  { id: "bestilling.ringe-fra", navn: "Ringe på bestilling fra", placeholder: "Tilføj pris" },
];

// Leveringstid og fra-priser. Vises først for besøgende, når Ossip har udfyldt dem.
export async function Priser({ className }: { className: string }) {
  const { tekst } = await hentIndhold();
  const udfyldt = (id: string) => Boolean(tekst[id]);
  return (
    <dl
      className={`grid gap-6 sm:grid-cols-3 ${className}`}
      data-only-editing={priser.some((p) => udfyldt(p.id)) ? undefined : ""}
    >
      {priser.map((p) => (
        <div key={p.id} data-only-editing={udfyldt(p.id) ? undefined : ""}>
          <dt className="text-xs uppercase tracking-[0.25em] text-ash">
            <T id={`${p.id}.navn`}>{p.navn}</T>
          </dt>
          <T id={p.id} as="dd" className="mt-1 block font-display text-2xl text-gold" placeholder={p.placeholder} />
        </div>
      ))}
    </dl>
  );
}

export async function SmykkeKort({ smykke: s }: { smykke: Smykke }) {
  const { tekst } = await hentIndhold();
  const solgt = erSolgt(tekst[`smykke.${s.slug}.pris`] ?? s.pris);
  const hover = s.billeder[1];
  return (
    <article className="group">
      <Link href={`/smykker/${s.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-pearl-deep">
          <Billede
            id={`smykke.${s.slug}.billede.1`}
            wixId={s.billeder[0].id}
            str={900}
            alt={s.billeder[0].alt}
            lazy
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]${solgt ? " opacity-70" : ""}`}
          />
          {hover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wix(hover.id, 900)}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 [html[data-editing]_&]:hidden"
            />
          ) : null}
          {solgt ? (
            <span className="absolute top-3 left-3 bg-oxide px-3 py-1 text-xs uppercase tracking-[0.2em] text-pearl">
              Solgt
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <T
            id={`smykke.${s.slug}.titel`}
            as="h3"
            className="font-display text-xl leading-tight group-hover:text-tourmaline"
          >
            {s.titel}
          </T>
          <T
            id={`smykke.${s.slug}.pris`}
            as="p"
            className={`shrink-0 text-sm tabular-nums ${solgt ? "text-ash" : "text-gold"}`}
          >
            {s.pris}
          </T>
        </div>
        <T
          id={`smykke.${s.slug}.materiale`}
          as="p"
          className="mt-1 text-xs uppercase tracking-[0.18em] text-ash"
          placeholder="Tilføj materiale"
        >
          {s.materiale}
        </T>
        <T id={`smykke.${s.slug}.beskrivelse`} as="p" className="mt-1 text-sm text-ash">
          {s.beskrivelse}
        </T>
      </Link>
    </article>
  );
}
