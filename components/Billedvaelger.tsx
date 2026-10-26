"use client";

import { useState } from "react";

type Billede = { src: string; lille: string; alt: string };

// Et stort billede med små billeder under, som man kan klikke på for at skifte.
// Det første billede kan Ossip dobbeltklikke på og skifte ud (foersteAttr).
export function Billedvaelger({
  billeder,
  foersteAttr,
}: {
  billeder: Billede[];
  foersteAttr?: Record<string, string | undefined>;
}) {
  const [valgt, setValgt] = useState(0);
  const nr = Math.min(valgt, billeder.length - 1);
  const vist = billeder[nr];
  if (!vist) return null;
  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-pearl-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={vist.src}
          {...(nr === 0 ? foersteAttr : {})}
          src={vist.src}
          alt={vist.alt}
          className="h-full w-full animate-[fade_400ms_ease] object-cover"
        />
        {billeder.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Forrige billede"
              onClick={() => setValgt((nr - 1 + billeder.length) % billeder.length)}
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-pearl/80 text-ink hover:bg-pearl"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Næste billede"
              onClick={() => setValgt((nr + 1) % billeder.length)}
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-pearl/80 text-ink hover:bg-pearl"
            >
              →
            </button>
          </>
        ) : null}
      </div>
      {billeder.length > 1 ? (
        <ul className="mt-3 grid grid-cols-5 gap-3">
          {billeder.map((b, i) => (
            <li key={b.src}>
              <button
                type="button"
                aria-label={`Vis billede ${i + 1}`}
                aria-current={i === nr ? "true" : undefined}
                onClick={() => setValgt(i)}
                className={`block w-full overflow-hidden outline-offset-2 ${
                  i === nr ? "outline-2 outline-gold" : "opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.lille} alt="" className="aspect-square w-full bg-pearl-deep object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
