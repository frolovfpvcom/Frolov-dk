// Billederne ligger stadig hos Wix. Wix skalerer dem selv ud fra URL'en.
export function wix(id: string, str: number) {
  return `https://static.wixstatic.com/media/${id}/v1/fit/w_${str},h_${str},q_85/${id}`;
}
