import { billeder } from "./billeder";

// Billederne fra den gamle Wix-side ligger nu i public/billeder. Et ukendt id hentes stadig hos Wix.
export function wix(id: string, str: number) {
  return billeder[id] ?? `https://static.wixstatic.com/media/${id}/v1/fit/w_${str},h_${str},q_85/${id}`;
}
