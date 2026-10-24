import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// To cookies: en hemmelig der beviser login, og en synlig som kun fortæller
// browseren at den skal vise redigeringsværktøjet.
export const LOGIN_COOKIE = "frolov_rediger";
export const UI_COOKIE = "frolov_rediger_ui";

function adgangskode() {
  return process.env.REDIGER_ADGANGSKODE ?? "";
}

function token() {
  return createHmac("sha256", adgangskode()).update("frolov-rediger").digest("hex");
}

export function rigtigAdgangskode(forsoeg: string) {
  const a = Buffer.from(forsoeg);
  const b = Buffer.from(adgangskode());
  return b.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

export async function erLoggetInd() {
  if (!adgangskode()) return false;
  const vaerdi = (await cookies()).get(LOGIN_COOKIE)?.value;
  return vaerdi === token();
}

export async function logInd() {
  const jar = await cookies();
  const valg = { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" as const, secure: true };
  jar.set(LOGIN_COOKIE, token(), { ...valg, httpOnly: true });
  jar.set(UI_COOKIE, "1", valg);
}

export async function logUd() {
  const jar = await cookies();
  jar.delete(LOGIN_COOKIE);
  jar.delete(UI_COOKIE);
}
