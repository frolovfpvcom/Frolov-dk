import type { Metadata } from "next";
import { SideTop } from "@/components/Dele";
import { T } from "@/components/Tekst";
import { faq, pleje } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Det praktiske",
  description: "Bestilling, priser, genbrug af dit eget guld, betaling, returret og pleje af smykkerne.",
};

export default function DetPraktiske() {
  return (
    <>
      <SideTop lille="Det praktiske" titel="Sådan foregår det" />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        {faq.map((f, i) => (
          <details key={f.spoergsmaal} className="group border-t border-ink/15 py-6 last:border-b" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-display text-2xl [&::-webkit-details-marker]:hidden">
              <T id={`faq.${i + 1}.spoergsmaal`}>{f.spoergsmaal}</T>
              <span className="font-sans text-xl text-gold transition-transform group-open:rotate-45">+</span>
            </summary>
            <T id={`faq.${i + 1}.svar`} as="p" className="mt-4 block max-w-[65ch] text-lg leading-relaxed text-ash">
              {f.svar}
            </T>
          </details>
        ))}

        <section id="pleje" className="mt-20 scroll-mt-28">
          <T id="pleje.overskrift" as="h2" className="block font-display text-4xl">
            Pleje af dine smykker
          </T>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2">
            {pleje.map((p, i) => (
              <div key={p.titel}>
                <T id={`pleje.${i + 1}.titel`} as="dt" className="block font-display text-xl">
                  {p.titel}
                </T>
                <T id={`pleje.${i + 1}.tekst`} as="dd" className="mt-2 block leading-relaxed text-ash">
                  {p.tekst}
                </T>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
