import type { Metadata } from "next";
import { SideTop } from "@/components/Dele";
import { Billede, T } from "@/components/Tekst";
import { bestillingBillede, kunstnerAfsnit, kunstnerOverskrift, portraet } from "@/lib/kunstneren";
import { Fri } from "@/components/Blokke";

export const metadata: Metadata = {
  title: "Kunstneren",
  description:
    "Guldsmed Ossip Frolov har lavet smykker siden han var teenager, inspireret af naturen og Københavns arkitektur.",
};

export default function Kunstneren() {
  return (
    <>
      <SideTop lille="Kunstneren" titel={<T id="kunstneren.overskrift">{kunstnerOverskrift}</T>} />
      <Fri sted="kunstneren-top" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <Billede
            id="kunstneren.billede.1"
            wixId={portraet}
            str={900}
            alt="Ossip Frolov på værkstedet"
            className="aspect-square w-full bg-pearl-deep object-cover"
          />
          <Billede
            id="kunstneren.billede.2"
            wixId={bestillingBillede}
            str={900}
            alt="Smykker på bestilling"
            className="aspect-[4/5] w-full bg-pearl-deep object-cover"
          />
        </div>
        <div className="max-w-[65ch] space-y-5 text-lg leading-relaxed">
          {kunstnerAfsnit.map((a, i) => (
            <T
              key={i}
              id={`kunstneren.afsnit.${i + 1}`}
              as="p"
              className={i === 0 ? "block font-display text-2xl leading-snug" : "block text-ash"}
            >
              {a}
            </T>
          ))}
          <p className="font-display text-2xl italic text-gold">Ossip</p>
        </div>
      </div>
      <Fri sted="kunstneren-bund" className="mx-auto max-w-6xl px-5 pt-16 sm:px-8" />
    </>
  );
}
