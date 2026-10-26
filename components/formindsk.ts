// Store billeder fra telefonen skaleres ned i browseren før upload.
// Med forhold (bredde/højde) skæres billedet til fra midten, så det passer i rammen
// på det billede det erstatter.
export async function formindsk(fil: File, maks = 2400, forhold?: number) {
  try {
    const bmp = await createImageBitmap(fil);
    let [sx, sy, sb, sh] = [0, 0, bmp.width, bmp.height];
    if (forhold && Math.abs(sb / sh - forhold) > 0.02) {
      if (sb / sh > forhold) {
        sb = Math.round(sh * forhold);
        sx = Math.round((bmp.width - sb) / 2);
      } else {
        sh = Math.round(sb / forhold);
        sy = Math.round((bmp.height - sh) / 2);
      }
    }
    const skala = Math.min(1, maks / Math.max(sb, sh));
    if (skala === 1 && sb === bmp.width && sh === bmp.height && fil.size < 1_500_000) return fil;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sb * skala);
    canvas.height = Math.round(sh * skala);
    canvas.getContext("2d")!.drawImage(bmp, sx, sy, sb, sh, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.86));
    if (!blob) return fil;
    return new File([blob], fil.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return fil;
  }
}
