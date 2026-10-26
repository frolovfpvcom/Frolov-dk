import { tilfoejBlok } from "@/app/rediger/actions";
import { ElementKnapper, HandlingsKnap, TilfoejBilleder } from "./Redigering";
import { T } from "./Tekst";
import type { Element } from "@/lib/indhold";
import { billedSrc, flytbar, hentListe, skiftbart, slipBilleder } from "@/lib/lister";

// Overskrifter, tekst og billeder i den rækkefølge Ossip har sat dem.
// Bruges på hans egne sider og i de felter han kan fylde ud på de faste sider (<Fri>).

// Billeder der står lige efter hinanden, vises som en række.
function grupper(blokke: Element[]) {
  const grupper: Element[][] = [];
  for (const b of blokke) {
    const sidste = grupper.at(-1);
    if (b.slags === "billede" && sidste?.[0].slags === "billede") sidste.push(b);
    else grupper.push([b]);
  }
  return grupper;
}

const kolonner = ["", "", "grid-cols-2", "grid-cols-2 sm:grid-cols-3", "grid-cols-2 md:grid-cols-4"];

export async function Blokke({ liste, tekstId }: { liste: string; tekstId: (id: string) => string }) {
  const blokke = await hentListe(liste);
  const knapper = (b: Element) => (
    <ElementKnapper
      liste={liste}
      id={b.id}
      foerste={b === blokke[0]}
      sidste={b === blokke.at(-1)}
      lodret={b.slags !== "billede"}
      hvad={b.slags === "billede" ? "billedet" : b.slags === "overskrift" ? "overskriften" : "teksten"}
    />
  );

  return (
    <div className="space-y-8" {...slipBilleder(liste)}>
      {grupper(blokke).map((gruppe) =>
        gruppe[0].slags === "billede" ? (
          <div
            key={gruppe[0].id}
            className={gruppe.length > 1 ? `grid gap-4 ${kolonner[Math.min(gruppe.length, 4)]}` : ""}
          >
            {gruppe.map((b) => (
              <div key={b.id} className="relative" {...flytbar(liste, b.id)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...skiftbart(liste, b)}
                  src={billedSrc(b, gruppe.length > 2 ? 900 : 1400)}
                  alt={b.titel ?? ""}
                  loading="lazy"
                  className={`w-full bg-pearl-deep object-cover ${gruppe.length > 1 ? "aspect-square" : "aspect-[3/2]"}`}
                />
                {knapper(b)}
              </div>
            ))}
          </div>
        ) : (
          <div key={gruppe[0].id} className="relative max-w-3xl" {...flytbar(liste, gruppe[0].id, true)}>
            {gruppe[0].slags === "overskrift" ? (
              <T
                id={tekstId(gruppe[0].id)}
                as="h2"
                className="block font-display text-3xl [html[data-editing]_&]:pr-28"
                placeholder="Skriv en overskrift"
              />
            ) : (
              <T
                id={tekstId(gruppe[0].id)}
                as="p"
                className="block text-lg leading-relaxed whitespace-pre-line text-ash [html[data-editing]_&]:pr-28"
                placeholder="Dobbeltklik og skriv din tekst"
              />
            )}
            {knapper(gruppe[0])}
          </div>
        ),
      )}
      <div
        data-only-editing=""
        className={`flex flex-wrap items-center gap-3 ${
          blokke.length ? "border-t border-dashed border-gold/50 pt-4" : "border border-dashed border-gold/60 p-6"
        }`}
      >
        {blokke.length ? null : (
          <p className="w-full text-sm text-ash">
            Træk billeder hertil fra computeren for at lave en række billeder, eller tilføj tekst.
          </p>
        )}
        <TilfoejBilleder liste={liste} />
        <HandlingsKnap handling={tilfoejBlok.bind(null, liste, "overskrift")}>Overskrift</HandlingsKnap>
        <HandlingsKnap handling={tilfoejBlok.bind(null, liste, "tekst")}>Tekst</HandlingsKnap>
      </div>
    </div>
  );
}

// Et felt på en fast side, hvor Ossip selv kan sætte billeder og tekst ind.
// Tomt er det usynligt for besøgende.
export async function Fri({
  sted,
  className = "mx-auto max-w-6xl px-5 pb-12 sm:px-8",
}: {
  sted: string;
  className?: string;
}) {
  const tomt = (await hentListe(`fri.${sted}`)).length === 0;
  return (
    <div className={className} data-only-editing={tomt ? "" : undefined}>
      <Blokke liste={`fri.${sted}`} tekstId={(id) => `fri.${sted}.${id}`} />
    </div>
  );
}
