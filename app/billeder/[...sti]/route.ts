import { get } from "@vercel/blob";
import { blobAdgang } from "@/lib/indhold";

// Viser et billede Ossip har uploadet. Navnet får et tilfældigt endelse ved upload,
// så samme adresse altid er samme billede og må caches længe.
export async function GET(_: Request, { params }: { params: Promise<{ sti: string[] }> }) {
  const { sti } = await params;
  const res = await get(`billeder/${sti.join("/")}`, { access: "private", ...blobAdgang() }).catch(() => null);
  if (!res || res.statusCode !== 200) return new Response("Ikke fundet", { status: 404 });
  return new Response(res.stream, {
    headers: {
      "Content-Type": res.blob.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
