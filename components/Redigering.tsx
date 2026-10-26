"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fjernElement, flytElement, nytSmykke, tilfoejBillede } from "@/app/rediger/actions";
import { formindsk } from "./formindsk";

// Små værktøjer til lister på siden. De vises kun, når Ossip er logget ind (data-only-editing).

type Svar = { ok: true } | { ok: false; error: string };

const lilleKnap =
  "flex h-8 min-w-8 items-center justify-center bg-oxide/90 px-2 text-sm text-pearl hover:bg-oxide disabled:opacity-50";
export const tilfoejKnap =
  "border border-dashed border-gold px-4 py-2 text-sm text-gold hover:bg-gold hover:text-pearl disabled:opacity-50";

function vis(svar: Svar) {
  if (!svar.ok) window.alert(svar.error);
}

// Flyt frem, flyt tilbage og fjern. Lægges i hjørnet af et billede, et smykke eller en blok.
export function ElementKnapper({
  liste,
  id,
  foerste,
  sidste,
  hvad,
  lodret = false,
  className = "absolute top-2 right-2 z-10",
}: {
  liste: string;
  id: string;
  foerste: boolean;
  sidste: boolean;
  hvad: string;
  lodret?: boolean;
  className?: string;
}) {
  const [venter, start] = useTransition();
  const kør = (handling: () => Promise<Svar>) => start(async () => vis(await handling()));
  return (
    <div data-only-editing="" className={`${className} flex gap-px shadow-lg`}>
      <button
        type="button"
        title={`Flyt ${hvad} ${lodret ? "op" : "til venstre"}`}
        aria-label={`Flyt ${hvad} ${lodret ? "op" : "til venstre"}`}
        disabled={venter || foerste}
        onClick={() => kør(() => flytElement(liste, id, -1))}
        className={lilleKnap}
      >
        {lodret ? "↑" : "←"}
      </button>
      <button
        type="button"
        title={`Flyt ${hvad} ${lodret ? "ned" : "til højre"}`}
        aria-label={`Flyt ${hvad} ${lodret ? "ned" : "til højre"}`}
        disabled={venter || sidste}
        onClick={() => kør(() => flytElement(liste, id, 1))}
        className={lilleKnap}
      >
        {lodret ? "↓" : "→"}
      </button>
      <button
        type="button"
        title={`Fjern ${hvad}`}
        aria-label={`Fjern ${hvad}`}
        disabled={venter}
        onClick={() => {
          if (window.confirm(`Vil du fjerne ${hvad}?`)) kør(() => fjernElement(liste, id));
        }}
        className={`${lilleKnap} hover:bg-red-900`}
      >
        ✕
      </button>
    </div>
  );
}

// Vælg et eller flere billeder fra computeren eller telefonen. De uploades ét ad gangen.
export function TilfoejBilleder({ liste, tekst = "Tilføj billeder" }: { liste: string; tekst?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [venter, start] = useTransition();

  return (
    <div data-only-editing="" className="flex flex-wrap items-center gap-3">
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const filer = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (!filer.length) return;
          start(async () => {
            for (const [n, fil] of filer.entries()) {
              setStatus(filer.length > 1 ? `Uploader ${n + 1} af ${filer.length}…` : "Uploader…");
              const form = new FormData();
              form.set("billede", await formindsk(fil));
              const svar = await tilfoejBillede(liste, form);
              if (!svar.ok) {
                setStatus(svar.error);
                return;
              }
            }
            setStatus(filer.length > 1 ? `${filer.length} billeder er tilføjet.` : "Billedet er tilføjet.");
          });
        }}
      />
      <button type="button" onClick={() => ref.current?.click()} disabled={venter} className={tilfoejKnap}>
        + {tekst}
      </button>
      {status ? (
        <span role="status" className="text-sm text-ash">
          {status}
        </span>
      ) : null}
    </div>
  );
}

// En knap der kører én handling, fx "tilføj tekst" eller "ny serie".
export function HandlingsKnap({ handling, children }: { handling: () => Promise<Svar>; children: string }) {
  const [venter, start] = useTransition();
  return (
    <button
      type="button"
      data-only-editing=""
      disabled={venter}
      onClick={() => start(async () => vis(await handling()))}
      className={tilfoejKnap}
    >
      + {children}
    </button>
  );
}

export function NytSmykke({ typer }: { typer: { slug: string; label: string }[] }) {
  const router = useRouter();
  const [aaben, setAaben] = useState(false);
  const [fejl, setFejl] = useState<string | null>(null);
  const [venter, start] = useTransition();

  if (!aaben) {
    return (
      <button type="button" data-only-editing="" onClick={() => setAaben(true)} className={tilfoejKnap}>
        + Nyt smykke til salg
      </button>
    );
  }

  return (
    <form
      data-only-editing=""
      className="flex flex-wrap items-end gap-3 border border-dashed border-gold p-4"
      action={(form) =>
        start(async () => {
          const svar = await nytSmykke(String(form.get("titel") ?? ""), String(form.get("type") ?? ""));
          if (svar.ok) router.push(svar.href);
          else setFejl(svar.error);
        })
      }
    >
      <label className="flex flex-col text-xs uppercase tracking-[0.2em] text-ash">
        Navn
        <input
          name="titel"
          required
          autoFocus
          className="mt-1 border border-ink/20 bg-pearl px-3 py-2 text-base normal-case tracking-normal text-ink"
        />
      </label>
      <label className="flex flex-col text-xs uppercase tracking-[0.2em] text-ash">
        Type
        <select
          name="type"
          className="mt-1 border border-ink/20 bg-pearl px-3 py-2 text-base normal-case tracking-normal text-ink"
        >
          {typer.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <button disabled={venter} className="bg-ink px-4 py-2 text-sm text-pearl hover:bg-tourmaline disabled:opacity-50">
        {venter ? "Opretter…" : "Opret"}
      </button>
      <button type="button" onClick={() => setAaben(false)} className="px-2 py-2 text-sm text-ash hover:text-ink">
        Annuller
      </button>
      {fejl ? (
        <p role="alert" className="w-full text-sm text-red-800">
          {fejl}
        </p>
      ) : null}
    </form>
  );
}
