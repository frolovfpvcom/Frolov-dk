import type { Metadata } from "next";
import { SideTop } from "@/components/Dele";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privatliv og cookies",
  description: "Hvilke oplysninger frolov.dk gemmer, og hvilke cookies siden bruger.",
};

export default function Privatliv() {
  return (
    <>
      <SideTop lille="Privatliv" titel="Privatliv og cookies" />
      <div className="mx-auto max-w-3xl space-y-8 px-5 text-lg leading-relaxed text-ash sm:px-8">
        <section>
          <h2 className="font-display text-2xl text-ink">Ingen sporing</h2>
          <p className="mt-2">
            Siden bruger ingen cookies til statistik, annoncer eller sporing, og der er ingen cookie-banner, fordi der
            ikke er noget at sige ja til.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Når du skriver</h2>
          <p className="mt-2">
            Kontaktformularen åbner dit eget mailprogram med beskeden klar. Siden gemmer ikke det, du skriver. Din
            e-mail går direkte til {site.email}.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">De eneste cookies</h2>
          <p className="mt-2">
            Når {site.navn} er logget ind for at rette i siden, bruges cookies til at huske, at han er logget ind. De
            sættes kun for ham.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Hosting</h2>
          <p className="mt-2">
            Siden ligger hos Vercel, som kan registrere tekniske oplysninger som IP-adresse, når siden vises, for at
            kunne levere og beskytte den.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Spørgsmål</h2>
          <p className="mt-2">
            Skriv til{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
              {site.email}
            </a>{" "}
            eller ring på {site.telefon}.
          </p>
        </section>
      </div>
    </>
  );
}
