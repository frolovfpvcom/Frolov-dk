import type { Metadata } from "next";
import Link from "next/link";
import { SideTop, SmykkeKort, tekstLink } from "@/components/Dele";
import { T } from "@/components/Tekst";
import { smykker, typer, type Type } from "@/lib/smykker";

export const metadata: Metadata = {
  title: "Smykker til salg",
  description: "Færdige unikke ringe og øreringe til salg fra Ossip Frolovs guldsmedeværksted i Brønshøj.",
};

const koeb = [
  { titel: "Spørg om smykket", tekst: "Ring, skriv en e-mail eller send en besked fra smykkets side." },
  {
    titel: "Se og prøv det",
    tekst: "Kom forbi værkstedet i Brønshøj efter aftale, så kan du se, mærke og prøve smykket.",
  },
  {
    titel: "Betal som det passer dig",
    tekst: "MobilePay, kort, kontant eller bankoverførsel. Der er 14 dages returret på færdige smykker.",
  },
];

export default async function Smykker({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const valgt = typer.some((t) => t.slug === type) ? (type as Type) : undefined;
  const vist = valgt ? smykker.filter((s) => s.type === valgt) : smykker;
  const filtre = [
    { href: "/smykker", label: "Alle", antal: smykker.length, aktiv: !valgt },
    ...typer.map((t) => ({
      href: `/smykker?type=${t.slug}`,
      label: t.label,
      antal: smykker.filter((s) => s.type === t.slug).length,
      aktiv: valgt === t.slug,
    })),
  ];

  return (
    <>
      <SideTop lille="Til salg" titel={<T id="side.smykker.titel">Færdige smykker</T>}>
        <T id="side.smykker.tekst">
          Her er smykker der er til salg på mit værksted. Alle er unikke, og alle kan ses, mærkes og prøves på
          værkstedet efter aftale. Smykker der er solgt, bliver stående her, så du kan se hvad jeg laver. Jeg laver
          gerne noget lignende til dig.
        </T>
      </SideTop>

      <section id="saadan-koeber-du" aria-label="Sådan køber du" className="scroll-mt-28 bg-pearl-deep">
        <ol className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
          {koeb.map((k, i) => (
            <li key={k.titel} className="flex gap-4">
              <span className="font-display text-4xl leading-none text-gold">{i + 1}</span>
              <div>
                <T id={`koeb.${i + 1}.titel`} as="h2" className="block font-display text-xl">
                  {k.titel}
                </T>
                <T id={`koeb.${i + 1}.tekst`} as="p" className="mt-1 block text-sm leading-relaxed text-ash">
                  {k.tekst}
                </T>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto max-w-6xl px-5 pt-12 sm:px-8">
        <nav aria-label="Vælg type">
          <ul className="flex flex-wrap gap-2">
            {filtre.map((f) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  aria-current={f.aktiv ? "page" : undefined}
                  className={`block border px-4 py-2 text-sm transition-colors ${
                    f.aktiv ? "border-ink bg-ink text-pearl" : "border-ink/15 hover:border-ink"
                  }`}
                >
                  {f.label} <span className={f.aktiv ? "text-pearl/60" : "text-ash"}>{f.antal}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-x-8 gap-y-14 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {vist.map((s) => (
          <SmykkeKort key={s.slug} smykke={s} />
        ))}
      </div>

      <p className="mx-auto mt-16 max-w-6xl px-5 text-ash sm:px-8">
        Kan du ikke finde det rette?{" "}
        <Link href="/kontakt" className={tekstLink}>
          Bestil dit eget smykke
        </Link>{" "}
        eller se{" "}
        <Link href="/vielsesringe" className={tekstLink}>
          vielsesringe
        </Link>
        .
      </p>
    </>
  );
}
