import "server-only";
import { del, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";

// Ossips rettelser fra /rediger ligger som én JSON-fil i Vercel Blob.
// Hver gemning skriver en ny fil, så Blobs CDN aldrig viser en gammel udgave.
export type Indhold = {
  tekst: Record<string, string>;
  billeder: Record<string, string>;
};

const MAPPE = "indhold/";
const tomt: Indhold = { tekst: {}, billeder: {} };

export const harBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function laesFraBlob(): Promise<Indhold> {
  if (!harBlob()) return tomt;
  try {
    const { blobs } = await list({ prefix: MAPPE });
    const nyeste = blobs.sort((a, b) => +b.uploadedAt - +a.uploadedAt)[0];
    if (!nyeste) return tomt;
    const res = await fetch(nyeste.url, { cache: "no-store" });
    if (!res.ok) return tomt;
    const data = (await res.json()) as Partial<Indhold>;
    return { tekst: data.tekst ?? {}, billeder: data.billeder ?? {} };
  } catch {
    return tomt;
  }
}

export const hentIndhold = unstable_cache(laesFraBlob, ["indhold"], {
  tags: ["indhold"],
});

export async function gemIndhold(aendring: (i: Indhold) => void) {
  const indhold = structuredClone(await laesFraBlob());
  aendring(indhold);
  const ny = await put(`${MAPPE}indhold.json`, JSON.stringify(indhold), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
  });
  const { blobs } = await list({ prefix: MAPPE });
  const gamle = blobs.filter((b) => b.url !== ny.url).map((b) => b.url);
  if (gamle.length) await del(gamle);
}

export async function gemBillede(id: string, fil: File) {
  const endelse = fil.name.match(/\.\w+$/)?.[0] ?? ".jpg";
  const blob = await put(`billeder/${id}${endelse}`, fil, {
    access: "public",
    contentType: fil.type || undefined,
    addRandomSuffix: true,
  });
  return blob.url;
}
