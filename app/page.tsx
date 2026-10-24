import Link from "next/link";
import { Aftale, knapLys, knapMoerk, Priser, SmykkeKort, trin } from "@/components/Dele";
import { Billede, T } from "@/components/Tekst";
import { hentIndhold } from "@/lib/indhold";
import { instagram, udvalgte } from "@/lib/galleri";
import { bestillingBillede, kunstnerAfsnit, kunstnerOverskrift, portraet } from "@/lib/kunstneren";
import { site } from "@/lib/site";
import { smykker } from "@/lib/smykker";
import { wix } from "@/lib/wix";
import { workshops } from "@/lib/workshops";

const ANTAL_KUNDER = 6;

export default async function Forside() {
  const { tekst } = await hentIndhold();
  const kunder = Array.from({ length: ANTAL_KUNDER }, (_, i) => i + 1);
  const harKunde = (n: number) => Boolean(tekst[`kunder.${n}.citat`]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-12 pb-16 sm:px-8 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <T id="forside.lille-overskrift" as="p" className="block text-xs uppercase tracking-[0.3em] text-gold">
            Guldsmed i Brønshøj
          </T>
          <T id="forside.overskrift" as="h1" className="mt-5 block font-display text-5xl leading-[1.02] sm:text-7xl">
            Smykker der *husker* for dig
          </T>
          <T id="forside.intro" as="p" className="mt-6 block max-w-xl text-lg leading-relaxed text-ash">
            Jeg har lavet smykker på bestilling i over 25 år. Fra det første møde til det færdige smykke er det en
            spændende rejse. Igennem et unikt smykke kan vi sammen formidle dét som er vigtigt for dig, dét som vil
            støtte dig i dit liv i de svære øjeblikke, dét der vil minde dig om kærlighedens kraft.
          </T>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className={knapMoerk}>
              Bestil et smykke
            </Link>
            <Link href="/smykker" className={knapLys}>
              Se smykker til salg
            </Link>
          </div>
          <Aftale />
        </div>
        <div className="relative">
          <Billede
            id="forside.billede"
            wixId={udvalgte[0]}
            str={1200}
            alt="Unikt smykke af Ossip Frolov"
            className="aspect-[4/5] w-full object-cover"
          />
          <Billede
            id="forside.portraet"
            wixId={portraet}
            str={400}
            alt="Ossip Frolov"
            className="absolute -bottom-6 -left-6 hidden aspect-square w-36 border-4 border-pearl object-cover sm:block"
          />
        </div>
      </section>

      <section aria-label="Udvalgte smykker" className="overflow-x-auto py-6">
        <ul className="flex w-max gap-3 px-5 sm:px-8">
          {udvalgte.slice(0, 10).map((id) => (
            <li key={id} className="h-44 w-44 shrink-0 overflow-hidden bg-pearl-deep sm:h-56 sm:w-56">
              <Link href="/galleri" aria-label="Se flere smykker i galleriet">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={wix(id, 500)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Til salg på værkstedet</p>
            <h2 className="mt-3 font-display text-4xl">Færdige smykker</h2>
          </div>
          <Link href="/smykker" className="text-sm underline underline-offset-4 hover:text-tourmaline">
            Se alle {smykker.length} smykker
          </Link>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {smykker.slice(0, 3).map((s) => (
            <SmykkeKort key={s.slug} smykke={s} />
          ))}
        </div>
      </section>

      <section className="mt-24 bg-pearl-deep">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Smykker på bestilling</p>
          <T
            id="forside.bestilling.overskrift"
            as="h2"
            className="mt-3 block max-w-2xl font-display text-4xl leading-tight"
          >
            Sådan bliver dit smykke til
          </T>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {trin.map((t, i) => (
              <div key={t.titel}>
                <p className="font-display text-5xl text-gold">{i + 1}</p>
                <T id={`forside.trin.${i + 1}.titel`} as="h3" className="mt-3 block font-display text-2xl">
                  {t.titel}
                </T>
                <T id={`forside.trin.${i + 1}.tekst`} as="p" className="mt-2 block leading-relaxed text-ash">
                  {t.tekst}
                </T>
              </div>
            ))}
          </div>
          <Priser className="mt-12 border-t border-ink/15 pt-8" />
          <Link href="/kontakt" className={`mt-12 inline-block ${knapMoerk}`}>
            Book et møde
          </Link>
          <Aftale />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pt-24 sm:px-8 md:grid-cols-2">
        <Billede
          id="forside.kunstneren.billede"
          wixId={bestillingBillede}
          str={900}
          alt="Smykker på bestilling"
          lazy
          className="aspect-[4/5] w-full object-cover"
        />
        <div className="self-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Kunstneren</p>
          <T id="kunstneren.overskrift" as="h2" className="mt-3 block font-display text-4xl leading-tight">
            {kunstnerOverskrift}
          </T>
          <T id="kunstneren.afsnit.2" as="p" className="mt-5 block leading-relaxed text-ash">
            {kunstnerAfsnit[1]}
          </T>
          <Link
            href="/kunstneren"
            className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-tourmaline"
          >
            Læs mere om Ossip
          </Link>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-5 pt-24 sm:px-8"
        data-only-editing={kunder.some(harKunde) ? undefined : ""}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Det siger kunderne</p>
        <T id="kunder.overskrift" as="h2" className="mt-3 block font-display text-4xl">
          Fra dem der bærer smykkerne
        </T>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {kunder.map((n) => (
            <figure
              key={n}
              className="border-t border-gold/40 pt-6"
              data-only-editing={harKunde(n) ? undefined : ""}
            >
              <T
                id={`kunder.${n}.citat`}
                as="blockquote"
                className="block font-display text-2xl leading-snug"
                placeholder="Tilføj en kundeudtalelse (med kundens lov)"
              />
              <T
                id={`kunder.${n}.navn`}
                as="figcaption"
                className="mt-4 block text-sm text-ash"
                placeholder="Kundens navn"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">På værkstedet</p>
            <h2 className="mt-3 font-display text-4xl">Workshops og stille stunder</h2>
          </div>
          <Link href="/workshops" className="text-sm underline underline-offset-4 hover:text-tourmaline">
            Se workshops
          </Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {workshops.map((w) => (
            <Link
              key={w.slug}
              href={`/workshops#${w.slug}`}
              className="group grid grid-cols-[8rem_1fr] items-center gap-5 sm:grid-cols-[10rem_1fr]"
            >
              <div className="aspect-square overflow-hidden bg-pearl-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={wix(w.billede, 400)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div>
                <T
                  id={`workshop.${w.slug}.titel`}
                  as="h3"
                  className="block font-display text-2xl leading-tight group-hover:text-tourmaline"
                >
                  {w.titel}
                </T>
                <T id={`workshop.${w.slug}.hvornaar`} as="p" className="mt-2 block text-sm text-ash">
                  {w.hvornaar}
                </T>
                <T id={`workshop.${w.slug}.pris`} as="p" className="block text-sm text-ash">
                  {w.pris}
                </T>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Fra værkstedet</p>
            <T id="forside.instagram.overskrift" as="h2" className="mt-3 block font-display text-4xl">
              Følg med på Instagram
            </T>
            <T id="forside.instagram.tekst" as="p" className="mt-3 block max-w-xl text-ash">
              Her viser jeg smykkerne undervejs: det smeltede guld, smukke sten, skitser og de færdige smykker.
            </T>
          </div>
          <Link href="/blog" className="text-sm underline underline-offset-4 hover:text-tourmaline">
            Læs historier fra værkstedet
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {instagram.map((id) => (
            <li key={id} className="aspect-square overflow-hidden bg-pearl-deep">
              <a href={site.instagram} aria-label="Se værkstedet på Instagram">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={wix(id, 600)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </a>
            </li>
          ))}
        </ul>
        <a href={site.instagram} className={`mt-8 inline-block ${knapLys}`}>
          {site.instagramNavn} på Instagram
        </a>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
        <div className="bg-tourmaline px-8 py-14 text-pearl sm:px-14">
          <T id="forside.kontakt.overskrift" as="h2" className="block max-w-2xl font-display text-4xl leading-tight">
            Har du en idé til et smykke?
          </T>
          <T id="forside.kontakt.tekst" as="p" className="mt-4 block max-w-xl text-pearl/80">
            {`Ring på ${site.telefon} eller skriv til ${site.email}, så finder vi en tid på værkstedet eller online.`}
          </T>
          <Link
            href="/kontakt"
            className="mt-8 inline-block bg-pearl px-6 py-3 text-[0.95rem] tracking-wide text-ink hover:bg-gold-soft"
          >
            Kontakt Ossip
          </Link>
        </div>
      </section>
    </>
  );
}
