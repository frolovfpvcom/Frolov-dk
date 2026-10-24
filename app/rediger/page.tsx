import type { Metadata } from "next";
import { SideTop } from "@/components/Dele";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Rediger siden",
  robots: { index: false, follow: false },
};

export default function Rediger() {
  return (
    <>
      <SideTop lille="Kun for Ossip" titel="Rediger siden">
        Log ind, og gå så rundt på siden som normalt. Dobbeltklik på en tekst for at rette den, eller på et billede
        for at skifte det.
      </SideTop>
      <div className="mx-auto max-w-md px-5 sm:px-8">
        <LoginForm />
      </div>
    </>
  );
}
