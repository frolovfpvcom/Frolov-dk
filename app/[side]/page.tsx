import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tilfoejBlok } from "@/app/rediger/actions";
import { SideTop } from "@/components/Dele";
import { ElementKnapper, HandlingsKnap, TilfoejBilleder } from "@/components/Redigering";
import { T, tekst } from "@/components/Tekst";
import type { Element } from "@/lib/indhold";
import { billedSrc, findSide, hentListe } from "@/lib/lister";

// Sider Ossip selv opretter under "Sider og menu". De bygges, første gang nogen besøger dem.
type Props = { params: Promise<{ side: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { side } = await params;
  const punkt = await findSide(side);
  if (!punkt) return {};
  return {
    title: await tekst(`side.${side}.titel`, punkt.label),
    robots: punkt.skjult ? { index: false } : undefined,
  };
}

// Billeder der står lige efter hinanden, vises sammen i et gitter.
function grupper(blokke: Element[]) {
  const grupper: Element[][] = [];
  for (const b of blokke) {
    const sidste = grupper.at(-1);
    if (b.slags === "billede" && sidste?.[0].slags === "billede") sidste.push(b);
    else grupper.push([b]);
  }
  return grupper;
}

export default async function EgenSide({ params }: Props) {
  const { side } = await params;
  const punkt = await findSide(side);
  if (!punkt) notFound();
  const liste = `side.${side}.blokke`;
  const blokke = await hentListe(liste);
  const knapper = (b: Element) => (
    <ElementKnapper
      liste={liste}
      id={b.id}
      foerste={b === blokke[0]}
      sidste={b === blokke.at(-1)}
      lodret
      hvad={b.slags === "billede" ? "billedet" : b.slags === "overskrift" ? "overskriften" : "teksten"}
    />
  );

  return (
    <>
      <SideTop lille="Fra værkstedet" titel={<T id={`side.${side}.titel`}>{punkt.label}</T>}>
        <T id={`side.${side}.intro`} placeholder="Skriv en kort indledning (eller lad den stå tom)" />
      </SideTop>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-3xl space-y-8">
          {grupper(blokke).map((gruppe) =>
            gruppe[0].slags === "billede" ? (
              <div key={gruppe[0].id} className={gruppe.length > 1 ? "grid grid-cols-2 gap-4" : ""}>
                {gruppe.map((b) => (
                  <div key={b.id} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={billedSrc(b, 1400)} alt={b.titel ?? ""} loading="lazy" className="w-full bg-pearl-deep" />
                    {knapper(b)}
                  </div>
                ))}
              </div>
            ) : (
              <div key={gruppe[0].id} className="relative">
                {gruppe[0].slags === "overskrift" ? (
                  <T
                    id={`side.${side}.${gruppe[0].id}`}
                    as="h2"
                    className="block [html[data-editing]_&]:pr-28 font-display text-3xl"
                    placeholder="Skriv en overskrift"
                  />
                ) : (
                  <T
                    id={`side.${side}.${gruppe[0].id}`}
                    as="p"
                    className="block [html[data-editing]_&]:pr-28 text-lg leading-relaxed whitespace-pre-line text-ash"
                    placeholder="Dobbeltklik og skriv din tekst"
                  />
                )}
                {knapper(gruppe[0])}
              </div>
            ),
          )}
          <div data-only-editing="" className="flex flex-wrap gap-3 border-t border-ink/10 pt-8">
            <HandlingsKnap handling={tilfoejBlok.bind(null, side, "overskrift")}>Overskrift</HandlingsKnap>
            <HandlingsKnap handling={tilfoejBlok.bind(null, side, "tekst")}>Tekst</HandlingsKnap>
            <TilfoejBilleder liste={liste} />
          </div>
        </div>
      </div>
    </>
  );
}
