"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { erLoggetInd, logInd, logUd, rigtigAdgangskode } from "@/lib/adgang";
import { gemBillede, gemIndhold, harBlob } from "@/lib/indhold";

type Svar = { ok: true } | { ok: false; error: string };

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
