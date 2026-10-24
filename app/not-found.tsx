import Link from "next/link";

export default function IkkeFundet() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
      <h1 className="font-display text-5xl">Siden findes ikke</h1>
      <p className="mt-4 text-ash">Måske er den flyttet, da hjemmesiden blev fornyet.</p>
      <Link href="/" className="mt-8 inline-block underline underline-offset-4">
        Til forsiden
      </Link>
    </div>
  );
}
