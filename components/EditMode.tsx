"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  erstatBillede,
  gendanBillede,
  logout,
  resetField,
  saveImage,
  saveText,
} from "@/app/rediger/actions";
import type { MenuPunkt } from "@/lib/lister";
import { formindsk } from "./formindsk";
import { MenuPanel } from "./MenuPanel";
import { useTraek } from "./Traek";

type Maal =
  | { kind: "text"; id: string; el: HTMLElement; raw: string; edited: boolean }
  | { kind: "image"; id: string; liste?: string; el: HTMLElement; edited: boolean };

// Feltet lægges præcis oven på teksten, med samme skrift og farver.
const KOPIER = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "textAlign",
  "color",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
] as const;

const knap = "px-3 py-1.5 hover:bg-pearl/10 disabled:opacity-50";

const ingenAbonnement = () => () => {};

export function EditMode({ menu }: { menu: MenuPunkt[] }) {
  usePathname();
  const aktiv = useSyncExternalStore(
    ingenAbonnement,
    () => document.cookie.split("; ").includes("frolov_rediger_ui=1"),
    () => false,
  );
  const [maal, setMaal] = useState<Maal | null>(null);
  const [besked, setBesked] = useState<string | null>(null);
  const [panel, setPanel] = useState(false);
  useTraek(aktiv, setBesked);

  useEffect(() => {
    if (!aktiv) return;
    document.documentElement.dataset.editing = "";
    return () => {
      delete document.documentElement.dataset.editing;
    };
  }, [aktiv]);

  useEffect(() => {
    if (!aktiv) return;
    const find = (e: Event) =>
      (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-edit],[data-edit-img]") ?? null;
    // Et klik på en tekst inde i et link skal ikke følge linket.
    const klik = (e: MouseEvent) => {
      if (find(e)?.closest("a")) e.preventDefault();
    };
    const dobbeltklik = (e: MouseEvent) => {
      const el = find(e);
      if (!el) return;
      e.preventDefault();
      window.getSelection()?.removeAllRanges();
      const edited = el.dataset.edited !== undefined;
      if (el.dataset.editImg)
        setMaal({ kind: "image", id: el.dataset.editImg, liste: el.dataset.editListe, el, edited });
      else setMaal({ kind: "text", id: el.dataset.edit!, el, raw: el.dataset.raw ?? el.innerText, edited });
      setBesked(null);
    };
    document.addEventListener("click", klik, true);
    document.addEventListener("dblclick", dobbeltklik, true);
    return () => {
      document.removeEventListener("click", klik, true);
      document.removeEventListener("dblclick", dobbeltklik, true);
    };
  }, [aktiv]);

  const faerdig = useCallback((tekst?: string) => {
    setMaal(null);
    setBesked(tekst ?? null);
  }, []);

  if (!aktiv) return null;

  return (
    <>
      {maal?.kind === "text" ? <TekstFelt key={maal.id} maal={maal} onDone={faerdig} /> : null}
      {maal?.kind === "image" ? <BilledValg key={maal.id} maal={maal} onDone={faerdig} /> : null}
      {panel ? <MenuPanel menu={menu} onClose={() => setPanel(false)} /> : null}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/40 bg-oxide/95 text-pearl backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 text-sm sm:px-8">
          <p className="font-medium text-gold-soft">Redigering</p>
          <p className="flex-1 text-pearl/80" role="status">
            {besked ??
              "Dobbeltklik på en tekst eller et billede for at ændre det. Træk billeder og smykker for at flytte dem."}
          </p>
          <button
            type="button"
            onClick={() => setPanel((p) => !p)}
            aria-expanded={panel}
            className="border border-gold-soft/60 px-3 py-1.5 text-gold-soft hover:bg-gold-soft hover:text-oxide"
          >
            Sider og menu
          </button>
          <form
            action={async () => {
              await logout();
              window.location.reload();
            }}
          >
            <button className="underline underline-offset-4 hover:text-gold-soft">Log ud</button>
          </form>
        </div>
      </div>
    </>
  );
}

function usePlacering(el: HTMLElement) {
  const [rect, setRect] = useState(() => el.getBoundingClientRect());
  useLayoutEffect(() => {
    const opdater = () => setRect(el.getBoundingClientRect());
    opdater();
    window.addEventListener("resize", opdater);
    window.addEventListener("scroll", opdater, true);
    return () => {
      window.removeEventListener("resize", opdater);
      window.removeEventListener("scroll", opdater, true);
    };
  }, [el]);
  return rect;
}

function Vaerktoejslinje({ top, left, children }: { top: number; left: number; children: ReactNode }) {
  return (
    <div
      className="fixed z-50 flex flex-wrap items-center gap-2 bg-oxide p-2 text-sm text-pearl shadow-xl"
      style={{ top, left: Math.max(8, Math.min(left, window.innerWidth - 340)) }}
    >
      {children}
    </div>
  );
}

function baggrund(el: HTMLElement) {
  for (let e: HTMLElement | null = el; e; e = e.parentElement) {
    const farve = getComputedStyle(e).backgroundColor;
    if (farve && farve !== "transparent" && !farve.endsWith(", 0)")) return farve;
  }
  return "var(--color-pearl)";
}

function TekstFelt({
  maal,
  onDone,
}: {
  maal: Extract<Maal, { kind: "text" }>;
  onDone: (besked?: string) => void;
}) {
  const { el, id } = maal;
  const rect = usePlacering(el);
  const ref = useRef<HTMLTextAreaElement>(null);
  const [vaerdi, setVaerdi] = useState(maal.raw);
  const [fejl, setFejl] = useState<string | null>(null);
  const [gemmer, start] = useTransition();

  function gem() {
    if (vaerdi.trim() === maal.raw.trim()) return onDone();
    start(async () => {
      const svar = await saveText(id, vaerdi);
      if (svar.ok) onDone("Gemt. Ændringen er nu på siden.");
      else setFejl(svar.error);
    });
  }

  function gendan() {
    start(async () => {
      const svar = await resetField(id);
      if (svar.ok) onDone("Den oprindelige tekst er sat tilbage.");
      else setFejl(svar.error);
    });
  }

  useLayoutEffect(() => {
    el.setAttribute("data-edit-open", "");
    const felt = ref.current!;
    const stil = getComputedStyle(el);
    for (const k of KOPIER) felt.style[k] = stil[k];
    felt.style.backgroundColor = baggrund(el);
    felt.focus();
    felt.select();
    return () => el.removeAttribute("data-edit-open");
  }, [el]);

  useLayoutEffect(() => {
    const felt = ref.current!;
    felt.style.height = "auto";
    felt.style.height = `${felt.scrollHeight}px`;
  }, [vaerdi, rect.width]);

  return (
    <div className="fixed z-50" style={{ top: rect.top, left: rect.left, width: Math.max(rect.width, 120) }}>
      <textarea
        ref={ref}
        value={vaerdi}
        aria-label="Ret teksten"
        onChange={(e) => setVaerdi(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onDone();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) gem();
        }}
        className="block w-full resize-none overflow-hidden outline-2 outline-offset-4 outline-gold"
        style={{ minHeight: rect.height }}
      />
      <div className="mt-3 flex w-max max-w-[90vw] flex-wrap items-center gap-2 bg-oxide p-2 text-sm text-pearl shadow-xl">
        <button onClick={gem} disabled={gemmer} className={`${knap} bg-gold text-oxide hover:bg-gold-soft`}>
          {gemmer ? "Gemmer…" : "Gem"}
        </button>
        <button onClick={() => onDone()} disabled={gemmer} className={knap}>
          Annuller
        </button>
        {maal.edited ? (
          <button onClick={gendan} disabled={gemmer} className={knap}>
            Gendan original
          </button>
        ) : null}
        {fejl ? (
          <span role="alert" className="px-2 text-gold-soft">
            {fejl}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function BilledValg({
  maal,
  onDone,
}: {
  maal: Extract<Maal, { kind: "image" }>;
  onDone: (besked?: string) => void;
}) {
  const { el, id, liste } = maal;
  const rect = usePlacering(el);
  const ref = useRef<HTMLInputElement>(null);
  const [fejl, setFejl] = useState<string | null>(null);
  const [uploader, start] = useTransition();

  useLayoutEffect(() => {
    el.setAttribute("data-edit-open", "");
    return () => el.removeAttribute("data-edit-open");
  }, [el]);

  function gendan() {
    start(async () => {
      const svar = liste ? await gendanBillede(liste, id) : await resetField(id);
      if (svar.ok) onDone("Det oprindelige billede er sat tilbage.");
      else setFejl(svar.error);
    });
  }

  return (
    <Vaerktoejslinje top={Math.max(8, Math.min(rect.top + 12, window.innerHeight - 120))} left={rect.left + 12}>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const fil = e.target.files?.[0];
          if (!fil) return;
          start(async () => {
            const form = new FormData();
            // Det nye billede skæres til, så det fylder samme ramme som det gamle.
            const forhold = el.clientHeight ? el.clientWidth / el.clientHeight : undefined;
            form.set("billede", await formindsk(fil, 2400, forhold));
            const svar = liste ? await erstatBillede(liste, id, form) : await saveImage(id, form);
            if (svar.ok) onDone("Billedet er skiftet.");
            else setFejl(svar.error);
          });
        }}
      />
      <button
        onClick={() => ref.current?.click()}
        disabled={uploader}
        className={`${knap} bg-gold text-oxide hover:bg-gold-soft`}
      >
        {uploader ? "Uploader…" : "Skift billede"}
      </button>
      {maal.edited ? (
        <button onClick={gendan} disabled={uploader} className={knap}>
          Gendan original
        </button>
      ) : null}
      <button onClick={() => onDone()} disabled={uploader} className={knap}>
        Luk
      </button>
      {fejl ? (
        <span role="alert" className="px-2 text-gold-soft">
          {fejl}
        </span>
      ) : null}
    </Vaerktoejslinje>
  );
}
