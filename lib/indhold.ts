import "server-only";
import { get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";

// Ossips rettelser fra /rediger ligger som én JSON-fil i en privat Vercel Blob-store.
// På Vercel logger SDK'en selv ind med projektets OIDC-token og BLOB_STORE_ID.
export type Indhold = {
  tekst: Record<string, string>;
  billeder: Record<string, string>;
};

const FIL = "indhold/indhold.json";
const tomt: Indhold = { tekst: {}, billeder: {} };

export const harBlob = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

async function laesFraBlob(): Promise<Indhold> {
  if (!harBlob()) return tomt;
  try {
    const res = await get(FIL, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return tomt;
    const data = (await new Response(res.stream).json()) as Partial<Indhold>;
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
  await put(FIL, JSON.stringify(indhold), {
    access: "private",
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
    contentType: fil.type || undefined,
    addRandomSuffix: true,
  });
  return `/${blob.pathname}`;
}
