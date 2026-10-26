import type { ElementType, ReactNode } from "react";
import { hentIndhold } from "@/lib/indhold";
import { wix } from "@/lib/wix";

// *ord* bliver til kursiv, som i Ossips egne tekster.
function formater(tekst: string): ReactNode {
  const dele = tekst.split(/\*([^*]+)\*/);
  if (dele.length === 1) return tekst;
  return dele.map((del, i) =>
    i % 2 ? (
      <em key={i} className="text-tourmaline">
        {del}
      </em>
    ) : (
      del
    ),
  );
}

export async function tekst(id: string, standard: string) {
  const { tekst } = await hentIndhold();
  return tekst[id] ?? standard;
}

// En tekst Ossip kan dobbeltklikke på og rette, når han er logget ind.
export async function T({
  id,
  as: Tag = "span",
  className,
  placeholder,
  children = "",
}: {
  id: string;
  as?: ElementType;
  className?: string;
  placeholder?: string;
  children?: string;
}) {
  const { tekst } = await hentIndhold();
  const rettet = tekst[id];
  const vaerdi = rettet ?? children;
  return (
    <Tag
      data-edit={id}
      data-raw={vaerdi}
      data-edited={rettet !== undefined ? "" : undefined}
      data-placeholder={placeholder}
      className={className}
    >
      {formater(vaerdi)}
    </Tag>
  );
}

// Et billede Ossip kan skifte. Standardbilledet hentes fra Wix i den ønskede størrelse,
// medmindre det er et billede han selv har uploadet (src).
export async function Billede({
  id,
  wixId,
  src,
  str,
  alt,
  className,
  lazy = false,
}: {
  id: string;
  wixId?: string;
  src?: string;
  str: number;
  alt: string;
  className?: string;
  lazy?: boolean;
}) {
  const { billeder } = await hentIndhold();
  const rettet = billeder[id];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={rettet ?? src ?? wix(wixId!, str)}
      alt={alt}
      loading={lazy ? "lazy" : undefined}
      data-edit-img={id}
      data-edited={rettet ? "" : undefined}
      className={className}
    />
  );
}

export async function billede(id: string, standard: string) {
  const { billeder } = await hentIndhold();
  return billeder[id] ?? standard;
}
