"use client";

import { useState } from "react";

// Formularen sender ikke noget selv. Den åbner kundens mailprogram med beskeden klar.
export function ContactForm({ email, piece }: { email: string; piece?: string }) {
  const [navn, setNavn] = useState("");
  const [besked, setBesked] = useState(piece ? `Jeg er interesseret i "${piece}".\n\n` : "");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const emne = piece ? `Forespørgsel: ${piece}` : "Forespørgsel fra frolov.dk";
    const tekst = `${besked}\n\nVenlig hilsen\n${navn}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(emne)}&body=${encodeURIComponent(tekst)}`;
  }

  return (
    <form onSubmit={send} className="space-y-5">
      <div>
        <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-ash">
          Dit navn
        </label>
        <input
          id="name"
          required
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          className="mt-2 w-full border border-ink/20 bg-transparent px-4 py-3 focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-xs uppercase tracking-[0.2em] text-ash">
          Hvad drømmer du om?
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={besked}
          onChange={(e) => setBesked(e.target.value)}
          className="mt-2 w-full border border-ink/20 bg-transparent px-4 py-3 focus:border-ink focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-ink px-6 py-3 text-[0.95rem] tracking-wide text-pearl hover:bg-tourmaline"
      >
        Skriv e-mailen
      </button>
      <p className="text-sm text-ash">Knappen åbner dit mailprogram med beskeden klar til at sende.</p>
    </form>
  );
}
