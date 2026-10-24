import Link from "next/link";
import { T } from "./Tekst";
import { fakta } from "@/lib/fakta";
import { menu, site } from "@/lib/site";
import { hentIndhold } from "@/lib/indhold";

export function TopLinje() {
  return (
    <div className="bg-oxide text-pearl/85">
      <ul className="mx-auto flex max-w-6xl justify-center gap-x-8 overflow-hidden px-5 py-2 text-[0.7rem] uppercase tracking-[0.2em] sm:px-8">
        {fakta.map((f) => (
          <li key={f.id} className={`whitespace-nowrap ${f.vis}`}>
            <T id={f.id}>{f.tekst}</T>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-pearl/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Frolov
          <span className="ml-2 hidden align-middle font-sans text-[0.65rem] uppercase tracking-[0.25em] text-ash sm:inline">
            Guldsmed
          </span>
        </Link>
        <nav aria-label="Hovedmenu" className="hidden lg:block">
          <ul className="flex gap-6 text-sm">
            {menu.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className="text-ash transition-colors hover:text-ink">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-5">
          <Link
            href="/kontakt"
            className="bg-ink px-4 py-2 text-sm tracking-wide text-pearl transition-colors hover:bg-tourmaline"
          >
            Book et møde
          </Link>
          <details className="group relative lg:hidden">
            <summary className="cursor-pointer list-none text-sm uppercase tracking-[0.2em] [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Luk</span>
            </summary>
            <ul className="absolute right-0 mt-4 w-56 space-y-1 border border-ink/10 bg-pearl p-3 shadow-lg">
              {menu.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="block px-2 py-2 text-ink">
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

export async function Footer() {
  const { tekst } = await hentIndhold();
  const harCvr = Boolean(tekst.cvr);
  return (
    <footer className="mt-24 bg-oxide text-pearl">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl">{site.navn}</p>
          <p className="mt-2 text-sm text-pearl/60">Guldsmed · smykker på bestilling i over 25 år</p>
          <Link
            href="/kontakt"
            className="mt-6 inline-block border border-pearl/30 px-5 py-2.5 text-sm tracking-wide hover:border-gold-soft hover:text-gold-soft"
          >
            Book et møde
          </Link>
        </div>
        <div className="space-y-1 text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold-soft">Værkstedet</p>
          <p>Fuglebakkevej, Brønshøj</p>
          <p>Besøg efter aftale, også online</p>
          <p>
            <a href={site.telefonLink} className="hover:text-gold-soft">
              Tlf. {site.telefon}
            </a>
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="hover:text-gold-soft">
              {site.email}
            </a>
          </p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold-soft">Køb og betaling</p>
          <p>{site.betaling}</p>
          <p>14 dages returret på færdige smykker</p>
          <p>Brug dit eget guld og dine sten</p>
          <p>
            <Link href="/det-praktiske" className="underline underline-offset-4 hover:text-gold-soft">
              Det praktiske
            </Link>
          </p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold-soft">Siden</p>
          {[...menu, { href: "/blog", label: "Blog" }].map((m) => (
            <p key={m.href}>
              <Link href={m.href} className="hover:text-gold-soft">
                {m.label}
              </Link>
            </p>
          ))}
          <p className="pt-3">
            <a href={site.instagram} className="hover:text-gold-soft">
              Instagram
            </a>{" "}
            ·{" "}
            <a href={site.facebook} className="hover:text-gold-soft">
              Facebook
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-pearl/10">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 text-xs text-pearl/50 sm:px-8">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <p>© {site.navn}</p>
            <p className="" data-only-editing={harCvr ? undefined : ""}>
              CVR <T id="cvr" placeholder="Tilføj CVR-nummer" />
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privatliv" className="hover:text-pearl">
              Privatliv og cookies
            </Link>
            <Link href="/rediger" className="hover:text-pearl">
              Rediger siden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
