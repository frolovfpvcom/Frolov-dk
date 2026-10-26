"use client";

import { useEffect } from "react";
import { flytTil } from "@/app/rediger/actions";
import { uploadBilleder } from "./Redigering";

// Træk og slip for alt med data-element (se flytbar i lib/lister.ts).
// Med musen starter et træk, når man flytter lidt med knappen nede. På telefon og iPad
// holder man fingeren stille et øjeblik først, så man stadig kan rulle siden som normalt.

const MUS_AFSTAND = 6;
const HOLD_MS = 350;
const KANT = 80;

type Traek = {
  el: HTMLElement;
  liste: string;
  id: string;
  x: number;
  y: number;
  touch: boolean;
  aktiv: boolean;
  maal?: { el: HTMLElement; efter: boolean };
  timer?: number;
};

function findMaal(t: Traek, x: number, y: number) {
  for (let e = document.elementFromPoint(x, y) as HTMLElement | null; e; e = e.parentElement) {
    if (e === t.el) return null;
    if (e.dataset.element !== undefined && e.dataset.liste === t.liste) {
      const r = e.getBoundingClientRect();
      const efter = e.dataset.lodret !== undefined ? y > r.top + r.height / 2 : x > r.left + r.width / 2;
      return { el: e, efter };
    }
  }
  return null;
}

export function useTraek(aktiv: boolean, besked: (tekst: string | null) => void) {
  useEffect(() => {
    if (!aktiv) return;
    let t: Traek | null = null;
    let rul = 0;

    const markerMaal = (maal: Traek["maal"]) => {
      if (t?.maal?.el !== maal?.el || t?.maal?.efter !== maal?.efter) {
        delete t?.maal?.el.dataset.drop;
        if (maal) {
          const lodret = maal.el.dataset.lodret !== undefined;
          maal.el.dataset.drop = lodret ? (maal.efter ? "under" : "over") : maal.efter ? "hoejre" : "venstre";
        }
      }
      if (t) t.maal = maal;
    };

    const nulstil = () => {
      if (!t) return;
      window.clearTimeout(t.timer);
      t.el.style.transform = "";
      delete t.el.dataset.traekkes;
      markerMaal(undefined);
      t = null;
      cancelAnimationFrame(rul);
      rul = 0;
    };

    const begynd = () => {
      if (!t) return;
      t.aktiv = true;
      t.el.dataset.traekkes = "";
      navigator.vibrate?.(15);
      window.getSelection()?.removeAllRanges();
    };

    // Rul siden, når man trækker tæt på kanten af skærmen.
    let sidstY = 0;
    const rulVedKant = () => {
      if (!t?.aktiv) return;
      const fart =
        sidstY < KANT ? -(KANT - sidstY) / 4 : sidstY > innerHeight - KANT ? (sidstY - innerHeight + KANT) / 4 : 0;
      if (fart) window.scrollBy(0, fart);
      rul = requestAnimationFrame(rulVedKant);
    };

    const ned = (e: PointerEvent) => {
      if (e.button !== 0 || t) return;
      const maal = e.target as HTMLElement;
      if (maal.closest("button, input, textarea, select, [data-edit-open], [data-only-editing]")) return;
      const el = maal.closest<HTMLElement>("[data-element]");
      if (!el?.dataset.liste) return;
      t = {
        el,
        liste: el.dataset.liste,
        id: el.dataset.element!,
        x: e.clientX,
        y: e.clientY,
        touch: e.pointerType !== "mouse",
        aktiv: false,
      };
      if (t.touch) t.timer = window.setTimeout(begynd, HOLD_MS);
    };

    const flyt = (e: PointerEvent) => {
      if (!t) return;
      const dx = e.clientX - t.x;
      const dy = e.clientY - t.y;
      if (!t.aktiv) {
        if (t.touch) {
          if (Math.hypot(dx, dy) > 10) nulstil();
          return;
        }
        if (Math.hypot(dx, dy) < MUS_AFSTAND) return;
        begynd();
        rul = requestAnimationFrame(rulVedKant);
      }
      if (t.touch && !rul) rul = requestAnimationFrame(rulVedKant);
      sidstY = e.clientY;
      t.el.style.transform = `translate(${dx}px, ${dy}px)`;
      markerMaal(findMaal(t, e.clientX, e.clientY) ?? undefined);
    };

    const op = () => {
      if (!t) return;
      const { aktiv, maal, liste, id } = t;
      nulstil();
      if (!aktiv) return;
      // Slip efter et træk må ikke tælle som et klik på et link.
      const stop = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      document.addEventListener("click", stop, { capture: true, once: true });
      window.setTimeout(() => document.removeEventListener("click", stop, true), 300);
      if (!maal) return;
      besked("Flytter…");
      flytTil(liste, id, maal.el.dataset.element!, maal.efter).then((svar) =>
        besked(svar.ok ? "Flyttet." : svar.error),
      );
    };

    // Rul ikke siden mens fingeren trækker, og lad ikke browseren trække selve billedet.
    const touchFlyt = (e: TouchEvent) => {
      if (t?.aktiv) e.preventDefault();
    };
    // Billeder trukket ind fra computeren lægges i den liste, de slippes over.
    let slipFelt: HTMLElement | null = null;
    const markerSlip = (el: HTMLElement | null) => {
      if (slipFelt === el) return;
      delete slipFelt?.dataset.slipOver;
      slipFelt = el;
      if (el) el.dataset.slipOver = "";
    };
    const filOver = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      const felt = (e.target as HTMLElement).closest?.<HTMLElement>("[data-slip-billeder]") ?? null;
      markerSlip(felt);
      if (!felt) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    };
    const filUd = (e: DragEvent) => {
      if (!e.relatedTarget) markerSlip(null);
    };
    const filSlip = (e: DragEvent) => {
      const felt = slipFelt;
      markerSlip(null);
      if (!felt || !e.dataTransfer?.files.length) return;
      e.preventDefault();
      uploadBilleder(felt.dataset.slipBilleder!, Array.from(e.dataTransfer.files), besked);
    };

    const nativTraek = (e: DragEvent) => {
      if ((e.target as HTMLElement).closest?.("[data-element]")) e.preventDefault();
    };
    const tast = (e: KeyboardEvent) => {
      if (e.key === "Escape") nulstil();
    };

    document.addEventListener("pointerdown", ned);
    document.addEventListener("pointermove", flyt);
    document.addEventListener("pointerup", op);
    document.addEventListener("pointercancel", nulstil);
    document.addEventListener("touchmove", touchFlyt, { passive: false });
    document.addEventListener("dragstart", nativTraek);
    document.addEventListener("dragover", filOver);
    document.addEventListener("dragleave", filUd);
    document.addEventListener("drop", filSlip);
    document.addEventListener("keydown", tast);
    return () => {
      nulstil();
      document.removeEventListener("pointerdown", ned);
      document.removeEventListener("pointermove", flyt);
      document.removeEventListener("pointerup", op);
      document.removeEventListener("pointercancel", nulstil);
      document.removeEventListener("touchmove", touchFlyt);
      document.removeEventListener("dragstart", nativTraek);
      document.removeEventListener("dragover", filOver);
      document.removeEventListener("dragleave", filUd);
      document.removeEventListener("drop", filSlip);
      document.removeEventListener("keydown", tast);
    };
  }, [aktiv, besked]);
}
