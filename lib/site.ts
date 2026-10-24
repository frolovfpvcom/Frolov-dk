export const site = {
  navn: "Ossip Frolov",
  url: "https://www.frolov.dk",
  telefon: "28 11 17 41",
  telefonLink: "tel:+4528111741",
  telefonIntl: "+45 28 11 17 41",
  email: "ossip@frolov.dk",
  instagram: "https://www.instagram.com/ossip_frolov/",
  instagramNavn: "@ossip_frolov",
  facebook: "https://www.facebook.com/Frolovsmykkedesign",
  betaling: "MobilePay, kort, kontant eller bankoverførsel",
};

export const menu = [
  { href: "/smykker", label: "Til salg" },
  { href: "/vielsesringe", label: "Vielsesringe" },
  { href: "/galleri", label: "Gallerier" },
  { href: "/kunstneren", label: "Kunstneren" },
  { href: "/workshops", label: "Workshops" },
  { href: "/det-praktiske", label: "Det praktiske" },
  { href: "/kontakt", label: "Kontakt" },
];

export function kontaktLink(emne: string) {
  return `/kontakt?smykke=${encodeURIComponent(emne)}`;
}
