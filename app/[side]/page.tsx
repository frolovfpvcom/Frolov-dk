import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blokke } from "@/components/Blokke";
import { SideTop } from "@/components/Dele";
import { T, tekst } from "@/components/Tekst";
import { findSide } from "@/lib/lister";

// Sider Ossip selv opretter under "Sider og menu". De bygges, første gang nogen besøger dem.
type Props = { params: Promise<{ side: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { side } = await params;
  const punkt = await findSide(side);
  if (!punkt) return {};
  return {
    title: await tekst(`side.${side}.titel`, punkt.label),
    robots: punkt.skjult ? { index: false } : undefined,
  };
}

export default async function EgenSide({ params }: Props) {
  const { side } = await params;
  const punkt = await findSide(side);
  if (!punkt) notFound();

  return (
    <>
      <SideTop lille="Fra værkstedet" titel={<T id={`side.${side}.titel`}>{punkt.label}</T>}>
        <T id={`side.${side}.intro`} placeholder="Skriv en kort indledning (eller lad den stå tom)" />
      </SideTop>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Blokke liste={`side.${side}.blokke`} tekstId={(id) => `side.${side}.${id}`} />
      </div>
    </>
  );
}
