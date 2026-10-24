import type { Metadata } from "next";
import Link from "next/link";
import { SideTop, tekstLink } from "@/components/Dele";
import { byen, sommerfugle, udvalgte } from "@/lib/galleri";
import { wix } from "@/lib/wix";

export const metadata: Metadata = {
  title: "Gallerier",
  description:
    "Smykker Ossip Frolov har lavet på bestilling: vielsesringe, øreringe, vedhæng, brocher, skulptur og herresmykker.",
};

const serier = [
  { id: "sommerfugle", titel: "Sommerfugle", tekst: "Sommerfugle af 14K guld med ferskvandsperler.", billeder: sommerfugle },
  {
    id: "byen",
    titel: "Byen",
    tekst: "København med sin smukke arkitektur har været en stor inspiration: tårne, tage og den gamle by i sølv og guld.",
    billeder: byen,
  },
];

const spring = "block border border-ink/15 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-pearl";

export default function Galleri() {
  return (
    <>
      <SideTop lille="Gallerier" titel="Smykker lavet på bestilling">
        Et udvalg af smykker skabt sammen med dem der skal bære dem. Brug billederne som inspiration til dit eget
        smykke.
      </SideTop>
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
            damer, I er også velkomne til at blive inspireret, da det er op til enhver af os, hvad vi kan lide og
            ønsker at pynte os med!
          </p>
        </div>

        <section id="udvalgte-vaerker" className="mt-16 scroll-mt-28">
          <h2 className="font-display text-3xl">Udvalgte værker</h2>
          <div className="mt-8 columns-2 gap-5 md:columns-3 [&>img]:mb-5">
            {udvalgte.map((id) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={id} src={wix(id, 700)} alt="Smykke af Ossip Frolov" loading="lazy" className="w-full bg-pearl-deep" />
            ))}
          </div>
        </section>

        {serier.map((s) => (
          <section key={s.id} id={s.id} className="mt-20 scroll-mt-28">
            <h2 className="font-display text-3xl">{s.titel}</h2>
            <p className="mt-2 max-w-2xl text-ash">{s.tekst}</p>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {s.billeder.map((b) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={b.id}
                  src={wix(b.id, 600)}
                  alt={b.titel}
                  title={b.titel}
                  loading="lazy"
                  className="aspect-square w-full bg-pearl-deep object-cover"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
