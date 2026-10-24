# frolov.dk

Hjemmeside for guldsmed Ossip Frolov. Next.js og Tailwind, hostet på Vercel.

Repoet er genskabt i oktober 2026 ud fra den side der kørte på frolov-dk.vercel.app,
fordi det oprindelige repo (peterfrolov/frolov-dk) sidder fast på en suspenderet konto.

## Kør lokalt

```bash
npm install
npm run dev
```

## Ossip retter selv i siden

Ossip logger ind på `/rediger` og dobbeltklikker på tekster og billeder for at rette dem.
Rettelserne gemmes i Vercel Blob. For at det virker, skal Vercel-projektet have:

- en Blob-store forbundet til projektet (giver `BLOB_READ_WRITE_TOKEN`)
- miljøvariablen `REDIGER_ADGANGSKODE` med Ossips adgangskode

Uden de to virker siden som normalt, men rettelser kan ikke gemmes.

## Hvor ligger hvad

- `lib/` indhold: smykker, blogindlæg, gallerier, spørgsmål og svar, kontaktoplysninger
- `components/Tekst.tsx` tekster og billeder Ossip kan rette
- `components/EditMode.tsx` redigeringsværktøjet i browseren
- `app/rediger/actions.ts` login og gemning
- `next.config.ts` omdirigeringer fra de gamle Wix-adresser

Billederne hentes stadig fra Wix (`lib/wix.ts`). Originalerne er sikret i projektets mappe `billeder/`.
