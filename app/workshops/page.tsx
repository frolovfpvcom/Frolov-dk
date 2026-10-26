import type { Metadata } from "next";
import Link from "next/link";
import { knapLys, knapMoerk, SideTop } from "@/components/Dele";
import { Billede, T } from "@/components/Tekst";
import { kontaktLink, site } from "@/lib/site";
import { workshops } from "@/lib/workshops";
import { Fri } from "@/components/Blokke";

export const metadata: Metadata = {
  title: "Workshops",
  description: "Smykkeworkshop for to og meditation med te søndag formiddag på Ossip Frolovs værksted.",
};

export default function Workshops() {
  return (
    <>
      <SideTop lille="På værkstedet" titel={<T id="side.workshops.titel">Workshops og stille stunder</T>}>
        <T id="side.workshops.tekst">
          {`Værkstedet er også et sted, hvor man kan lave noget sammen. Ring på ${site.telefon} for at høre mere eller melde dig til.`}
        </T>
      </SideTop>
      <Fri sted="workshops-top" />
      <div className="mx-auto grid max-w-6xl gap-16 px-5 sm:px-8">
        {workshops.map((w, i) => (
          <article key={w.slug} id={w.slug} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-2">
            <Billede
              id={`workshop.${w.slug}.billede`}
              wixId={w.billede}
              str={1000}
              alt={w.titel}
              lazy={i > 0}
              className={`aspect-[4/3] w-full bg-pearl-deep object-cover${i % 2 ? " md:order-2" : ""}`}
            />
            <div>
              <T id={`workshop.${w.slug}.titel`} as="h2" className="block font-display text-4xl leading-tight">
                {w.titel}
              </T>
              <T id={`workshop.${w.slug}.tekst`} as="p" className="mt-4 block text-lg leading-relaxed text-ash">
                {w.tekst}
              </T>
              <dl className="mt-6 space-y-2 border-t border-ink/15 pt-5 text-sm">
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-ash">Hvornår</dt>
                  <T id={`workshop.${w.slug}.hvornaar`} as="dd">
                    {w.hvornaar}
                  </T>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-ash">Pris</dt>
                  <T id={`workshop.${w.slug}.pris`} as="dd">
                    {w.pris}
                  </T>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={site.telefonLink} className={knapMoerk}>
                  Ring {site.telefon}
                </a>
                <Link href={kontaktLink(w.titel)} className={knapLys}>
                  Skriv til mig
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Fri sted="workshops-bund" className="mx-auto max-w-6xl px-5 pt-16 sm:px-8" />
    </>
  );
}
