import "server-only";
import { get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";

// Ossips rettelser fra /rediger ligger som én JSON-fil i en privat Vercel Blob-store.
// På Vercel logger SDK'en selv ind med projektets OIDC-token og BLOB_STORE_ID.
export type Indhold = {
  tekst: Record<string, string>;
  billeder: Record<string, string>;
  // Rækkefølgen af menuen, gallerier, smykker og egne sider (se lib/lister.ts).
  lister: Record<string, Element[]>;
};

// Ét punkt i en liste. Hvilke felter der bruges, afhænger af listen.
export type Element = {
  id: string;
  src?: string;
  wix?: string;
  titel?: string;
  slags?: string;
  skjult?: boolean;
};

const FIL = "indhold/indhold.json";
const tomt: Indhold = { tekst: {}, billeder: {}, lister: {} };

export const harBlob = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

// Er der sat en read-write token, bruges den frem for OIDC, så den kan redde os,
// hvis OIDC-forbindelsen til lageret driller.
export const blobAdgang = () =>
  process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {};

// Kaster ved fejl, så en gemning aldrig overskriver rettelserne med et tomt indhold.
async function laesStrengt(): Promise<Indhold> {
  if (!harBlob()) return tomt;
  const res = await get(FIL, { access: "private", useCache: false, ...blobAdgang() });
  if (!res) return tomt;
  if (res.statusCode !== 200) throw new Error(`Blob svarede ${res.statusCode}`);
  const data = (await new Response(res.stream).json()) as Partial<Indhold>;
  return { tekst: data.tekst ?? {}, billeder: data.billeder ?? {}, lister: data.lister ?? {} };
}

async function laesFraBlob(): Promise<Indhold> {
  try {
    return await laesStrengt();
  } catch (e) {
    console.error("Kunne ikke læse indhold fra Blob:", e);
    return tomt;
  }
}

export const hentIndhold = unstable_cache(laesFraBlob, ["indhold"], {
  tags: ["indhold"],
});

export async function gemIndhold(aendring: (i: Indhold) => void) {
  const indhold = structuredClone(await laesStrengt());
  aendring(indhold);
  await put(FIL, JSON.stringify(indhold), {
    access: "private",
    ...blobAdgang(),
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Billederne er private i Blob, så de vises gennem app/billeder/[...sti]/route.ts.
export async function gemBillede(id: string, fil: File) {
  const endelse = fil.name.match(/\.\w+$/)?.[0] ?? ".jpg";
  const blob = await put(`billeder/${id}${endelse}`, fil, {
    access: "private",
    ...blobAdgang(),
    contentType: fil.type || undefined,
    addRandomSuffix: true,
  });
  return `/${blob.pathname}`;
}
