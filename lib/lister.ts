import "server-only";
import { hentIndhold, type Element, type Indhold } from "./indhold";
import { instagram, serier, udvalgte } from "./galleri";
import { menu } from "./site";
import { smykker, typer, type Smykke, type Type } from "./smykker";
import { wix } from "./wix";

// De lister Ossip kan ændre på siden, og hvad de indeholder, før han har rørt dem.
// En liste han har ændret, gemmes i sin helhed i indhold.lister[navn].
const standarder: [RegExp, (m: RegExpMatchArray) => Element[]][] = [
  [/^menu$/, () => menu.map((m) => ({ id: m.href }))],
  [/^galleri\.udvalgte$/, () => udvalgte.map((id) => ({ id, wix: id }))],
  [/^galleri\.serier$/, () => serier.map((s) => ({ id: s.id }))],
  [
    /^galleri\.([a-z0-9-]+)\.billeder$/,
    (m) => (serier.find((s) => s.id === m[1])?.billeder ?? []).map((b) => ({ id: b.id, wix: b.id, titel: b.titel })),
  ],
  [/^forside\.instagram$/, () => instagram.map((id) => ({ id, wix: id }))],
  [/^smykker$/, () => smykker.map((s) => ({ id: s.slug }))],
  // Id'erne 1, 2, 3 passer med de billeder Ossip allerede kan skifte (smykke.<slug>.billede.1 osv.).
  [
    /^smykke\.([a-z0-9-]+)\.billeder$/,
    (m) =>
      (smykker.find((s) => s.slug === m[1])?.billeder ?? []).map((b, i) => ({
        id: String(i + 1),
        wix: b.id,
        titel: b.alt,
      })),
  ],
  [/^side\.([a-z0-9-]+)\.blokke$/, () => []],
];

export function standardListe(navn: string): Element[] | undefined {
  for (const [re, lav] of standarder) {
    const m = navn.match(re);
    if (m) return lav(m);
  }
  return undefined;
}

export function laesListe(lister: Indhold["lister"], navn: string): Element[] {
  const standard = standardListe(navn) ?? [];
  const gemt = lister[navn];
  if (!gemt) return standard;
  if (navn !== "menu") return gemt;
  // Faste sider kan kun skjules, ikke slettes. Kommer der en ny side i koden, sættes den sidst.
  const faste = new Set(standard.map((e) => e.id));
  const behold = gemt.filter((e) => e.slags === "side" || faste.has(e.id));
  return [...behold, ...standard.filter((s) => !behold.some((e) => e.id === s.id))];
}

export async function hentListe(navn: string) {
  return laesListe((await hentIndhold()).lister, navn);
}

export function billedSrc(e: Element, str: number) {
  return e.src ?? wix(e.wix ?? e.id, str);
}

// Æ, ø og å skrives om, så adressen bliver pæn.
export function lavSlug(tekst: string) {
  return tekst
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export type MenuPunkt = { href: string; label: string; skjult: boolean; egen: boolean };

export async function hentMenu(): Promise<MenuPunkt[]> {
  return (await hentListe("menu")).map((e) => ({
    href: e.id,
    label: e.titel || menu.find((m) => m.href === e.id)?.label || e.id,
    skjult: Boolean(e.skjult),
    egen: e.slags === "side",
  }));
}

export async function findSide(slug: string) {
  return (await hentMenu()).find((m) => m.egen && m.href === `/${slug}`);
}

export type VistSmykke = Omit<Smykke, "billeder"> & { billeder: Element[] };

// Smykkerne i Ossips rækkefølge, med de smykker han selv har tilføjet.
export async function hentSmykker(): Promise<VistSmykke[]> {
  const { lister } = await hentIndhold();
  return laesListe(lister, "smykker").map((e) => {
    const fast = smykker.find((s) => s.slug === e.id);
    const type: Type = typer.some((t) => t.slug === e.slags) ? (e.slags as Type) : "ringe";
    const grund = fast ?? {
      slug: e.id,
      type,
      titel: e.titel ?? "Nyt smykke",
      pris: "",
      materiale: "",
      beskrivelse: "",
      detaljer: "",
    };
    return { ...grund, billeder: laesListe(lister, `smykke.${e.id}.billeder`) };
  });
}

export async function findSmykke(slug: string) {
  return (await hentSmykker()).find((s) => s.slug === slug);
}

// De næste smykker efter dette, rundt i ring.
export function andreSmykker(alle: VistSmykke[], slug: string, antal = 3) {
  const i = alle.findIndex((s) => s.slug === slug);
  const n = Math.min(antal, alle.length - 1);
  return Array.from({ length: Math.max(n, 0) }, (_, k) => alle[(i + 1 + k) % alle.length]);
}
