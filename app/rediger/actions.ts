"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { erLoggetInd, logInd, logUd, rigtigAdgangskode } from "@/lib/adgang";
import { gemBillede, gemIndhold, harBlob, type Element, type Indhold } from "@/lib/indhold";
import { laesListe, lavSlug, standardListe } from "@/lib/lister";
import { smykker, typer } from "@/lib/smykker";

type Svar = { ok: true } | { ok: false; error: string };
type SvarMed<T> = ({ ok: true } & T) | { ok: false; error: string };

const MAX_BILLEDE = 4 * 1024 * 1024;

export async function login(_: { error?: string }, form: FormData): Promise<{ error?: string }> {
  if (!process.env.REDIGER_ADGANGSKODE) {
    return { error: "Der er ikke sat en adgangskode op endnu." };
  }
  if (!rigtigAdgangskode(String(form.get("adgangskode") ?? ""))) {
    return { error: "Forkert adgangskode." };
  }
  await logInd();
  redirect("/");
}

export async function logout() {
  await logUd();
}

async function tjek(): Promise<Svar | null> {
  if (!(await erLoggetInd())) return { ok: false, error: "Du er ikke logget ind." };
  if (!harBlob()) return { ok: false, error: "Lageret til rettelser er ikke sat op endnu." };
  return null;
}

// Viser den egentlige fejl fra lageret, så vi kan se hvad der går galt.
function lagerFejl(tekst: string, e: unknown): Svar {
  console.error(tekst, e);
  const detalje = e instanceof Error ? e.message : String(e);
  return { ok: false, error: `${tekst} (${detalje})` };
}

function opdater() {
  updateTag("indhold");
  revalidatePath("/", "layout");
}

export async function saveText(id: string, vaerdi: string): Promise<Svar> {
  const fejl = await tjek();
  if (fejl) return fejl;
  try {
    await gemIndhold((i) => {
      i.tekst[id] = vaerdi.trim();
    });
  } catch (e) {
    return lagerFejl("Kunne ikke gemme. Prøv igen.", e);
  }
  opdater();
  return { ok: true };
}

export async function resetField(id: string): Promise<Svar> {
  const fejl = await tjek();
  if (fejl) return fejl;
  try {
    await gemIndhold((i) => {
      delete i.tekst[id];
      delete i.billeder[id];
    });
  } catch (e) {
    return lagerFejl("Kunne ikke gendanne. Prøv igen.", e);
  }
  opdater();
  return { ok: true };
}

export async function saveImage(id: string, form: FormData): Promise<Svar> {
  const fejl = await tjek();
  if (fejl) return fejl;
  const fil = form.get("billede");
  if (!(fil instanceof File) || !fil.type.startsWith("image/")) {
    return { ok: false, error: "Vælg et billede." };
  }
  if (fil.size > MAX_BILLEDE) return { ok: false, error: "Billedet er for stort." };
  try {
    const url = await gemBillede(id, fil);
    await gemIndhold((i) => {
      i.billeder[id] = url;
    });
  } catch (e) {
    return lagerFejl("Kunne ikke uploade billedet. Prøv igen.", e);
  }
  opdater();
  return { ok: true };
}

// --- Lister: menuen, gallerier, smykker og egne sider ---

// Adresser en ny side ikke må få, fordi siden eller en gammel Wix-adresse allerede bruger dem.
const OPTAGET = new Set([
  "smykker", "vielsesringe", "galleri", "kunstneren", "workshops", "det-praktiske", "kontakt", "blog",
  "privatliv", "rediger", "billeder", "sitemap", "robots", "projects-8", "atelier", "about-5", "contact",
  "faq", "post", "api", "_next",
]);

class Brugerfejl extends Error {}

const nytId = () => Math.random().toString(36).slice(2, 8);

function ledig(slug: string, brugt: (s: string) => boolean) {
  if (!slug) slug = "side";
  let bud = slug;
  for (let n = 2; brugt(bud); n++) bud = `${slug}-${n}`;
  return bud;
}

async function aendreListe(
  navn: string,
  aendring: (liste: Element[], i: Indhold) => void,
  fejltekst = "Kunne ikke gemme. Prøv igen.",
): Promise<Svar> {
  const fejl = await tjek();
  if (fejl) return fejl;
  if (!standardListe(navn)) return { ok: false, error: "Den liste findes ikke." };
  try {
    await gemIndhold((i) => {
      const liste = structuredClone(laesListe(i.lister, navn));
      aendring(liste, i);
      i.lister[navn] = liste;
    });
  } catch (e) {
    return e instanceof Brugerfejl ? { ok: false, error: e.message } : lagerFejl(fejltekst, e);
  }
  opdater();
  return { ok: true };
}

function find(liste: Element[], id: string) {
  const i = liste.findIndex((e) => e.id === id);
  if (i < 0) throw new Brugerfejl("Den findes ikke længere. Genindlæs siden.");
  return i;
}

export async function flytElement(navn: string, id: string, retning: number): Promise<Svar> {
  return aendreListe(navn, (liste) => {
    const i = find(liste, id);
    const j = Math.max(0, Math.min(liste.length - 1, i + Math.sign(retning)));
    [liste[i], liste[j]] = [liste[j], liste[i]];
  });
}

export async function fjernElement(navn: string, id: string): Promise<Svar> {
  return aendreListe(navn, (liste) => {
    const i = find(liste, id);
    if (navn === "menu" && liste[i].slags !== "side") {
      throw new Brugerfejl("Faste sider kan ikke slettes, men du kan skjule dem.");
    }
    liste.splice(i, 1);
  });
}

export async function retMenupunkt(href: string, felter: { titel?: string; skjult?: boolean }): Promise<Svar> {
  return aendreListe("menu", (liste) => {
    const e = liste[find(liste, href)];
    if (felter.titel !== undefined) {
      const titel = felter.titel.trim().slice(0, 40);
      if (titel) e.titel = titel;
      else delete e.titel;
    }
    if (felter.skjult !== undefined) {
      if (felter.skjult) e.skjult = true;
      else delete e.skjult;
    }
  });
}

const BILLEDLISTE = /^(galleri\.udvalgte|galleri\.[a-z0-9-]+\.billeder|forside\.instagram|smykke\.[a-z0-9-]+\.billeder|side\.[a-z0-9-]+\.blokke)$/;

// Ét billede ad gangen, så hvert upload holder sig under grænsen for en server action.
export async function tilfoejBillede(navn: string, form: FormData): Promise<Svar> {
  const fejl = await tjek();
  if (fejl) return fejl;
  if (!BILLEDLISTE.test(navn)) return { ok: false, error: "Her kan der ikke tilføjes billeder." };
  const fil = form.get("billede");
  if (!(fil instanceof File) || !fil.type.startsWith("image/")) {
    return { ok: false, error: "Vælg et billede." };
  }
  if (fil.size > MAX_BILLEDE) return { ok: false, error: "Billedet er for stort." };
  const id = nytId();
  let src: string;
  try {
    src = await gemBillede(`${navn}.${id}`, fil);
  } catch (e) {
    return lagerFejl("Kunne ikke uploade billedet. Prøv igen.", e);
  }
  return aendreListe(navn, (liste) => {
    liste.push(navn.startsWith("side.") ? { id, src, slags: "billede" } : { id, src });
  });
}

export async function tilfoejBlok(slug: string, slags: string): Promise<Svar> {
  if (slags !== "tekst" && slags !== "overskrift") return { ok: false, error: "Ukendt slags." };
  return aendreListe(`side.${slug}.blokke`, (liste) => {
    liste.push({ id: nytId(), slags });
  });
}

export async function nySerie(): Promise<Svar> {
  return aendreListe("galleri.serier", (liste) => {
    liste.push({ id: `serie-${nytId()}`, titel: "Ny serie" });
  });
}

export async function nySide(titel: string): Promise<SvarMed<{ href: string }>> {
  const navn = titel.trim().slice(0, 40);
  if (!navn) return { ok: false, error: "Giv siden et navn." };
  let href = "";
  const svar = await aendreListe("menu", (liste) => {
    const slug = ledig(lavSlug(navn), (s) => OPTAGET.has(s) || liste.some((e) => e.id === `/${s}`));
    href = `/${slug}`;
    liste.push({ id: href, titel: navn, slags: "side" });
  });
  return svar.ok ? { ok: true, href } : svar;
}

export async function nytSmykke(titel: string, type: string): Promise<SvarMed<{ href: string }>> {
  const navn = titel.trim().slice(0, 80);
  if (!navn) return { ok: false, error: "Giv smykket et navn." };
  if (!typer.some((t) => t.slug === type)) return { ok: false, error: "Vælg en type." };
  let slug = "";
  const svar = await aendreListe("smykker", (liste, i) => {
    slug = ledig(lavSlug(navn), (s) => smykker.some((f) => f.slug === s) || liste.some((e) => e.id === s));
    liste.unshift({ id: slug, titel: navn, slags: type });
    i.tekst[`smykke.${slug}.titel`] = navn;
  });
  return svar.ok ? { ok: true, href: `/smykker/${slug}` } : svar;
}
