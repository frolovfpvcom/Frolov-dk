"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

// En billedstribe der glider langsomt fra højre mod venstre i en uendelig løkke.
// Man kan trække i den med musen eller skubbe til den med fingeren, og den holder pause,
// mens musen er over den. Når Ossip redigerer, står den stille, så han kan flytte billederne.

const FART = 30; // pixels i sekundet
const PAUSE_EFTER_TRYK = 2500;

const ingenAbonnement = () => () => {};

export function Stribe({ children }: { children: ReactNode }) {
  const redigerer = useSyncExternalStore(
    ingenAbonnement,
    () => document.cookie.split("; ").includes("frolov_rediger_ui=1"),
    () => false,
  );
  const rulle = useRef<HTMLDivElement>(null);
  const saet = useRef<HTMLDivElement>(null);
  const [kopier, setKopier] = useState(1);

  // Nok kopier til at striben altid kan glide videre uden et hul.
  useEffect(() => {
    if (redigerer) return;
    const maal = () => {
      const bredde = saet.current?.offsetWidth ?? 0;
      const plads = rulle.current?.clientWidth ?? 0;
      setKopier(bredde ? Math.ceil(plads / bredde) + 1 : 1);
    };
    maal();
    const ro = new ResizeObserver(maal);
    if (saet.current) ro.observe(saet.current);
    if (rulle.current) ro.observe(rulle.current);
    return () => ro.disconnect();
  }, [redigerer]);

  useEffect(() => {
    const el = rulle.current;
    if (!el || redigerer) return;
    const roligt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pauseTil = 0;
    let over = false;
    let traek: { x: number; venstre: number; flyttet: boolean } | null = null;
    let sidst = performance.now();
    let rest = 0;
    let ramme = 0;

    // Hold rullepositionen inden for første sæt, så løkken aldrig ender.
    const omkreds = () => {
      const bredde = saet.current?.offsetWidth ?? 0;
      if (!bredde) return;
      if (el.scrollLeft >= bredde) el.scrollLeft -= bredde;
      else if (el.scrollLeft <= 0 && kopier > 1) el.scrollLeft += bredde;
    };

    const tik = (nu: number) => {
      const dt = Math.min(100, nu - sidst);
      sidst = nu;
      if (!roligt && !over && !traek && nu > pauseTil) {
        rest += (FART * dt) / 1000;
        const hel = Math.floor(rest);
        if (hel) {
          el.scrollLeft += hel;
          rest -= hel;
        }
      }
      omkreds();
      ramme = requestAnimationFrame(tik);
    };
    ramme = requestAnimationFrame(tik);

    const ned = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      traek = { x: e.clientX, venstre: el.scrollLeft, flyttet: false };
    };
    const flyt = (e: PointerEvent) => {
      if (!traek) return;
      const dx = e.clientX - traek.x;
      if (Math.abs(dx) > 4) traek.flyttet = true;
      if (traek.flyttet) {
        el.scrollLeft = traek.venstre - dx;
        omkreds();
        traek.venstre = el.scrollLeft + dx;
      }
    };
    const op = () => {
      if (traek?.flyttet) {
        // Et træk må ikke åbne det billede man slap over.
        const stop = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        };
        el.addEventListener("click", stop, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", stop, true), 300);
      }
      traek = null;
    };
    const tryk = () => {
      pauseTil = performance.now() + PAUSE_EFTER_TRYK;
    };
    const ind = () => (over = true);
    const ud = () => (over = false);
    const ingenBilledTraek = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", ned);
    window.addEventListener("pointermove", flyt);
    window.addEventListener("pointerup", op);
    el.addEventListener("touchstart", tryk, { passive: true });
    el.addEventListener("touchmove", tryk, { passive: true });
    el.addEventListener("wheel", tryk, { passive: true });
    el.addEventListener("mouseenter", ind);
    el.addEventListener("mouseleave", ud);
    el.addEventListener("dragstart", ingenBilledTraek);
    return () => {
      cancelAnimationFrame(ramme);
      el.removeEventListener("pointerdown", ned);
      window.removeEventListener("pointermove", flyt);
      window.removeEventListener("pointerup", op);
      el.removeEventListener("touchstart", tryk);
      el.removeEventListener("touchmove", tryk);
      el.removeEventListener("wheel", tryk);
      el.removeEventListener("mouseenter", ind);
      el.removeEventListener("mouseleave", ud);
      el.removeEventListener("dragstart", ingenBilledTraek);
    };
  }, [redigerer, kopier]);

  return (
    <div
      ref={rulle}
      className={`flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        redigerer
          ? ""
          : "cursor-grab select-none [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] active:cursor-grabbing"
      }`}
    >
      <div ref={saet} className="flex shrink-0 gap-3 pr-3">
        {children}
      </div>
      {redigerer
        ? null
        : Array.from({ length: kopier }, (_, i) => (
            <div key={i} className="flex shrink-0 gap-3 pr-3" aria-hidden="true" inert>
              {children}
            </div>
          ))}
    </div>
  );
}
