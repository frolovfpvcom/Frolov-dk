"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fjernElement, flytElement, nySide, retMenupunkt } from "@/app/rediger/actions";
import type { MenuPunkt } from "@/lib/lister";

type Svar = { ok: true } | { ok: false; error: string };

const knap = "flex h-8 w-8 items-center justify-center hover:bg-pearl/10 disabled:opacity-30";

// Som "Sider" i Wix: flyt menupunkter, omdøb dem, skjul dem og opret nye sider.
export function MenuPanel({ menu, onClose }: { menu: MenuPunkt[]; onClose: () => void }) {
  const router = useRouter();
  const [fejl, setFejl] = useState<string | null>(null);
  const [venter, start] = useTransition();
  const [ny, setNy] = useState("");

  const kør = (handling: () => Promise<Svar>) =>
    start(async () => {
      const svar = await handling();
      setFejl(svar.ok ? null : svar.error);
    });

  return (
    <div
      role="dialog"
      aria-label="Sider og menu"
      className="fixed right-4 bottom-20 left-4 z-50 max-h-[75vh] overflow-y-auto bg-oxide p-5 text-pearl shadow-2xl sm:left-auto sm:w-[26rem]"
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-gold-soft">Sider og menu</p>
        <button onClick={onClose} className="px-2 text-sm underline underline-offset-4 hover:text-gold-soft">
          Luk
        </button>
      </div>
      <p className="mt-2 text-sm text-pearl/70">
        Flyt sider op og ned, ret navnet i menuen, eller skjul en side. Skjulte sider findes stadig, men står ikke i
        menuen.
      </p>

      <ol className="mt-4 space-y-1">
        {menu.map((m, i) => (
          <li
            key={m.href}
            className={`flex items-center gap-1 bg-pearl/5 py-1 pr-1 pl-2 ${m.skjult ? "opacity-60" : ""}`}
          >
            <input
              defaultValue={m.label}
              key={m.label}
              aria-label={`Navn i menuen for ${m.href}`}
              onBlur={(e) => {
                const titel = e.target.value.trim();
                if (titel && titel !== m.label) kør(() => retMenupunkt(m.href, { titel }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="min-w-0 flex-1 bg-transparent px-1 py-1 outline-none focus:bg-pearl/10"
            />
            <button
              type="button"
              title="Flyt op"
              aria-label={`Flyt ${m.label} op`}
              disabled={venter || i === 0}
              onClick={() => kør(() => flytElement("menu", m.href, -1))}
              className={knap}
            >
              ↑
            </button>
            <button
              type="button"
              title="Flyt ned"
              aria-label={`Flyt ${m.label} ned`}
              disabled={venter || i === menu.length - 1}
              onClick={() => kør(() => flytElement("menu", m.href, 1))}
              className={knap}
            >
              ↓
            </button>
            <button
              type="button"
              title={m.skjult ? "Vis i menuen" : "Skjul i menuen"}
              disabled={venter}
              onClick={() => kør(() => retMenupunkt(m.href, { skjult: !m.skjult }))}
              className="h-8 px-2 text-xs hover:bg-pearl/10 disabled:opacity-30"
            >
              {m.skjult ? "Vis" : "Skjul"}
            </button>
            <Link href={m.href} onClick={onClose} title="Gå til siden" className={knap}>
              ↗
            </Link>
            {m.egen ? (
              <button
                type="button"
                title="Slet siden"
                aria-label={`Slet ${m.label}`}
                disabled={venter}
                onClick={() => {
                  if (window.confirm(`Vil du slette siden "${m.label}"?`)) kør(() => fjernElement("menu", m.href));
                }}
                className={`${knap} hover:bg-red-900`}
              >
                ✕
              </button>
            ) : (
              <span className="w-8" />
            )}
          </li>
        ))}
      </ol>

      <form
        className="mt-5 flex gap-2"
        action={() =>
          start(async () => {
            const svar = await nySide(ny);
            if (!svar.ok) return setFejl(svar.error);
            setNy("");
            setFejl(null);
            onClose();
            router.push(svar.href);
          })
        }
      >
        <input
          value={ny}
          onChange={(e) => setNy(e.target.value)}
          placeholder="Navn på ny side"
          aria-label="Navn på ny side"
          className="min-w-0 flex-1 border border-pearl/20 bg-transparent px-3 py-2 outline-none focus:border-gold-soft"
        />
        <button
          disabled={venter || !ny.trim()}
          className="bg-gold px-4 py-2 text-sm text-oxide hover:bg-gold-soft disabled:opacity-50"
        >
          Opret side
        </button>
      </form>
      {fejl ? (
        <p role="alert" className="mt-3 text-sm text-gold-soft">
          {fejl}
        </p>
      ) : null}
      {venter ? <p className="mt-3 text-sm text-pearl/60">Gemmer…</p> : null}
    </div>
  );
}
