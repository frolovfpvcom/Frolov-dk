import type { Metadata } from "next";
import Link from "next/link";
import { Aftale, knapLys, knapMoerk, Priser, SideTop, tekstLink, trin } from "@/components/Dele";
import { Billede, T } from "@/components/Tekst";
import { faq } from "@/lib/faq";
import { bestillingBillede } from "@/lib/kunstneren";
import { kontaktLink } from "@/lib/site";
import { Fri } from "@/components/Blokke";

export const metadata: Metadata = {
  title: "Vielsesringe",
  description:
    "Vielsesringe lavet i hånden sammen med jer på værkstedet. Jeres eget guld kan smeltes om og bruges i ringene.",
};

export default function Vielsesringe() {
  return (
    <>
      <SideTop lille="Vielsesringe" titel={<T id="side.vielsesringe.titel">Jeres ringe, lavet sammen med jer</T>}>
        <T id="side.vielsesringe.tekst">
          Alle vielsesringe bliver lavet i samarbejde med dem der skal bære dem. Vi mødes på værkstedet eller online
          og finder frem til ringe, der passer til jer og jeres liv.
        </T>
      </SideTop>
      <Fri sted="vielsesringe-top" />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 md:grid-cols-[1fr_1.2fr]">
        <Billede
          id="vielsesringe.billede"
          wixId={bestillingBillede}
          str={900}
          alt="Smykker på bestilling"
          className="aspect-[4/5] w-full bg-pearl-deep object-cover"
        />
        <div className="self-center">
          <ol className="space-y-8">
            {trin.map((t, i) => (
              <li key={t.titel} className="flex gap-5">
                <span className="font-display text-5xl leading-none text-gold">{i + 1}</span>
                <div>
                  <T id={`forside.trin.${i + 1}.titel`} as="h2" className="block font-display text-2xl">
                    {t.titel}
                  </T>
                  <T id={`forside.trin.${i + 1}.tekst`} as="p" className="mt-1 block leading-relaxed text-ash">
                    {t.tekst}
                  </T>
                </div>
              </li>
            ))}
          </ol>
          <Priser className="mt-10 border-t border-ink/15 pt-8" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={kontaktLink("Vielsesringe")} className={knapMoerk}>
              Book et møde
            </Link>
            <Link href="/galleri" className={knapLys}>
              Se smykker jeg har lavet
            </Link>
          </div>
          <Aftale />
        </div>
      </div>

      <section className="mx-auto mt-24 max-w-3xl px-5 sm:px-8">
        <h2 className="font-display text-3xl">Jeres eget guld</h2>
        <p className="mt-4 text-lg leading-relaxed text-ash">
          <T id="faq.4.svar">{faq[3].svar}</T> <T id="faq.5.svar">{faq[4].svar}</T>
        </p>
        <p className="mt-4 text-lg leading-relaxed text-ash">
          Gamle vielsesringe kan også blive til noget nyt, uden at indskriften går tabt.{" "}
          <Link href="/blog/kaerlig-vind-i-sejlene" className={tekstLink}>
            Læs historien om to søstre og deres forældres ringe
          </Link>
          .
        </p>
      </section>
      <Fri sted="vielsesringe-bund" className="mx-auto max-w-6xl px-5 pt-16 sm:px-8" />
    </>
  );
}
