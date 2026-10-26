export type Type = "ringe" | "oereringe";

export type Smykke = {
  slug: string;
  type: Type;
  titel: string;
  pris: string;
  materiale: string;
  beskrivelse: string;
  detaljer: string;
  billeder: { id: string; alt: string }[];
};

export const typer: { slug: Type; label: string }[] = [
  { slug: "ringe", label: "Ringe" },
  { slug: "oereringe", label: "Øreringe" },
];

// Teksterne her er udgangspunktet. Ossip kan rette dem på /rediger.
export const smykker: Smykke[] = [
  {
    slug: "froeen-og-den-blaa-topas",
    type: "ringe",
    titel: "Frøen og Den Blå Topas",
    pris: "16.500 kr.",
    materiale: "Sterling sølv, 18K og 14K guld, blå topas",
    beskrivelse: "Ring med en lille frø, der vogter en blå topas.",
    detaljer: "Ringen er af sterling sølv med blå topaser i 18K guld. Den fede fine frø er af 14K guld.",
    billeder: [
      { id: "3b4bab_c6742a9b32db454abba9d95fa325c636~mv2.jpg", alt: "Frøen og Den Blå Topas" },
    ],
  },
  {
    slug: "den-graesgroenne-turmalin",
    type: "ringe",
    titel: "Den græsgrønne Turmalin",
    pris: "37.500 kr.",
    materiale: "Sterling sølv, 18K og 14K guld, grøn turmalin, safirer",
    beskrivelse: "Ring med en stor græsgrøn turmalin.",
    detaljer: "Ringen er af sterling sølv med et drys af lysegrønne safirer i 18K guld rundt om en fænomenalt smuk grøn turmalin. Ringen har også en gylden frø af 14K guld. Denne ring vil altid have sommer med sig!",
    billeder: [
      { id: "3b4bab_875e04a8059f4cd2bce5105c4dc92d12~mv2.jpg", alt: "Ring med græsgrøn turmalin" },
      { id: "3b4bab_ceeaf71962184968b7cf5e9231dbaa02~mv2.jpg", alt: "Den græsgrønne Turmalin" },
      { id: "3b4bab_a9de508951a748fc8d8844effb01c7af~mv2.jpg", alt: "Den græsgrønne Turmalin set fra siden" },
    ],
  },
  {
    slug: "firbenet-med-den-roede-turmalin",
    type: "ringe",
    titel: "Firbenet med den røde turmalin",
    pris: "16.500 kr.",
    materiale: "Sterling sølv med guld, røde turmaliner, blå safirer",
    beskrivelse: "Et firben der hviler om en rød turmalin.",
    detaljer: "En ring af sterling sølv med gulddetaljer, røde turmaliner og blå safirer.",
    billeder: [
      { id: "3b4bab_bf51728c20fd43f3afcdee4e32afe23c~mv2.jpg", alt: "Firbenet med den røde turmalin" },
    ],
  },
  {
    slug: "oereringe-barokperler",
    type: "oereringe",
    titel: "Øreringe med barokperler",
    pris: "7.500 kr.",
    materiale: "Oxideret sterling sølv med guld, barokperler",
    beskrivelse: "Barokperler i oxideret sølv.",
    detaljer: "Øreringe af oxideret sterling sølv med guldårer i vingerne og barokke perler. Findes i et lille og et stort sæt.",
    billeder: [
      { id: "3b4bab_09a4382e0c4546938978b0a8a40a6cad~mv2.jpg", alt: "Øreringe med barokperler" },
      { id: "3b4bab_873076f14fb4428aaa58ede340688309~mv2.jpeg", alt: "Øreringe med barokperler, båret" },
    ],
  },
  {
    slug: "signet-ringen",
    type: "ringe",
    titel: "Signet-ringen",
    pris: "10.350 kr.",
    materiale: "Sterling sølv, 14K og 18K guld, genbrugskoral",
    beskrivelse: "Signetring med St. Antonio di Padova.",
    detaljer: "En ring af sterling sølv med en medalje af 14K guld med St. Antonio di Padova, fattet i 18K guld med genbrugskoral.",
    billeder: [
      { id: "3b4bab_401ebf0700f74c74b8d60e7bf9456f6c~mv2.jpg", alt: "Signet-ringen" },
      { id: "3b4bab_2adc8cf8bd1242748d1c6f5b2c4d457b~mv2.jpg", alt: "St. Antonio di Padova" },
      { id: "3b4bab_3f8458b34a5b460c91c07adb6ececbc0~mv2.jpeg", alt: "St. Antonio di Padova, detalje" },
    ],
  },
  {
    slug: "sommer-kom",
    type: "ringe",
    titel: "Sommer, kom!",
    pris: "13.500 kr.",
    materiale: "Sterling sølv, 18K guld, sydhavsperle, diamanter",
    beskrivelse: "Ring med sommerfugle. Venter på fred og sommer.",
    detaljer: "En ring af sterling sølv med en gylden sommerfugl, en gylden sydhavsperle fra Japan (2018) og to diamanter i 18K guld.",
    billeder: [
      { id: "3b4bab_c299192e1559455fa242e03d4730528f~mv2.jpg", alt: "Sommer, kom!" },
      { id: "3b4bab_5086e57052da45eabad396004023a27e~mv2.jpg", alt: "Kom Sommeren!" },
      { id: "3b4bab_08c3a3c484b745afa5752d4baadb2e94~mv2.jpg", alt: "Venter på fred og sommer" },
    ],
  },
  {
    slug: "froeer-paa-tahiti-perler",
    type: "oereringe",
    titel: "Frøer på Tahiti-perler",
    pris: "13.500 kr.",
    materiale: "Sterling sølv, 14K guld, Tahiti-perler",
    beskrivelse: "Frøer i 14K guld på Tahiti-perler.",
    detaljer: "Et sæt øreringe af sterling sølv med Tahiti-perler og frøer af 14K guld.",
    billeder: [
      { id: "3b4bab_764d9af5efc74d469933c6427051b36d~mv2.jpeg", alt: "Frøer på Tahiti-perler" },
      { id: "3b4bab_bdc4b86a560a4354bfdcbaf16d84d3e3~mv2.jpg", alt: "14K frøer på Tahitiperler" },
    ],
  },
  {
    slug: "de-boelgede-ringe",
    type: "ringe",
    titel: "De bølgede ringe",
    pris: "fra 3.250 kr.",
    materiale: "Børstet sølv, guld, turmaliner, brillanter",
    beskrivelse: "Bølgede sølvringe med turmaliner. Bred 4.750 kr., smal 3.250 kr.",
    detaljer: "Ringe af børstet sølv med guldkugler, turmaliner og brillanter. De brede ringe koster 4.750 kr., de smalle 3.250 kr.",
    billeder: [
      { id: "3b4bab_b9b3dec92b024ae6a87f447e3face779~mv2.jpg", alt: "De bølgede ringe" },
      { id: "3b4bab_76d4201f2c4247139e1b904dc6c225da~mv2.jpg", alt: "De bølgede sølvringe med turmaliner" },
    ],
  },
  {
    slug: "kaninen-med-de-roede-oejne",
    type: "ringe",
    titel: "Kaninen med de røde øjne",
    pris: "4.800 kr.",
    materiale: "Sølv og rubiner",
    beskrivelse: "Kaninringen.",
    detaljer: "En sølvring med rubiner. Tung og blød at røre ved, og justerbar i størrelse.",
    billeder: [
      { id: "3b4bab_94e176212a7f442b842eaaf7f867840a~mv2.jpg", alt: "Kaninen med de røde øjne" },
      { id: "3b4bab_99355781922a4335b381add8162f170c~mv2.jpg", alt: "Kaninringen" },
      { id: "3b4bab_b505817c95e045348815935d72acd100~mv2.jpg", alt: "Kaninringen set fra siden" },
    ],
  },
];

export function erSolgt(pris: string) {
  return pris.trim().toLowerCase() === "solgt";
}

// "fra 3.250 kr." -> 3250
export function prisTal(pris: string) {
  const tal = pris.match(/\d[\d.]*/)?.[0];
  return tal ? Number(tal.replace(/\./g, "")) : undefined;
}
