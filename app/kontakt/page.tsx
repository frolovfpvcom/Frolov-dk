import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SideTop } from "@/components/Dele";
import { T } from "@/components/Tekst";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Ring, skriv eller book et møde på værkstedet i Brønshøj eller online.",
};

function Punkt({ navn, children }: { navn: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.3em] text-gold">{navn}</dt>
      <dd className="mt-2 font-display text-3xl leading-snug">{children}</dd>
    </div>
  );
}

export default async function Kontakt({ searchParams }: { searchParams: Promise<{ smykke?: string }> }) {
  const { smykke } = await searchParams;
  return (
    <>
      <SideTop lille="Kontakt" titel={<T id="side.kontakt.titel">Lad os tale om dit smykke</T>}>
        <T id="side.kontakt.tekst">
          Du kan besøge værkstedet efter aftale eller holde et online møde. Ring, skriv, eller send en besked
          herunder, så vender jeg tilbage hurtigst muligt.
        </T>
      </SideTop>
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 md:grid-cols-2">
        <dl className="space-y-8">
          <Punkt navn="Telefon">
            <a href={site.telefonLink} className="hover:text-tourmaline">
              {site.telefon}
            </a>
          </Punkt>
          <Punkt navn="E-mail">
            <a href={`mailto:${site.email}`} className="hover:text-tourmaline">
              {site.email}
            </a>
          </Punkt>
          <Punkt navn="Værksted">
            <span>
              Fuglebakkevej, Brønshøj
              <br />
              København · efter aftale
            </span>
          </Punkt>
          <Punkt navn="Følg med">
            <span>
              <a href={site.instagram} className="hover:text-tourmaline">
                Instagram
              </a>{" "}
              ·{" "}
              <a href={site.facebook} className="hover:text-tourmaline">
                Facebook
              </a>
            </span>
          </Punkt>
        </dl>
        <ContactForm email={site.email} piece={smykke} />
      </div>
    </>
  );
}
