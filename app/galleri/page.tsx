import type { Metadata } from "next";
import Link from "next/link";
import { nySerie } from "@/app/rediger/actions";
import { SideTop, tekstLink } from "@/components/Dele";
import { ElementKnapper, HandlingsKnap, TilfoejBilleder } from "@/components/Redigering";
import { T, tekst } from "@/components/Tekst";
import { serier as faste } from "@/lib/galleri";
import { billedSrc, flytbar, hentListe, skiftbart, slipBilleder } from "@/lib/lister";
import { Fri } from "@/components/Blokke";

export const metadata: Metadata = {
  title: "Gallerier",
  description:
    "Smykker Ossip Frolov har lavet på bestilling: vielsesringe, øreringe, vedhæng, brocher, skulptur og herresmykker.",
};

const spring =
  "block border border-ink/15 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-pearl";

export default async function Galleri() {
  const udvalgte = await hentListe("galleri.udvalgte");
  const serier = await Promise.all(
    (await hentListe("galleri.serier")).map(async (e, i, alle) => {
      const fast = faste.find((f) => f.id === e.id);
      return {
        id: e.id,
        titel: await tekst(`galleri.${e.id}.titel`, fast?.titel ?? e.titel ?? "Ny serie"),
        tekst: fast?.tekst ?? "",
        billeder: await hentListe(`galleri.${e.id}.billeder`),
        foerste: i === 0,
        sidste: i === alle.length - 1,
      };
    }),
  );

  return (
    <>
      <SideTop lille="Gallerier" titel="Smykker lavet på bestilling">
        Et udvalg af smykker skabt sammen med dem der skal bære dem. Brug billederne som inspiration til dit eget
        smykke.
      </SideTop>
      <Fri sted="galleri-top" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <nav aria-label="Spring til">
          <ul className="flex flex-wrap gap-2">
            <li>
              <a href="#udvalgte-vaerker" className={spring}>
                Udvalgte værker
              </a>
            </li>
            {serier.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={spring}>
                  {s.titel}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/smykker"
                className="block border border-gold px-4 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-pearl"
              >
                Smykker til salg
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <p className="leading-relaxed text-ash">
            <strong className="font-display text-lg text-ink">Vielsesringe.</strong> Alle vielsesringe bliver lavet i
            samarbejde med dem der skal bære dem.{" "}
            <Link href="/vielsesringe" className={tekstLink}>
              Sådan foregår det
            </Link>
          </p>
          <p className="leading-relaxed text-ash">
            <strong className="font-display text-lg text-ink">For mænd.</strong> Smykker tænkt som herresmykker. Kære
            damer, I er også velkomne til at blive inspireret, da det er op til enhver af os, hvad vi kan lide og ønsker
            at pynte os med!
          </p>
        </div>

        <section id="udvalgte-vaerker" className="mt-16 scroll-mt-28" {...slipBilleder("galleri.udvalgte")}>
          <h2 className="font-display text-3xl">Udvalgte værker</h2>
          <div className="mt-8 columns-2 gap-5 md:columns-3">
            {udvalgte.map((b, i) => (
              <div key={b.id} className="relative mb-5 break-inside-avoid" {...flytbar("galleri.udvalgte", b.id)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...skiftbart("galleri.udvalgte", b)}
                  src={billedSrc(b, 700)}
                  alt={b.titel ?? "Smykke af Ossip Frolov"}
                  loading="lazy"
                  className="w-full bg-pearl-deep"
                />
                <ElementKnapper
                  liste="galleri.udvalgte"
                  id={b.id}
                  foerste={i === 0}
                  sidste={i === udvalgte.length - 1}
                  hvad="billedet"
                />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <TilfoejBilleder liste="galleri.udvalgte" />
          </div>
        </section>

        {serier.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="relative mt-20 scroll-mt-28"
            {...flytbar("galleri.serier", s.id, true)}
            {...slipBilleder(`galleri.${s.id}.billeder`)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <T id={`galleri.${s.id}.titel`} as="h2" className="block font-display text-3xl">
                {s.titel}
              </T>
              <ElementKnapper
                liste="galleri.serier"
                id={s.id}
                foerste={s.foerste}
                sidste={s.sidste}
                lodret
                hvad="hele serien"
                className=""
              />
            </div>
            <T
              id={`galleri.${s.id}.tekst`}
              as="p"
              className="mt-2 block max-w-2xl text-ash"
              placeholder="Skriv en kort tekst om serien"
            >
              {s.tekst}
            </T>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {s.billeder.map((b, i) => (
                <div key={b.id} className="relative" {...flytbar(`galleri.${s.id}.billeder`, b.id)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...skiftbart(`galleri.${s.id}.billeder`, b)}
                    src={billedSrc(b, 600)}
                    alt={b.titel ?? s.titel}
                    title={b.titel}
                    loading="lazy"
                    className="aspect-square w-full bg-pearl-deep object-cover"
                  />
                  <ElementKnapper
                    liste={`galleri.${s.id}.billeder`}
                    id={b.id}
                    foerste={i === 0}
                    sidste={i === s.billeder.length - 1}
                    hvad="billedet"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <TilfoejBilleder liste={`galleri.${s.id}.billeder`} />
            </div>
          </section>
        ))}

        <div data-only-editing="" className="mt-20 border-t border-ink/10 pt-8">
          <HandlingsKnap handling={nySerie}>Ny serie</HandlingsKnap>
        </div>
      </div>
      <Fri sted="galleri-bund" className="mx-auto max-w-6xl px-5 pt-16 sm:px-8" />
    </>
  );
}
